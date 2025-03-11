import React, { useEffect } from 'react'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router';


function RedirectUnauthUsers({children}) {

    const {user}=useAuthStore();
    const navigate=useNavigate();

    useEffect(()=>{

        if(!user){
            navigate("/login");
           
        }
    },[user,navigate]);

    if(!user){
        return null;
    }

  return ( 
  
  <>{children}</>
)
  
}

export default RedirectUnauthUsers
