import './login.css'
import Logo from './logo.png'
import { useRef, useState } from 'react'
import axios from "axios"
import Cancel from './cancel.png'



function Login({setShowLogin, myStorage, setCurrentUser}){
    const [error, setError] =useState(false)
    const nameRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const user = {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        }

        try{
            const res = await axios.post("/users/login", user)
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.usarname)
            setShowLogin(false)
            setError(false)
        }catch (err){
            setError(true)
        }
    }

    return(
        <div className='login-container'> 
            <div className='logo'>
                <img id='logo' src={Logo} />
            </div>
            <form className='formulario' onSubmit={handleSubmit}>
                <input type='text' placeholder='username' ref={nameRef}/>
                <input type='password' placeholder='password' ref={passwordRef}/>
                <button id='loginBtn'>ENTRAR</button>
               
                    { error &&(
                    <span className='falha'>Alguma coisa deu errada</span>
                     )}

            </form>
            <img id='xl' src={Cancel} onClick={()=>setShowLogin(false)}/>
        </div>
    )
}

export default Login