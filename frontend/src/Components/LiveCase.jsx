
function LiveCase({cases}) {
  const{caseNumber,petitioner, defendant, caseDetails,status,hearingDate,judge} = cases;
  return (
    <div className="bg-[#48289c] rounded-lg p-5">
      <div className="flex justify-between font-mono ">
        <h3 className="text-red-500">Live</h3>
        <h3>Case Hearing</h3>
      </div>
      <h1 className="text-lg font-bold">Case {caseNumber}</h1>
      <div className="flex justify-around mt-5">
        <div>
            <h3>Start Date</h3>
            <h4>{hearingDate}</h4>
        </div>
        <div>
            <button className="bg-red-500 rounded-xl p-2">Attend</button>
        </div>
      </div>
      <div className="flex justify-around mt-5">
        <div>
            <h2 className="text-lg font-semibold">Defendant</h2>
            <h3>{defendant.name}</h3>
        </div>
        <div>
            <h2 className="text-lg font-semibold">Petitioner</h2>
            <h3>{petitioner.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default LiveCase;