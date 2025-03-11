import React,{useEffect} from 'react'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router'

function RedirectAuthUsers({children}) {
    const{user}=useAuthStore();
    const navigate=useNavigate();


    useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[user,navigate]);

    if(user){
        return null
    }

  return (
    <>{children}</>
  )
}

export default RedirectAuthUsers
