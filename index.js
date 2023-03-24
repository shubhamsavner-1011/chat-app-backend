/* eslint-disable no-undef */
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
// const { addMessage } = require("./src/controller/messageController");
const cloudinary = require("cloudinary").v2;

require("./src/config/db");


cloudinary.config({ 
  // eslint-disable-next-line no-undef
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
const Port = process.env.PORT;
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors()
);

let activeUsers = [];

const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// const socketIO = require("socket.io")(9000, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

socketIO.on("connection", (socket) => {
  // console.log(socket.id , 'connect>>')
  
  socket.on("new-user-add", (newUserId) => {
    console.log(newUserId, 'new-ser')
    if (!activeUsers.some((user) => user?.userId === newUserId.userId)) {
        activeUsers.push({
          userId: newUserId?.userId,
          username: newUserId?.username,
          socketId: newUserId?.socketID,
        });
    }
    // send all active users to new user
    socket.emit("get-users", activeUsers);
  });

  socket.on('joinRoom', (room) => {
    console.log(room, 'room>>>>')
    socket.join(room);
  });

  // Private message
  // socket.on('privateMessage', ({ roomId, message, fromUserId, toUserId }) => {
  //   socket.to(roomId).emit('privateMessage', { message, fromUserId, toUserId });
  // });

  socket.on('send-message', (data) => {
    console.log(data, 'sending-data')
    socket.to(data?.chatId).emit('receive-message',data);
 });

  
  // socket.on("send-message", ({msg, username }) => {
  //   console.log(msg,'meg')
  //   // socketIO.to(anotherSocketId).emit("receive-message", {
  //   //   socketId: socket.id,
  //   //   message: msg,
  //   //   userName: username,
  //   // });
  //   socket.broadcast.emit("receive-message", {
  //     socketId: socket.id,
  //     message: msg,
  //     userName: username,
  //   })
  // });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    // send all active users to all users
    socketIO.emit("get-users", activeUsers);
  });
});

//import Routes
const userRouter = require("./src/routers/userRouter");
const chatRouter = require("./src/routers/chatRouter") 
const messageRouter = require("./src/routers/messageRouter") 

//routes middleware
app.use("/api/users", userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter)


server.listen(Port, () => {
  console.log(`server is running on port ${Port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
