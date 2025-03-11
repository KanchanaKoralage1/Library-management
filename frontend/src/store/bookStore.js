import {create} from "zustand";
import axios from "axios";

const API_URL="http://localhost:5000/api";

export const useBookStore=create((set)=>({

    //initial states
    book:null,
    books:[],
    isLoading:false,
    error:null,
    message:null,

    //functions
    addBook:async(image,title,subtitle,author,link,review)=>{

        set({isLoading:true,error:null,message:null})

        try {
            const response=await axios.post(`${API_URL}/addbook`,{
                image,title,subtitle,author,link,review
            },{ withCredentials: true })

            const{message,book}=response.data
            set({book,message,isLoading:false})
            return{message,book}

        } catch (error) {
            set({isLoading:false,
                error:error.response.data.message || "Error adding book",

            });
            throw error;
        }
    },

    fetchBooks:async()=>{
        set({isLoading:true,error:null});

        try {
            const response=await axios.get(`${API_URL}/fetchbooks`,{ withCredentials: true });

            set({books:response.data.books,isLoading:false})

        } catch (error) {
            set({isLoading:false,
                error:error.response.data.message || "Error fetching book",

            });
            throw error;
        }
    },

    searchBooks:async(searchTerm)=>{

        set({isLoading:true, error:null});

        try {
            const response=await axios.get(`${API_URL}/search?searchTerm=${searchTerm}`);

            set({books:response.data.books, isLoading:false})

        } catch (error) {

            set({isLoading:false,
                error:error.response.data.message || "Error searching book",

            });
            throw error;
            
        }

    },


    fetchBook:async(id)=>{

        set({isLoading:true, error:null})

        try {
            const response=await axios.get(`${API_URL}/fetchBook/${id}`)

            set({book:response.data.book, isLoading:false})
        } catch (error) {
            
            set({isLoading:false,
                error:error.response.data.message || "Error fetching book",

            });
            throw error;
        }

    },

    deleteBook:async(id)=>{

        set({isLoading:true, error:null, message:null})

        try {
            const response=await axios.delete(`${API_URL}/deleteBook/${id}`,{ withCredentials: true })
            
            const{message}=response.data

            set({message,isLoading:false})
            return{message}

        } catch (error) {

            set({isLoading:false,
                error:error.response.data.message || "Error deleting book",

            });
            throw error;
            
        }
    },

    updateBook:async(id,image,title,Subtitle,author,link,review)=>{

        set({isLoading:true,error:null,message:null})

        try {
            const response=await axios.post(`${API_URL}/updateBook/${id}`,{
                image,
                title,
                Subtitle,
                author,
                link,
                review,
            },{ withCredentials: true })

            const {message,book}=response.data;
            set({book,message,isLoading:false})

            return {message, book}

        } catch (error) {
            
            set({isLoading:false,
                error:error.response.data.message || "Error updating book",

            });
            throw error;

        }

    }

}))