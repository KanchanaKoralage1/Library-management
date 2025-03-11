import React from "react";
import { Link ,useNavigate} from "react-router";
import { useAuthStore } from "../store/auth";
import toast from "react-hot-toast";

function Navbar() {

  const{user,logout}=useAuthStore();
  const navigate=useNavigate();

  console.log("user : ",user)

  const handleLogout=async()=>{

    const{message}=await logout()
    toast.success(message)
    navigate("/login");
  }

  return (

    <nav className="bg-[#2C3E50] flex justify-between items-center text-[#FFFFFF] px-4 md:px-12 md:py-8">

      <Link to={"/"}><label className="font-bold tracking-wider md:text-lg lg:text-4xl cursor-pointer text-[#87CEEB]">
        Wisdom Library
       </label></Link>


      {user ? (
        <div className="flex items-center space-x-5 md:text-lg cursor-pointer">

          <Link to={"/addbook"}><p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Add book</p></Link>

          <p onClick={handleLogout} className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Logout ({user.username})</p>

          

        </div>
      ):(

        <div className="flex items-center space-x-5 md:text-lg" >

        <Link to={"/login"}><p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Add book</p></Link>
        <Link to={"/login"}><p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Log in</p></Link>
        <Link to={"/signup"}><p className="hover:bg-[#1A252F] hover:text-white px-4 py-1 rounded">Sign up</p></Link>    

        
      </div>


      )}

      

    </nav>
  );
}

export default Navbar;
