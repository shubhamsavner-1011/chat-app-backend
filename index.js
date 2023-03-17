const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { addMessage } = require("./src/controller/messageController");

require("./src/config/db");
const Port = process.env.PORT;
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);

let activeUsers = [];


const socketIO = require("socket.io")(9000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connection", (socket) => {
  console.log(socket.id , 'connect>>')
  
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
    socketIO.emit("get-users", activeUsers);
  });

  socket.on('joinRoom', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('userJoined', userId);
  });

  // Private message
  socket.on('privateMessage', ({ roomId, message, fromUserId, toUserId }) => {
    socket.to(roomId).emit('privateMessage', { message, fromUserId, toUserId });
  });



  
  socket.on("send-message", ({msg, username }) => {
    console.log(msg,'meg')
    // socketIO.to(anotherSocketId).emit("receive-message", {
    //   socketId: socket.id,
    //   message: msg,
    //   userName: username,
    // });
    socket.broadcast.emit("receive-message", {
      socketId: socket.id,
      message: msg,
      userName: username,
    })
  });

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
//routes middleware
app.use("/api/users", userRouter);
app.use('/api/chat', chatRouter)

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
