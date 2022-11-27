const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { PORT = 3001, PASSPHRASE } = process.env;
const checkMail = require("email-validator");

const { addUser } = require("./db");
const { userRegistration } = require("./formValidation");

// session hash
const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `${PASSPHRASE}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// pw hash
const bcrypt = require("bcryptjs");

// json parser
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

// -------------------------------------------------------------------------------- loged in?

app.get("/user/id.json", (req, res) => {
    console.log(req.session.userID);
    res.json({
        userID: req.session.userID,
    });
});

// -------------------------------------------------------------------------------- register!

// client side fetches first
// validation happens here (BE)
// response will be sent /w errors if applicable

app.post("/register", (req, res) => {
    const userData = userRegistration(req.body);
    console.log(userData);
    if (userData.errorReadingForm) {
        res.json(userData);
        return;
    }
    addUser(userData).then((result) => {
        req.session.userID = result.rows[0].id;
        res.json(result.rows[0]);
    });
});

// -------------------------------------------------------------------------------- catch all

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
