import React ,{useState} from 'react'
import Bgvideo from "../assets/bg_video.mp4"
import { useNavigate } from 'react-router';

const Hero = () => {

  const[searchTerm,setSearchTerm]=useState("");
  const navigate=useNavigate();

  const handleSubmit=(e)=>{

    e.preventDefault();

    const urlParms=new URLSearchParams(window.location.search)
    urlParms.set("searchTerm",searchTerm)

    const searchQuery=urlParms.toString();

    navigate(`/search?${searchQuery}`)
  }

  return (
    <div className='relative h-[75vh] lg:h-[70vh] text-[#FFFCF2] px-4 md:px-12 overflow-hidden'>
        {/* background over lay .. and goto pexels.com website to get video */}
      <div className='bg-[#252422] w-full h-full absolute top-0 left-0 opacity-80 -z-10'></div>

      <div className='absolute inset-0 -z-15'>

        <video className='object-cover object-center w-full h-full ' autoPlay loop muted>
            <source src={Bgvideo} type='video/mp4'/>
        </video>

      </div>

      <div className='w-full h-full flex flex-col justify-center items-center z-15'>

        {/* TO change font styles search in google  - eb garamond font */}

        <h1 className='text-3xl md:text-4xl lg:text-5xl pb-4 lg:pb-16 text-center max-w-10xl -mt-10'>
          Explore endless stories <span className='text-[#4169E1]'>share your favorites</span> and uncover hidden <br /> 
          <span className='block mt-4'>gems of knowledge </span>
        </h1>

        <form action="" className='relative w-full max-w-sm md:max-w-xl lg:max-w-3xl text-base lg:text-lg' onSubmit={handleSubmit}>
            <input type="text" placeholder='Ex :- count of monto cristo' className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-[#FFFCF2]' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>

            <button type='submit' className='absolute right-0 top-0 bottom-0 bg-[#403D39] px-4 border border-white font-semibold rounded-r'>Search</button>
        </form>

      </div>

    </div>
  )
}

export default Hero
