import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Casecard from '../Components/Casecard'
import { useNavigate } from 'react-router-dom'
import logo from "../assets/logo.png"

function Cases(){
    const [cases, setCases] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    useEffect(()=>{
        fetchCases();
    },[])
    const fetchCases = async()=>{
        try{
            const response = await fetch("https://backend-production-969c.up.railway.app/api/cases",{
                headers:{
                    "Authorization" : `Bearer ${token}`
                }
            })
            if(!response.ok){
                throw new Error("Something went wrong");
            }
            const data = await response.json();
            setCases(data);
        }catch(e){
            alert("Something went wrong",e);
        }
    }

    return(
        <div className="flex bg-[#1f1f1f] text-white h-full w-full">
        <div className="w-[20%] bg-[#252525] h-screen p-3">
            <div className="flex items-center gap-1">
            <img className="h-20 w-20 object-cover" src={logo} alt="" />
            <h1 className="text-3xl font-mono font-bold">e-Judicate</h1>
            </div>
            <Sidebar />
        </div>
        <div className="w-[50%] p-9 ">
            <h1 className="text-3xl font-mono font-bold ml-3 mb-5">Cases</h1>
            <div className="bg-[#252525] p-3 rounded-lg" >
            <h1 className="text-2xl font-mono font-semibold ml-3">Case List</h1>
            {cases.map((item,index)=>{
                return <Casecard key={index} caseData={item}/>
            })}
            </div>  
        </div>
        </div>
    )
}
export default Cases;
