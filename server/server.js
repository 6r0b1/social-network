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

app.get("/user/id.json", function (req, res) {
    res.json({
        userID: req.session.userID,
    });
});

// -------------------------------------------------------------------------------- register!

// client side fetches first
// validation happens here (BE)
// response will be sent /w errors if applicable
app.post("/register", (req, res) => {
    // userData can be user data from the new entry OR form errors
    const userData = userRegistration(req.body);
    // let formErrors = {};
    // if (
    //     !req.body.firstname ||
    //     !req.body.lastname ||
    //     !req.body.email ||
    //     !checkMail.validate(req.body.email) ||
    //     !req.body.password ||
    //     !req.body.passwordrep ||
    //     req.body.password !== req.body.password_rep
    // ) {
    //     formErrors.errorReadingForm = 1;
    //     res.json(formErrors);
    //     return;
    // }
    // // hash!!
    // const password = req.body.password;
    // const salt = bcrypt.genSaltSync();
    // const hash = bcrypt.hashSync(password, salt);

    // let userData = {
    //     email: req.body.email,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     passphrase: req.body.hash,
    // };
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

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
