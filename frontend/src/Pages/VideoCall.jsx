import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

// Connect to signaling server (make sure to update the URL if needed)
const socket = io("http://localhost:5000");

function VideoCall() {
  const { roomId } = useParams(); // Extract roomId from URL
  const [userStream, setUserStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const videoRef = useRef(null); // Ref to display local video
  const remoteVideoContainerRef = useRef(null); // Ref to hold remote video elements

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", roomId, socket.id); // Join the room using roomId and socket ID
    }

    socket.on("user-connected", (userId) => {
      console.log("New user joined:", userId);
      if (userStream) {
        createPeerConnection(userId); // Create peer connection only if userStream is available
      }
    });

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.disconnect();
      if (userStream) {
        userStream.getTracks().forEach(track => track.stop()); // Stop local media tracks on unmount
      }
    };
  }, [roomId, userStream]); // Include userStream as a dependency to react to stream changes

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setUserStream(stream); // Store the local user stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Display local video in the UI
      }

      socket.emit("join-room", roomId, socket.id); // Notify others that user has joined the room
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const createPeerConnection = (userId) => {
    if (!userStream) {
      console.error("User stream is not available.");
      return;
    }

    const pc = new RTCPeerConnection();
    const localStream = userStream;

    // Add local tracks to the peer connection
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: userId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      displayRemoteStream(remoteStream, userId); // Display the remote stream
    };

    setPeerConnections((prev) => ({
      ...prev,
      [userId]: pc,
    }));

    createOffer(pc, userId); // Start the offer process with the new peer
  };

  const createOffer = async (pc, userId) => {
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { to: userId, offer });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleOffer = async ({ from, offer }) => {
    const pc = new RTCPeerConnection();
    const localStream = userStream;

    // Add local tracks to the peer connection
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: from, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      displayRemoteStream(remoteStream, from); // Display the remote stream
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { to: from, answer });
    } catch (error) {
      console.error("Error handling offer:", error);
    }

    setPeerConnections((prev) => ({
      ...prev,
      [from]: pc,
    }));
  };

  const handleAnswer = async ({ from, answer }) => {
    const pc = peerConnections[from];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = ({ from, candidate }) => {
    const pc = peerConnections[from];
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const displayRemoteStream = (remoteStream, userId) => {
    const videoElement = document.createElement("video");
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.srcObject = remoteStream;

    remoteVideoContainerRef.current.appendChild(videoElement); // Append video to container
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 h-screen text-white">
      <h2 className="text-2xl font-semibold mb-4">Video Call Room: {roomId}</h2>
      <div className="flex space-x-6 mb-6">
        <div>
          <h3>Your Video</h3>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-80 h-60 border-2 border-gray-600 rounded"
          />
        </div>
        <div>
          <h3>Remote Videos</h3>
          <div
            ref={remoteVideoContainerRef}
            className="grid grid-cols-2 gap-4"
          >
            {/* Remote videos will be appended here */}
          </div>
        </div>
      </div>
      <button
        onClick={startCall}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md"
      >
        Start Call
      </button>
    </div>
  );
}

export default VideoCall;
