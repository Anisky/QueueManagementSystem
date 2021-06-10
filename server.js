const { timeStamp } = require("console");
const express = require("express");
const http =require('http');
const socketIO =require("socket.io");
//const fs = require('fs');



//localhost port
const port  = 5000 ;


const app = express();

// server instance
const server = http.createServer(app);

// creating the socket using the instance of the server 
const io = socketIO(server , {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });


const individuals = {
    inQueue : 0 ,
    passed  : 0 ,
    current : 0 ,
    count   : 0,
    total   :[]
        
};
const bussiness = {
    inQueue : 0 ,
    passed  : 0 ,
    current : 0 ,
    count   : 0 ,
    total   :[]
        
};
const specialNeeds = {
    inQueue : 0 ,
    passed  : 0 ,
    current : 0 ,
    count   : 0 ,
    total   :[]
        
};


app.get('/', (req, res) => {
    console.log("server is on !!!!!")
    res.json({individuals,bussiness,specialNeeds});
})
const updateDataBase =()=>{
    fs.writeFileSync("data.json",JSON.stringify({individuals,bussiness,specialNeeds}))
}

io.on("connection" , (socket) =>{
    console.log('a user connected');
    

    io.emit('indDisp',individuals);
    io.emit('busDisp',bussiness);
    io.emit('spDisp',specialNeeds);
    io.emit('up-customer',{individuals,bussiness,specialNeeds} );

    socket.on('connection', soc => {
         console.log('user disconnected');
         

      })
      socket.on('indChange' , ({timestamp, order}) => {
        individuals.count = order;
        individuals.total.push({timestamp,order})
        individuals.inQueue = individuals.count - individuals.current;
        if(individuals.passed != 0){
            individuals.passed= individuals.current -1 ;
       }
        //console.log(individuals);
        io.emit('indDisp',individuals);
    });

    socket.on('busChange' , ({timestamp, order}) => {
        bussiness.count = order;
        bussiness.total.push({timestamp,order})
        bussiness.inQueue = bussiness.count - bussiness.current;
        if(bussiness.passed != 0){
            bussiness.passed= bussiness.current -1 ;
       }
        //console.log(bussiness);
        io.emit('busDisp',bussiness);
    });

    socket.on('spChange' , ({timestamp, order}) => {
        specialNeeds.count = order;
        specialNeeds.total.push({timestamp,order});
        specialNeeds.inQueue = specialNeeds.count - specialNeeds.current;
        if(specialNeeds.passed != 0){
            specialNeeds.passed= specialNeeds.current -1 ;
       }
        //console.log(specialNeeds);
        io.emit('spDisp',specialNeeds);
    });

    socket.on('ind-agent-call' , () => {
        if(individuals.count>individuals.current){
            individuals.current = individuals.current + 1 ;
            individuals.inQueue = individuals.count - individuals.current;
            individuals.passed = individuals.current -1 ;
        }
        io.emit('indDisp',individuals);
    });
    socket.on('bus-agent-call' , () => {
        if(bussiness.count>bussiness.current){
          bussiness.current = bussiness.current + 1 ;
          bussiness.inQueue = bussiness.count - bussiness.current;
          bussiness.passed = bussiness.current -1 ;
        }
        io.emit('busDisp',bussiness);


    });
    socket.on('sp-agent-call' , () => {
        if(specialNeeds.count>specialNeeds.current){
        specialNeeds.current = specialNeeds.current + 1 ;
        specialNeeds.inQueue = specialNeeds.count - specialNeeds.current;
        specialNeeds.passed = specialNeeds.current -1 ;
        }
        io.emit('spDisp',specialNeeds);


 
    });

})

server.listen(port, () => console.log(`Server started on port ${port}`));