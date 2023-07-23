

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
require("./config/db");
const CookieParser=require("cookie-parser")
const userRoutes = require("./routes/UserRoute");
const chatRoutes = require("./routes/ChatRoute");
const messageRoutes = require("./routes/MessageRoute");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
// const path = require("path");


const app = express();
const PORT = process.env.PORT || 8080;
const path=require("path");


  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  })

app.use(express.json()); // to accept json data
app.use(CookieParser());
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);


const User=require("./models/UserModel");




const server=app.listen(PORT,()=>{
  console.log(`server is listenting at port no. ${PORT}`);
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["https://chatting-91mt.onrender.com","http://localhost:3000"],
    credentials: true,
  },
});

// io.on('connection',(socket)=>{
//   console.log('connected to socket io');
//   // console.log(socket);
//   socket.on("Setup",async(userdata)=>{
//     // console.log(userdata);
//     socket.join(userdata._id);
//     await User.updateOne({_id:userdata._id},{status:"Online"})
//     socket.emit('connected');
//   });

//   socket.on('join chat',(room)=>{
//     socket.join(room);
//     console.log("user joined room : ",room);
//   });

//   socket.on("typing",(room)=>{
//     console.log("typing.. ",room);
//     socket.in(room).emit("typing");
//   });

//   socket.on("stop typing",(room)=>{
//     console.log(" stop typing.. ",room);
//     socket.in(room).emit("stop typing")
//   });

//   socket.on("new message",(newMessageRecieved)=>{
//     console.log("newMessageRecieved ::: ",newMessageRecieved);
//     var chat=newMessageRecieved.chat;

//     if(!chat.users) return console.log("chat.users not found");

//     chat.users.forEach((user)=>{
//       if(user._id==newMessageRecieved.sender._id) return;
//       socket.in(user._id).emit("message recieved",newMessageRecieved);
//     });
//   });

//   // socket.off("Setup",()=>{
//   //   console.log("user disconnected");
//   //   socket.leave(userdata._id);
//   // });

//   // socket.on("disconnect",(userdata)=>{
//   //   console.log("user disconnected ",userdata);
//   // })
// });

var users=[];

const addUser=(userId,socketId)=>{
  !users.some((user)=>user.userId===userId) && users.push({userId,socketId});
}

const removeUser=(socketId)=>{
  users=users.filter((user)=>user.socketId!==socketId);
}

const getUser=(userId)=>{
  return users.find((user)=>user.userId===userId);
}

const getUserBySocketId=(socketId)=>{
  return users.find((user)=>user.socketId===socketId);
}

io.on('connection',(socket)=>{
    // when connect
    console.log("A user connect");

    // take userId and socketId

    socket.on('addUser',async(userId)=>{
      await User.updateOne({_id:userId},{status:"Online"})
      addUser(userId,socket.id);
      io.emit('getUsers',users);
    })

    // send and get messages

    socket.on('sendMessage',({senderId,receiverId,text})=>{
      console.log("users aree :: ",users);
      console.log(senderId,receiverId,text);
      const user=getUser(receiverId);
      io.to(user.socketId).emit('getMessage',{
        senderId,
        text
      });
    })

    // when disconnect

    socket.on("disconnect",async()=>{
      console.log("A user disconnect");
      removeUser(socket.id);
      // const user=getUserBySocketId(socket.id);
      // console.log(user);
      // await User.updateOne({_id:user.userId},{status:"Offline"})
      io.emit('getUsers',users);
    });
});


