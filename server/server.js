const express = require("express");
require("dotenv").config();
const app = express();
const compression = require("compression");
const path = require("path");
const server = require("http").Server(app);

const { PORT = 3001, PASSPHRASE } = process.env;

const identificationRouter = require("./routers/identification");
const profileRouter = require("./routers/profile");
const othersRouter = require("./routers/others");
const friendsRouter = require("./routers/friends");
const socketRouts = require("./routers/socketRouts");

// session hash
const cookieSession = require("cookie-session");

const cookieSessionMiddleware = cookieSession({
    secret: `${PASSPHRASE}`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);

// Socket

const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// json parser
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(identificationRouter); // +++----------------- register/log in/pw reset -+++
app.use(profileRouter); // +++---------------------- profile/picture upload/bio -+++
app.use(othersRouter); // +++---------------------------------------- other ppl -+++
app.use(friendsRouter); // +++------------------------------------- friends ppl -+++

app.get("/user_logout", (req, res) => {
    req.session = null;
    res.json({ userID: null });
});

// -------------------------------------------------------------------------------- catch all

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});

// -------------------------------------------------------------------------------- sockets

let sockets = [];

io.on("connection", function (socket) {
    if (!socket.request.session.userID) {
        return socket.disconnect(true);
    }
    sockets.push({
        connectionID: socket.id,
        userID: socket.request.session.userID,
    });
    console.log(sockets);

    socket.on("disconnect", function () {
        console.log(`socket with the id ${socket.id} is now disconnected`);
        let updateSockets = sockets;
        sockets = updateSockets.filter(
            (connection) => connection.connectionID !== socket.id
        );
        console.log(sockets);
    });

    socket.on("thanks", function (data) {
        console.log(data);
    });

    socket.emit("welcome", {
        message: "Welome. It is nice to see you",
    });
});
