import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://backend-production-969c.up.railway.app");

const VideoCallPage = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [inCall, setInCall] = useState(false);
  const [roomId, setRoomId] = useState("test-room");
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    socket.on("user-connected", async (userId) => {
      console.log("User connected:", userId);
      await createOffer(userId);
    });

    socket.on("offer", async ({ from, offer }) => {
       console.log("Offer received from:", from);
      await handleOffer(from, offer);
    });

    socket.on("answer", async ({ from, answer }) => {
      console.log("Answer received from:", from);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", ({ from, candidate }) => {
      console.log("ICE Candidate received from:", from);
      peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      socket.emit("join-room", roomId);
      setupPeer(stream);
      setInCall(true);
    } catch (err) {
      console.error("Error accessing camera/microphone:", err);
    }
  };

  const leaveCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }

    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }

    setInCall(false);
  };

  const setupPeer = (stream) => {
    const pc = new RTCPeerConnection();
    peerRef.current = pc;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
  };

  const createOffer = async (toUserId) => {
    const pc = peerRef.current;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", {
      to: toUserId,
      offer,
    });
  };

  const handleOffer = async (from, offer) => {
    const pc = peerRef.current;
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer", {
      to: from,
      answer,
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Video Call Room</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
        <div>
          <h4>Your Video</h4>
          <video ref={localVideoRef} autoPlay playsInline muted width="300" />
        </div>
        <div>
          <h4>Remote Video</h4>
          <video ref={remoteVideoRef} autoPlay playsInline width="300" />
        </div>
      </div>

      {!inCall ? (
        <button onClick={joinCall} style={btnStyle}>Join Call</button>
      ) : (
        <button onClick={leaveCall} style={{ ...btnStyle, background: "crimson" }}>Leave Call</button>
      )}
    </div>
  );
};

const btnStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
};

export default VideoCallPage;
