import { Routes,Route } from "react-router"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import AddBook from "./pages/AddBook"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import {Toaster} from "react-hot-toast"
import { useEffect } from "react"
import { useAuthStore } from "./store/auth"
import RedirectAuthUsers from "./providers/RedirectAuthUsers"
import RedirectUnauthUsers from "./providers/RedirectUnauthUsers"
import Footer from "./components/Footer"
import SearchPage from "./pages/SearchPage"
import BookPage from "./pages/BookPage"
import UpdateBook from "./pages/UpdateBook"

function App() {

  const{fetchUser,fetchingUser}=useAuthStore();

  useEffect(()=>{

    fetchUser();

  },[fetchUser]);

  if(fetchingUser){
    return <p>Loading..</p>;
  }

  return (
    <>
    <Toaster/>
    <Navbar/>
     
     <Routes>
      <Route path={"/"} element={<HomePage/>}/>
      <Route path={"/addbook"} element={<RedirectUnauthUsers><AddBook/></RedirectUnauthUsers>}/>
      <Route path={"/book/:id"} element={<BookPage/>}/>
      <Route path={"/book/:id/update"} element={<UpdateBook/>}/>
      <Route path={"/login"} element={<RedirectAuthUsers><Login/></RedirectAuthUsers>}/>
      <Route path={"/signup"} element={<RedirectAuthUsers><Signup/></RedirectAuthUsers>}/>
      <Route path={"/search"} element={<SearchPage/>}/>
     </Routes>

     <Footer/>
    </>
  )
}

export default App

//redirect unauth users is not working  (2.12.56 video time)
