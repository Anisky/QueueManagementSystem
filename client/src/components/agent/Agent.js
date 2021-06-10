import React ,{useEffect,useRef}from 'react'
import './Agent.css';
import io from 'socket.io-client'




function Agent  ()  {

    const socketRef = useRef();
    

    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000");
        
         
     }, []);

    const handleIndClick =()=>{

    socketRef.current.emit('ind-agent-call', null)
        
   }
   
   const handleBusClick =()=>{

    socketRef.current.emit('bus-agent-call', null)
        
   }
   const handleSpClick =()=>{

    
    socketRef.current.emit('sp-agent-call', null)
        
   }


    return (
        <div className='agent'>
            <h1>Call the next Customer</h1>
            <br />
            <h3>Individuals</h3>
            <button id = 'ind-calling-btn' onClick = {handleIndClick}>Call Next Number </button>
            <h3>Bussiness</h3>
            <button id = 'bus-calling-btn' onClick = {handleBusClick}>Call Next Number </button>
            <h3>Special Needs</h3>
            <button id = 'sp-calling-btn' onClick = {handleSpClick}>Call Next Number </button>
        </div>

    )
}
export default Agent ;
