import React, { useState, useEffect, useRef } from 'react'
import './Display.css';
import io from 'socket.io-client'





function Display (){

    const [individual, setIndividual] = useState({});
    const [bussiness, setSussiness] = useState({});
    const [specialNeeds, setSpecialNeeds] = useState({})

    const socketRef = useRef();
    

    
    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000");
        socketRef.current.on('indDisp', (data)=>{
            setIndividual(data);
         })
        socketRef.current.on('busDisp', (data)=>{
            setSussiness(data);
         })
        socketRef.current.on('spDisp', (data)=>{
            setSpecialNeeds(data);
         })
         
     }, []);

        return (
            <div className="container2">
                <div className="individuals_scr">
                    <h3>indiviuals</h3>
                    <p>In Queue         : {individual.inQueue}</p>
                    <p>Passed           : {individual.passed}</p>
                    <p>calling number   : {individual.current}</p>
                    
                </div>

                <div className="bussiness_scr">
                    <h3>Bussiness</h3>
                    <p>In Queue         : {bussiness.inQueue}</p>
                    <p>Passed           : {bussiness.passed}</p>
                    <p>calling number   : {bussiness.current}</p>
                 </div>

                <div className="special_needs_scr">
                    <h3>Special Need</h3>
                    <p>In Queue         : {specialNeeds.inQueue}</p>
                    <p>Passed           : {specialNeeds.passed}</p>
                    <p>calling number   : {specialNeeds.current}</p>
                 </div>

                <div className="ads">
                    <p>ads</p>
                </div>

                <div className="attachments">
                    <p>attachments</p>
                </div>

            </div>
        )
    }
export default Display;
