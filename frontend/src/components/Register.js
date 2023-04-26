import './register.css'
import Logo from './logo.png'
import { useRef, useState } from 'react'
import axios from "axios"
import Cancel from './cancel.png'



function Register({setShowRegister}){
    const [sucess, setSucess] =useState(false)
    const [error, setError] =useState(false)
  


    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const newUser = {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        }

        try{
            await axios.post("/users/register", newUser)
            setError(false)
            setSucess(true)
        }catch (err){
            setError(true)
        }
    }

    return(
        <div className='register-container'> 
            <div className='logo'>
                <img id='logo' src={Logo} />
            </div>
            <form className='formulario' onSubmit={handleSubmit}>
                <input type='text' placeholder='username' ref={nameRef}/>
                <input type='email' placeholder='email'ref={emailRef}/>
                <input type='password' placeholder='password' ref={passwordRef}/>
                <button id='registerBtn' >Registrar</button>
                {sucess && (

                    <span className='sucesso'>Agora você pode fazer login</span>
                    )} 
                    { error &&(
                    <span className='falha'>Alguma coisa deu errada</span>
                     )}

            </form>
            <img id='x' src={Cancel} onClick={()=>setShowRegister(false)}/>
        </div>
    )
}

export default Register