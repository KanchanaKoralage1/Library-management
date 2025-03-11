import React ,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router'
import { useBookStore } from '../store/bookStore';
import { Link } from 'react-router';

function SearchPage() {

    const navigate=useNavigate();

    const[searchTerm,setSearchTerm]=useState("");
    const{searchBooks,books}=useBookStore();
    

    const handleSubmit=async (e)=>{

        e.preventDefault();

         const urlParams=new URLSearchParams(window.location.search)
        

        urlParams.set("searchTerm",searchTerm)

        const searchQuery=urlParams.toString();

        //await searchBooks(searchQuery)
        
        await searchBooks(searchTerm);

         navigate(`/search?${searchQuery}`)

    
    
      }

      useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
    
        if (searchTermFromUrl) {
            searchBooks(searchTermFromUrl);  //Ensure correct search term is used
            setSearchTerm(searchTermFromUrl);
        }
    }, [searchBooks]);
    
  

    console.log("Search Result :",books)

  return (
    <div className='min-h-screen text-[#252422] bg-[#F5F5F5] px-4 md:px-12 pb-10'>
      <p className='cursor-pointer py-3' onClick={()=>navigate("/")} >Go Back</p>


      <div className='w-full h-full flex flex-col justify-center items-center'>

        <form action="" className='relative w-full max-w-sm md:max-w-xl lg:max-w-3xl text-base lg:text-lg' onSubmit={handleSubmit}>
            <input type="text" placeholder='e.g. count of monto cristo' className='w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-[#FFFCF2] border border-black' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />

            <button type='submit' className='absolute right-0 top-0 bottom-0 bg-[#403D39] px-4 border border-black font-semibold rounded-r text-[#F5F5F5]'>Search</button>
        </form>

      </div>

      <h1 className='font-semibold pt-8 pb-6 text-xl md:text-2xl'>Search result</h1>

      {books.length > 0 ?(

            <div className='flex flex-warp justify-cener gap-5 lg:gap-8 max-w-6xl mx-auto'>
                {books.map((book,index)=>(
                    <Link key={index} to={`/book/${book._id}`} className='block'>
                    <div className='cursor-pointer w-36 md:w-40 xl:w-44 shadow-sm hover:shadow-md rounded-b-md'>
                        <div className='h-48 md:h-52 xl:h-60 bg-gray-900'>
                            <img src={book.image} alt="bookimage" className='w-full h-full object-cover object-center'/>
                        </div>

                        <div className='p-4'>
                            <h2 className='mb-2 font-semibold text-base md:text-lg'>{book.title}</h2>
                            <p className='text-sm md:text-base'>{book.author}</p>
                        </div>

                    </div>
                    </Link>
                ))}
            </div>
      ): <p>No book found</p>}

    </div>

  )
}

export default SearchPage
