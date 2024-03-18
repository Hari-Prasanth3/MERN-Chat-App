const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleWare/errorMiddleWare");
const path =require('path')

const app = express();
dotenv.config();
connectDB();

app.use(express.json()); // to accept JSON data



// Define another route
app.get('/hello', (req, res) => {
    res.send("Hello from the server!");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// --------------------------------Deployment------------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    // set static folder
    app.use(express.static(path.join(__dirname1, "/frontend/build")));
  
    // any route that is not api will be redirected to indexedDB.html
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
  } else {
    app.get("/", (req, res) => {
      res.send("API is running....");
    });
  }
  // --------------------------------Deployment------------------------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(5000, () => {
    console.log(`Server started on PORT ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to Socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);

        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
       chat.users.forEach(user => {
        if(user._id == newMessageReceived.sender._id) return;
        socket.in(user._id).emit("message received", newMessageReceived)
       })
      });
      socket.off("setup", ()=> {
        console.log("User Disconnected");
        socket.leave(userData._id)
      });
});
