import { useState } from "react";
import logo from "../assets/logo.png";
import Sidebar from "../Components/Sidebar";

function CaseSchedule() {
    const [formData, setFormData] = useState({
        caseId: "",
        hearingDate: "",
        scheduledTime: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
       let updatedForm = setFormData((prev) => ({
            ...prev,
            [name]: value
        }))

    }
    
    const handleScheduling = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const{caseId, hearingDate, scheduledTime } = formData;
            const formattedHearingDate = `${hearingDate}T${scheduledTime}:00Z`
            const response = await fetch(`http://localhost:5000/api/cases/assign-hearing/${caseId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({hearingDate: formattedHearingDate})
            })
            console.log(response)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            else{
           
            alert("Case Scheduled Successfully");
            }
        } catch (e) {
            alert("Something went wrong", e);
        }
    }

  
    return (
    <div>
        <div className="flex bg-[#1f1f1f] text-white h-screen w-full">
            <div className="w-[15%] bg-[#111111] h-screen flex flex-col justify-between p-5">
            <div className="flex items-center gap-5 mt-10">
                <img src={logo} alt="" className="h-10 w-10" />
                <h1 className="text-white font-mono text-xl font-bold">Case Scheduling</h1>
            </div>
            <Sidebar />
            </div>
            <div className="w-[85%] flex flex-col p-5 gap-5 overflow-y-scroll">
            <h1 className="text-white font-mono text-xl font-bold">Case Scheduling</h1>
            <div className="flex flex-col gap-5">
                <form onSubmit={handleScheduling} action="" method="put">
                <div className="flex flex-col gap-5 bg-[#252525] p-5 rounded-lg">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="" className="text-white font-mono text-lg font-semibold">Case ID</label>
                        <input type="text" className="bg-[#111111] h-10 w-full rounded-lg p-2" value={formData.caseId} name="caseId" onChange={handleChange} placeholder="Enter Case ID" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="" className="text-white font-mono text-lg font-semibold">Date</label>
                        <input type="date" value={formData.hearingDate} name="hearingDate" onChange={handleChange} className="bg-[#111111] h-10 w-full rounded-lg p-2" placeholder="Enter Date" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="" className="text-white font-mono text-lg font-semibold">Time</label>
                        <input type="time" value={formData.scheduledTime} name="scheduledTime" onChange={handleChange} className="bg-[#111111] h-10 w-full rounded-lg p-2" placeholder="Enter Time" />
                    </div>
                    <button type='submit' className='bg-[#48289c] h-10 w-[20%] rounded-lg text-white font-mono font-semibold'>Schedule</button>
                </div>
                </form>
            </div>
            </div>
        </div>      
    </div>
  );
}

export default CaseSchedule;