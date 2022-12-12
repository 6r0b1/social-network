const express = require("express");
const router = express.Router();
const { PORT = 3001, PASSPHRASE } = process.env;
const server = require("http").Server(router);

// session hash
const cookieSession = require("cookie-session");

const cookieSessionMiddleware = cookieSession({
    secret: `${PASSPHRASE}`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

router.use(cookieSessionMiddleware);

// Socket

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

let connections = [];

io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userID = socket.request.session.userId;
    connections.push({ socketID: socket.id, userID: userID });
    console.log("Connections:", connections);

    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    socket.on("thanks", function (data) {
        console.log(data);
    });

    socket.emit("welcome", {
        message: "Welome. It is nice to see you",
    });
});

module.exports = router;
