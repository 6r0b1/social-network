const express = require("express");
require("dotenv").config();
const app = express();
const compression = require("compression");
const path = require("path");

const { PORT = 3001, PASSPHRASE } = process.env;

const identificationRouter = require("./routers/identification");
const profileRouter = require("./routers/profile");
const othersRouter = require("./routers/others");
const friendsRouter = require("./routers/friends");

// session hash
const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `${PASSPHRASE}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
