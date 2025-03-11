import React, { useEffect, useState } from 'react'
import { useBookStore } from '../store/bookStore'
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router';
import { useAuthStore } from '../store/auth';
import toast from "react-hot-toast"
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

function BookPage() {

    const {user}=useAuthStore();
    const {fetchBook,deleteBook,book,isLoading}=useBookStore();
    //const {id}=useParams();
    const params=useParams();
    const navigate=useNavigate();
    const[open,setOpen]=useState(false);

    useEffect(()=>{

        //fetchBook(id)
        fetchBook(params.id)
        
    },[fetchBook,params])   //id

    if(isLoading){

        return <p>Loading...</p>
    }

    console.log("book",book);


    const handleDelete=async()=>{

        const {message}= await deleteBook(params.id)
        toast.success(message)
        navigate("/")
    }

  return (
    <div className='min-h-screen text-[#252422] bg-[#f3f5f0] px-4 md:px-12 pb-10'>

        <p className='cursor-pointer py-3' onClick={()=>navigate("/")} >Go Back</p>

        <div className='flex flex-col md:flex-row'>

            <div className='md:basis-[30%] md:mr-6 mx-auto w-full'>
                <img src={book?.image} className='max-h-[50h] mx-auto' alt="imageName" />

                <Link to={book?.image} target="_blank">
                   <div className='w-full flex justify-center items-center'>
                    <button className='bg-[#00BFFF] text-[#F5F5F5] px-3 py-2 w-full md:max-w-52 mt-3'>
                        Read
                    </button>
                   </div>
                </Link>
            </div>

            <div className='basis-[65%] mt-6 md:mt-0 md:max-w-4xl'>
                <div className='flex justify-between items-center'>
                    <p>Uploaded by: <span className='text-[#944424]'>@{book?.user.username}</span></p>

                    {user?._id===book?.user?._id && 
                    <div className='text-2xl font-bold -mt-2 relative'> 
                        <span className='cursor-pointer tracking-widest' onClick={()=>setOpen(!open)}>...</span>

                        {open && <div className='absolute bg-[#f5f5f5] shadow-md p-3 px-10 text-base font-normal right-0 top-10'>
                            <Link to={`/book/${book._id}/update`} className="flex items-center space-x-3">
                                <PencilIcon className="h-4 w-4 text-[#4169E1]" />
                                <p className='md-2 pb-2 border-b border-gray-300 '>Update</p>
                            </Link>
                            <div className="flex items-center space-x-3">
                            <TrashIcon className="h-4 w-4 cursor-pointer" />
                            <p onClick={handleDelete} className='text-red-500 cursor-pointer pb-2'>Delete</p>
                            </div>
                            </div>}
                    </div>}

                </div>

                <h1 className='text-4xl md:text-xl lg:text-6xl font-semibold'>{book?.title}</h1>
                {book?.subtitle && <h3>{book?.subtitle}</h3>}

                <p className='pl-4 pt-2'>Written by : {book?.author}</p>
                <p className='mt-2 font-semibold text-lg md:text-xl'>Review </p>
                <p className='md:text-lg'>{book?.review}</p>
            </div>
        </div>

    </div>
  )
}

export default BookPage
