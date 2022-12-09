const express = require("express");
const router = express.Router();
const path = require("path");
require("dotenv").config();
const compression = require("compression");
const { PASSPHRASE, AWS_KEY, AWS_SECRET, AWS_REGION } = process.env;
const cryptoRandomString = require("crypto-random-string");
const aws = require("aws-sdk");

const { db } = require("../db");
const { userRegistration, newPassphrase } = require("../formValidation");

// session hash
const cookieSession = require("cookie-session");

router.use(
    cookieSession({
        secret: `${PASSPHRASE}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// pw hash
const bcrypt = require("bcryptjs");

// AWS Mail Setup
const ses = new aws.SES({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
    region: AWS_REGION,
});

// json parser
router.use(express.json());

router.use(compression());

router.use(express.static(path.join(__dirname, "..", "client", "public")));
router.use(express.static(path.join(__dirname, "uploads")));

// -------------------------------------------------------------------------------- loged in?

router.get("/user/id.json", (req, res) => {
    res.json({
        userID: req.session.userID,
    });
});

// -------------------------------------------------------------------------------- register!

// client side fetches first
// validation happens here (BE)
// response will be sent /w errors if applicable

router.post("/register", (req, res) => {
    const userData = userRegistration(req.body);
    if (userData.errorReadingForm) {
        res.json(userData);
        return;
    }
    db.addUser(userData).then((result) => {
        req.session.userID = result.rows[0].id;
        res.json(result.rows[0]);
    });
});

// -------------------------------------------------------------------------------- log in

router.post("/login", (req, res) => {
    db.getUserByEmail(req.body.email).then((userData) => {
        if (
            !userData.rows[0] ||
            !bcrypt.compareSync(req.body.password, userData.rows[0].passphrase)
        ) {
            res.send("error");
        } else {
            req.session.userID = userData.rows[0].id;
            res.json(userData.rows[0]);
        }
    });
});

// -------------------------------------------------------------------------------- reset pw

// -------------------------------------------------------------------------------- check if reset started

router.get("/api/reset", (req, res) => {
    console.log(req.session.resetStarted);
    let resetStatus = {
        started: false,
    };
    if (req.session.resetStarted) {
        resetStatus.started = true;
    }
    res.json(resetStatus);
});

// -------------------------------------------------------------------------------- set secret code and send email

router.put("/api/reset", (req, res) => {
    console.log(req.body);
    db.getUserByEmail(req.body.userEmail).then((userData) => {
        if (userData.rows[0]) {
            req.session.resetStarted = true;
            req.session.userEmail = req.body.userEmail;
            console.log(req.session);
            const secretCode = cryptoRandomString({
                length: 6,
            });
            db.addResetCode(req.body.userEmail, secretCode).then(
                (resetData) => {
                    res.send("ok");
                    ses.sendEmail({
                        Source: "FOMO <webmaster@fomo.party>",
                        Destination: {
                            ToAddresses: [`veit.hueter@gmail.com`],
                        },
                        Message: {
                            Body: {
                                Text: {
                                    Data: `Someone requested a password reset for this email address.
                                
                                If you did this, go back to the site and type in the following secret key:
                                
                                ${secretCode}`,
                                },
                            },
                            Subject: {
                                Data: "Password Reset Requested",
                            },
                        },
                    })
                        .promise()
                        .then(() => {
                            res.send("OK");
                        })
                        .catch((err) => console.log("err", err));
                }
            );
        }
    });
});

// -------------------------------------------------------------------------------- compare secret code

router.post("/api/reset", (req, res) => {
    db.verifyResetCode(req.body[0].resetCode, req.session.userEmail).then(
        (result) => {
            if (result.rows[0]) {
                db.updatePassphrase(
                    newPassphrase(req.body[1].password),
                    req.session.userEmail
                );
            }
            req.session = null;
            res.redirect("/");
        }
    );
});

module.exports = router;
