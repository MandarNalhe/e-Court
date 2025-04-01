import { useState } from "react";

function CaseRegister() {


    const[caseData, setCaseData] = useState({
        caseNumber: "",
        defendant : "",
        caseDetails: "",
    })

   const handleChange = (e) => {
            setCaseData({...caseData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // send the data to the server here
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/cases/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(caseData)
            })
            const data = await response.json();
            if (response.ok) {
                alert("Case registered successfully!");
            } else {
                alert("Failed to register case. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    }

  return (
    <div className="h-screen w-full bg-[#111111] flex items-center justify-center p-2">
        <div className="w-[50%] h-[80%] bg-[#252525] rounded-xl p-5">
            <h1 className="text-3xl font-mono font-bold text-white text-center">Register Case</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5 ">
                <h3 className="text-xl text-white font-thin font-mono mt-3">Case Number</h3>
                <input type="text" placeholder="Case Number" value={caseData.caseNumber} name='caseNumber' onChange={handleChange} className="p-2 rounded-xl bg-[#111111] text-white w-[40%]" />
                <h3 className="text-xl text-white font-thin font-mono">Case Details</h3>
                <textarea placeholder="Description" value={caseData.caseDetails} onChange={handleChange} name='caseDetails' className="p-2 rounded-xl bg-[#111111] text-white h-[20%] w-[40%]" />
                <h3 className="text-xl text-white font-thin font-mono">Defendant Email</h3>
                <input type="text" placeholder="xyz@gmail.com" value={caseData.defendant} onChange={handleChange} name="defendant" className="p-2 rounded-xl bg-[#111111] text-white w-[40%]" />
                <button type="submit" className="bg-[#48289c] p-3 rounded-lg text-white font-semibold ">Register Case</button>
            </form>
        </div>
    </div>
  );
}

export default CaseRegister;