import { HomeIcon, FolderIcon, CogIcon, UserIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

const input = [{
  name: "Dashboard",
  icon: HomeIcon,
  link: "/dashboard"
},
{
  name: "Cases",
  icon: FolderIcon,
  link: "/judge-cases"
},
{
  name: "Settings",
  icon: CogIcon,
  link: "/judge-settings"
},
{
  name: "Profile",
  icon: UserIcon,
  link: "/judge-profile"
}]

const Sidebar = () => {
  return (
    <div className="mt-15 flex flex-col gap-8 pl-5  ">
      
        {input.map((item,index) => {
        return (
        <div key = {index} className="flex items-center gap-5 rounded-lg ">
          <item.icon className="h-6 w-6"/>
          <Link to={item.link} className="text-white font-mono text-xl font-bold">{item.name}</Link>
        </div>
        )})}

    </div>
      
  )
};

export default Sidebar;