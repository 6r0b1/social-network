import { io } from "socket.io-client";
export let socket = io.connect();

socket.on("message", (msg) => {
    console.log("Received message: ", msg);
});

socket.on("allUser", (msg) => {
    console.log("From allUser: ", msg);
});
