import React, { useEffect, useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { RiStarSFill } from 'react-icons/ri';
import './App.css'
import axios from "axios"
import {format} from "timeago.js"
import Register from './components/Register';
import Login from './components/Login';



function App() {
  const myStorage = window.localStorage
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"))
  const [pins, setPins] = useState ([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace , setNewPlace] = useState(null)
  const [viewState, setViewState] = React.useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });
  const[title, setTitle] = useState(null)
  const[desc, setDesc] = useState(null)
  const[rating, setRating] = useState(0)



  useEffect(()=>{
    const getPins = async () =>{
      try{
        const res = await axios.get("/pins");
        setPins(res.data)
      }catch(err){
        console.log(err)
      }
    }
    getPins()
  },[]);


  const handleMarkerClick =(id,lat,long) =>{
    setCurrentPlaceId(id)
    setViewState({...viewState, latitude:lat, longitude:long})
  }

  const handleAddMarker = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      long: lng,
      lat: lat,
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const newPin = {
      user:currentUser,
      username: currentUser.username,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,
    }

    try{  
      const res = await axios.post("/pins", newPin)
      setPins([...pins, res.data])
      setNewPlace(null)
    }catch(err){
      console.log(err)
    }
  }

  const handleSair = () =>{
    myStorage.removeItem("user")
    setCurrentUser(null)
  }

  return (
    <div style={{width: "100%", height:"95vh", background: "rgb(46, 46, 46)", }}>

      <div className='head'>
          {currentUser ? (<button className='button sair' onClick={handleSair}>SAIR</button>)
          
          : 
      
          (<div className='buttons'>
        <button className='button entrar' onClick={()=>setShowLogin(true)}>ENTRAR</button>
        <button className='button registrar'onClick={()=>setShowRegister(true)}>REGISTRAR-SE</button>
        </div>)}
        
      </div>

      
      <ReactMapGL
      
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapStyle="mapbox://styles/kaikpizzi/clfwm9qp2000k01rnntowgz5f"
        onDblClick={handleAddMarker}
        className="mapp"
      >
        {pins.map(p=>(

        <React.Fragment key={p._id}>
        
          
          <Marker latitude={p.lat} longitude={p.long} offsetLeft={-20} offsetTop={-10} onClick={()=>handleMarkerClick(p._id,p.lat,p.long)} style={{cursor:"pointer"}} ></Marker>
        

          {p._id === currentPlaceId && (
            <Popup longitude={p.long} latitude={p.lat} closeButton={true} closeOnClick={false} anchor="bottom" onClose={()=> setCurrentPlaceId(null)}>
        <div className='card'> 
        <label>Lugar</label>
        <h4>{p.title}</h4>
        <label>Resumo</label>
        <p className='desc'>{p.desc}</p>
        <label>Nota</label>

        <div className='estrelas'>
          {Array(p.rating).fill(<RiStarSFill className='estrela'/>)}
        </div>
        <label>Informação</label>
          <span className='username'>Criado por <b>{p.username}</b></span>
          <span className='data'> {format(p.createdAt)} </span>
          </div>
            </Popup>
         )
        }
        
        
          </React.Fragment> 

          ))}

            {newPlace && 
          <Popup longitude={newPlace.long} latitude={newPlace.lat} closeButton={true} closeOnClick={false} anchor="bottom" onClose={()=> setCurrentPlaceId(null)}>

              <div className='form-container'>
                <form onSubmit={handleSubmit}>
                  <label>Lugar</label>
                  <input placeholder='Enter a Title' onChange={(e)=> setTitle(e.target.value)} />
                  <label>Resumo</label>
                  <textarea placeholder='Descreva o lugar' onChange={(e)=> setDesc(e.target.value)} />
                  <label>Nota</label>
                  <select onChange={(e)=> setRating(e.target.value)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>
                  <button className="submitButton"> Adicionar lugar </button>
                </form>
              </div>

          </Popup> }
              
       {showRegister &&
      <Register setShowRegister={setShowRegister}/>
       }       
      
      {showLogin &&
      <Login  setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>
       }       
      </ReactMapGL>
      
    </div>
  );
}

export default App;