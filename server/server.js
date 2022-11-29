const express = require("express");
require("dotenv").config();
const app = express();
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const {
    PORT = 3001,
    PASSPHRASE,
    AWS_KEY,
    AWS_SECRET,
    AWS_REGION,
} = process.env;
const cryptoRandomString = require("crypto-random-string");
const aws = require("aws-sdk");
const { uploader } = require("./middleware");

const {
    addUser,
    getUserByEmail,
    addResetCode,
    getUserdataByID,
    addProfilePic,
} = require("./db");
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

// AWS Mail Setup
const ses = new aws.SES({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
    region: AWS_REGION,
});

// AWS S3
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
});

// json parser
app.use(express.json());

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));

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

// -------------------------------------------------------------------------------- log in

app.post("/login", (req, res) => {
    getUserByEmail(req.body.email).then((userData) => {
        console.log(userData);
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

app.post("/reset", (req, res) => {
    getUserByEmail(req.body.email).then((userData) => {
        if (userData.rows[0]) {
            const secretCode = cryptoRandomString({
                length: 6,
            });
            addResetCode(req.body.email, secretCode).then((resetData) => {
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
            });
        }
    });
});

// -------------------------------------------------------------------------------- get user data

app.get("/profile", (req, res) => {
    getUserdataByID(req.session.userID).then((userData) => {
        res.json(userData.rows[0]);
    });
});

// -------------------------------------------------------------------------------- upload profile pic

app.post("/profilePicUpload", uploader.single("file"), (req, res) => {
    console.log(req.file);
    const { filename, mimetype, size, path } = req.file;

    const promise = s3 // this to send to aws, different for other cloud storage
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            let pictureData = {
                id: req.session.userID,
                user_picture_url: `https://s3.amazonaws.com/spicedling/${req.file.filename}`,
            };
            addProfilePic({ pictureData });
            res.send("Upload OK");
        })
        .catch((err) => {
            console.log(err);
        });
});

// -------------------------------------------------------------------------------- catch all

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
