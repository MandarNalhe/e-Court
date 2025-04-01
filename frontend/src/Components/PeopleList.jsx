const PeopleList = ({name,img}) => {
    
  
    return (
      <div>
        <img className="rounded-full w-10 h-10" src={img} alt="" />
        <h3 className="text-s font-bold">{name}</h3>
      </div>
    );
  };
  
  export default PeopleList;
  