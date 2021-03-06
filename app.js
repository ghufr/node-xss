const express = require("express");
const app = express();
const serv = require("http").Server(app);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/index.html");
});
app.use("/client", express.static(__dirname + "/client"));

const port = process.env.PORT || 5000;
if (process.env.PORT == undefined) {
  console.log("no port defined using default (5000)");
}

serv.listen(port);
const io = require("socket.io")(serv, {});

console.log("Socket started on port " + port);

const SOCKET_LIST = {};
const MESSAGES = [];

function disconnectSocket(id) {
  SOCKET_LIST[id].disconnect();
  delete SOCKET_LIST[id];
  console.log("User with id " + id + " Disconnected");
}

io.sockets.on("connection", function (socket) {
  socket.id = Math.round(Math.random() * 1000);
  socket.uName = "Unnamed";
  SOCKET_LIST[socket.id] = socket;

  console.log("User with id " + socket.id + " Connected");
  socket.emit("chat_data", MESSAGES);

  socket.on("disconnect", function () {
    disconnectSocket(socket.id);
  });

  socket.on("change_name", function (data) {
    try {
      if (data.length < 1 || data.length > 16) {
        return;
      }
      socket.uName = data;
      console.log(
        "User with id " + socket.id + " changed name to " + socket.uName
      );
    } catch (err) {}
  });

  socket.on("send_chat", function (data) {
    try {
      data = "[" + socket.uName + "]: " + data;
      console.log("<Chat>: " + data + " | by user with id " + socket.id);
      MESSAGES.push(data);
      for (let s in SOCKET_LIST) {
        SOCKET_LIST[s].emit("chat", data);
      }
    } catch (err) {}
  });
});
console.log(
  "[Warning] This chat is vulnerable to xss attacks and should only be used to learn how to perform or protect against xss attacks"
);
console.log("Server started");
