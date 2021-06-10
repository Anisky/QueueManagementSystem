import React, { useState , useEffect,useRef} from 'react'
import './customers.css';
import io from 'socket.io-client'


// const custo = [
//     { id: 1, firstName: 'John', lastName: 'Doe' },
//     { id: 2, firstName: 'steve', lastName: 'smith' },
//     { id: 3, firstName: 'mark', lastName: 'Carl' }
// ];


function  Custoemers () {
    
    const [indCnt, setIndCnt] = useState(0);
    const [busCnt, setBusCnt] = useState(0);
    const [spCnt , setSpCnt ] = useState(0)
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io.connect("http://localhost:5000");
        socketRef.current.on('up-customer', ({individuals,bussiness,specialNeeds})=>{

            setIndCnt(individuals.count);
            setBusCnt(bussiness.count);
            setSpCnt(specialNeeds.count);
        })
        
    }, []);
    
    
    const send = ( category , order) => {
        let timestamp = Date.now() ;
        socketRef.current.emit(category , {timestamp, order});
    }

    const handleIndClick =() =>{
        let icounter = indCnt +1 ;
        setIndCnt(icounter);
        console.log("individual count : " + icounter)
        send('indChange',icounter);
    }
    const handleBusClick = () => {
        let bcounter = busCnt + 1; 
        setBusCnt(bcounter);
        console.log("bussiness count : " + bcounter);
        send('busChange', bcounter);
    } 
    
    const handleSpClick = () =>{
        var scounter = spCnt + 1;
        setSpCnt(scounter);
        console.log("special count : " + scounter);
        // console.log(busCnt)
        send('spChange',scounter);
    }
   
        return (
            <div>
                <h1 >Get your ticket</h1>
               
                <div className="customer-container">
                    
                    <div className="d1"><p>Type of ticket</p></div>
                    <div className="d2"><p>Next ticket number</p></div>
                    <div></div>

                    <div className="individuals"><p>Individuals</p></div>
                    <div className="ticketNumber1">
                            <p id="ind_tick_num">{indCnt+1}</p>
                    </div>
                    <div><button id="individuals" onClick = {handleIndClick }  >click</button></div>

                    <div className="bussiness"><p>Bussiness</p></div>
                    <div className="ticketNumber2">
                        <p id="spe_tick_num">{busCnt + 1 }</p>
                    </div>
                    <div><button id="bussiness" onClick={handleBusClick} >click</button></div>
                    
                    <div className="special_needs"><p>Special Needs</p></div>
                    <div className="ticketNumber3">
                        <p id="spe_tick_num">{spCnt + 1 }</p>
                    </div>
                    <div><button id="special Needs" onClick={handleSpClick} >click</button></div>
                </div>
            </div>
        )
} 
export default Custoemers ;

