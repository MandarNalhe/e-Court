import Sidebar from "../Components/Sidebar";
import Casecard from "../Components/Casecard";
import UpcomingCases from "../Components/UpcomingCases";
import LiveCase from "../Components/LiveCase"
import PeopleList from "../Components/PeopleList";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const Dashboard = () => {
  const socket = io("https://backend-production-969c.up.railway.app"); // Adjust the backend URL accordingly
  const navigate = useNavigate();
  const people =[
    {
      name : "John Doe",
      img : "https://www.w3schools.com/howto/img_avatar.png"
    },
    {
      name : "Jane Doe",
      img : "https://www.w3schools.com/howto/img_avatar.png"
    },
    {
      name : "John Doe",
      img : "https://www.w3schools.com/howto/img_avatar.png"
    },
    {
      name : "Jane Doe",
      img : "https://www.w3schools.com/howto/img_avatar.png"
    }
  ]
  const [cases, setCases] = useState([]);

  useEffect(()=>{
  const getCases = async() =>{
    try{
      const token = localStorage.getItem("token")
    const response = await fetch("https://backend-production-969c.up.railway.app/api/cases/",{
      method: "GET",
      headers : {"Content-Type" : "application/json",
                  "Authorization" : `Bearer ${token}`
      }
    })
    const data = await response.json();
    setCases(data);
    
  }catch(e){
    alert("Something went Wrong",e);
    }
  };
  getCases()
},[])

  const handleRegister = async (e) => {
    setTimeout(()=>{
      navigate("/case-register");
    }, 100)

  }

  const handleScheduling = async (e) => {
    setTimeout(()=>{
      navigate("/case-schedule");
    }, 100)
  }
  
  const handleVideo = () => {
    socket.emit("start-call", (roomId) => {
      console.log("Room created:", roomId);
      navigate(`/video-call/${roomId}`);
    });
  };
  
   

  return(
    <div className="flex bg-[#1f1f1f] text-white h-screen w-full">
      <div className="w-[20%] bg-[#252525] h-screen p-3">
        <div className="flex items-center gap-1">
          <img className="h-20 w-20 object-cover" src={logo} alt="" />
          <h1 className="text-3xl font-mono font-bold">e-Judicate</h1>
        </div>
        <Sidebar /> {
        localStorage.getItem("role") === "judge" ? <button onClick={handleScheduling} className="bg-[#48289c] h-20 w-[80%] mt-20 rounded-lg text-lg font-semibold ml-5"> Schedule Session</button>
        : localStorage.getItem("role") ==="petitioner"? <button onClick={handleRegister} className="bg-[#48289c] h-20 w-[80%] mt-20 rounded-lg text-lg font-semibold ml-5"> Register Case </button>
        : null
        }
      </div>
      <div className="w-[50%] p-9 ">
          <h1 className="text-3xl font-mono font-bold ml-3 mb-5">Dashboard</h1>
          <div className="bg-[#252525] p-3 rounded-lg" >
          <h1 className="text-2xl font-mono font-semibold ml-3">Next Session</h1>
            {cases.length > 1 && <Casecard caseData={cases[1]}/>}
          </div>  
          <div className="mt-3 bg-[#252525] p-3 rounded-lg">
          <h1 className="text-2xl font-mono font-semibold">Active Cases</h1>
          <div>
            { cases.filter((item,index)=>(
              index < 3 
            )).map((item,index)=>{
              return <Casecard key={index} caseData={item}/>
            })}
          </div>
        </div>
        <div className="mt-3 bg-[#252525] p-3 rounded-lg">
          <h1 className="text-xl font-mono font-semibold">People You Know</h1>
          <div className="flex gap-3 justify-around">
            {people.map((item,index)=>{
              return <PeopleList key={index} {...item}/>
            })}
          </div>
        </div> 
      </div>
      <div className="w-[30%] h-screen  p-5">
        <div>
         {cases.length>2 && <LiveCase cases={cases[2]}/>}
        </div>
        <div>
          {cases.length>3 && cases[cases.length-1].hearingDate != null && <UpcomingCases cases={cases[cases.length -1 ]}/>}
        </div>
        <button onClick={handleVideo} className="rounded-lg bg-[#48289c] text-2xl font-bold p-8 w-[100%]">Start Session</button> 
      </div>
    </div>
  )
};

export default Dashboard;
