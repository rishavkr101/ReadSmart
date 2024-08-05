import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isUserInfo, setIsUserInfo] = useState(false)
    const navigate = useNavigate()
    const logoutHandler = (e)=>{
        e.preventDefault();
        localStorage.removeItem("userinfo");
        navigate("/")
    }
    useEffect(() => {
     if(localStorage.getItem("userinfo")){
        setIsUserInfo(true)
     }else{
        setIsUserInfo(false)
     }
    }, [navigate])
    
  return (
    <div className='absolute right-10 top-10 z-50'>
      {
        isUserInfo &&<button onClick={logoutHandler} className='bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-400 hover:scale-105 transition-all'>Logout</button>
      }
    </div>
  )
}

export default Navbar
