import { VscAccount } from "react-icons/vsc";

const Casecard = ({caseData}) => {
  // console.log("Received props in CaseCard:", props);
  const handleCaseClick = () => {
    console.log("Case clicked");
  }
    return (
      <div onClick={handleCaseClick} className="flex justify-between items-center w-[100%] p-5 h-fit font-mono text-center text-white gap-5 ">
        <div className="bg-[#323232] p-4 rounded-md shadow-lg w-[7%]">
          <VscAccount className="fit-cover"/>
        </div>
        <div className="w-[50%]">
          <h1 className="font-bold text-lg">Case : {caseData.caseNumber}</h1>
          <h3>{caseData.caseDetails}</h3>
        </div>
        <div className="w-[23%]">
          <h1 className="font-bold text-lg">Status</h1>
          <h3 className={` ${caseData?.status == 'Pending'? 'text-red-500' :'text-green-500'}`}>{caseData.status}</h3>
        </div>
        <div className="w-[20%]">
          <h2 className="font-bold text-lg">Dates</h2>
          <h3>{new Date(caseData.hearingDate).toLocaleDateString("en-US")}</h3>
        </div>
      </div>
    );
  };
  
  export default Casecard;
  