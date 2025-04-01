const UpcomingCases = ({cases}) => {
  
    return (
      <div className="bg-[#252525] rounded-lg p-5 mt-5 ">
        <h1 className="text-xl font-bold">Upcoming</h1>
        <div className="flex justify-between font-mono p-2 mt-3">
          <h1 className="text-lg font-bold">Case Number</h1>
          <h1 className="text-lg font-bold">{cases.caseNumber}</h1>
        </div>
        <div className="flex justify-between font-mono p-2 ">
          <h1 className="text-lg font-bold">Status</h1>
          <h1 className="text-lg font-bold">{cases.status}</h1>
        </div>
        <div className="flex justify-between font-mono p-2 ">
          <h1 className="text-lg font-bold">Hearing Date</h1>
          <h1 className="text-lg font-bold">{ cases.hearingDate.split('T')[0]}</h1>
        </div>
        <div className="flex justify-between font-mono p-2 ">
          <h1 className="text-lg font-bold">Defendant</h1>
          <h1 className="text-lg font-bold">{cases.defendant.name}</h1>
        </div>
        <div className="flex justify-between font-mono p-2 mt-3">
          <h1 className="text-lg font-bold">Petitioner</h1>
          <h1 className="text-lg font-bold">{cases.petitioner.name}</h1>
        </div>
      </div>
    );
  };
  
  export default UpcomingCases;
  