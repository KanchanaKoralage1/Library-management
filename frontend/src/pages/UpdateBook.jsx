import React,{useEffect, useState} from 'react'
import toast from "react-hot-toast"
import { useBookStore } from '../store/bookStore';
import { useNavigate, useParams } from 'react-router';


function UpdateBook() {

  const[image,setImage]=useState("");
  const[title,setTitle]=useState("");
  const[Subtitle,setSubtitle]=useState("");
  const[author,setAuthor]=useState("");
  const[link,setLink]=useState("");
  const[review,setReview]=useState("");

  const params=useParams();

  const {updateBook,isLoading,error,fetchBook,book}=useBookStore()
  const navigate=useNavigate()


  const handleImageChange=(e)=>{

    const file=e.target.files[0];
    let reader=new FileReader()

    reader.readAsDataURL(file);
    reader.onloadend=function(){
      setImage(reader.result);
    }
  }

  const handleSubmit=async (e)=>{

    e.preventDefault();

    // console.log(image,title,Subtitle,author,link,review)

    if(!title || !Subtitle || !author || !link){
      toast.error("Please fill in required info")
    }

    const {message}=await updateBook(params.id,image,title,Subtitle,author,link,review)

    toast.success(message)
    navigate(`/book/${book._id}`)
  }

  useEffect(()=>{

    fetchBook(params.id)

  },[fetchBook, params])

  useEffect(()=>{

    if(book){
        setTitle(book.title)
        setSubtitle(book.Subtitle)
        setAuthor(book.author)
        setLink(book.link)
        setReview(book.review)
    }
  },[book])

  return (

   <div className='min-h-screen text-[#252422] bg-[#f3f5f0] px-4 md:px-14 pb-14'>

      <h1 className='text-center font-semibold pt-8 md:text-2xl w-full max-w-xl mx-auto'>Update The Book Details</h1>


      <form action="" className='flex flex-col justify-center items-center w-full max-w-xl mx-auto space-y-8 mt-12' onSubmit={handleSubmit}>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Book Image * </label>
          <input type="file" accept='image/*' className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' onChange={handleImageChange} />
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Title *</label>
          <input type="text" className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={title} onChange={(e)=>setTitle(e.target.value)}/>
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Sub Title (Optional)</label>
          <input type="text" className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={Subtitle} onChange={(e)=>setSubtitle(e.target.value)}/>
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Author *</label>
          <input type="text" className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={author} onChange={(e)=>setAuthor(e.target.value)}/>
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Link *</label>
          <input type="text" className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={link} onChange={(e)=>setLink(e.target.value)}/>
        </div>

        <div className='flex flex-col w-full'>
          <label htmlFor="" className='md:text-lg'>Personal Review (Optional)</label>
          <textarea rows={4} className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50' value={review} onChange={(e)=>setReview(e.target.value)}/>
        </div>

        {error && <p className='text-red-500'>{error}</p>}
        <button className='w-full bg-[#00BFFF] text-[#FFFCF2] py-2 font-medium rounded-lg' type='submit' >{isLoading ? "Please wait...." : "Update Book"}</button>

      </form>
    </div>
  )
}

export default UpdateBook
