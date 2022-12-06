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
    verifyResetCode,
    updatePassphrase,
    getUserdataByID,
    addProfilePic,
    updateProfileBio,
    getThreeNewestUsers,
    getThreeOthersBySerchParam,
    getFriendRequest,
    createFriendRequest,
    deleteFriendRequest,
    acceptFriendRequest,
} = require("./db");
const { userRegistration, newPassphrase } = require("./formValidation");

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

app.get("/api/reset", (req, res) => {
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

app.put("/api/reset", (req, res) => {
    console.log(req.body);
    getUserByEmail(req.body.userEmail).then((userData) => {
        if (userData.rows[0]) {
            req.session.resetStarted = true;
            req.session.userEmail = req.body.userEmail;
            console.log(req.session);
            const secretCode = cryptoRandomString({
                length: 6,
            });
            addResetCode(req.body.userEmail, secretCode).then((resetData) => {
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
            });
        }
    });
});

// -------------------------------------------------------------------------------- compare secret code

app.post("/api/reset", (req, res) => {
    verifyResetCode(req.body[0].resetCode, req.session.userEmail).then(
        (result) => {
            if (result.rows[0]) {
                updatePassphrase(
                    newPassphrase(req.body[1].password),
                    req.session.userEmail
                );
            }
            res.send("ok");
        }
    );
});

// -------------------------------------------------------------------------------- get user data

app.get("/profile", (req, res) => {
    getUserdataByID(req.session.userID).then((userData) => {
        res.json(userData.rows[0]);
    });
});

// -------------------------------------------------------------------------------- get last 3 user's data

app.get("/api/others/?", (req, res) => {
    getThreeNewestUsers().then((othersData) => {
        res.json(othersData.rows);
    });
});

// -------------------------------------------------------------------------------- get other user's data with query

app.get("/api/others/:searchString?", (req, res) => {
    getThreeOthersBySerchParam(req.params.searchString).then((othersData) => {
        res.json(othersData.rows);
    });
});
// -------------------------------------------------------------------------------- get public profile of one oter

app.get("/api/publicprofile/:id", (req, res) => {
    getUserdataByID(req.params.id).then((othersData) => {
        res.json(othersData.rows);
    });
});

// -------------------------------------------------------------------------------- friendrequests

// -------------------------------------------------------------------------------- get friendship status

app.get("/api/friends/:user2", (req, res) => {
    let requestStatus = {
        friendStatus: "",
    };
    getFriendRequest(req.session.userID, req.params.user2).then(
        (friendshipRequest) => {
            console.log(friendshipRequest.rows[0]);
            if (!friendshipRequest.rows[0]) {
                requestStatus.friendStatus = "none";
            } else {
                if (
                    friendshipRequest.rows[0].sender_id === req.session.userID
                ) {
                    requestStatus.friendStatus = "pending";
                } else {
                    requestStatus.friendStatus = "recieved";
                }
                if (friendshipRequest.rows[0].accepted) {
                    requestStatus.friendStatus = "friends";
                }
            }

            if (req.session.userID == req.params.user2) {
                requestStatus.friendStatus = "same";
            }

            res.json(requestStatus);
        }
    );
});

// -------------------------------------------------------------------------------- put friendrequest

app.put("/api/friends/:user2", (req, res) => {
    createFriendRequest(req.session.userID, req.params.user2).then(() =>
        res.send("did that")
    );
});

// -------------------------------------------------------------------------------- cancel/decline friendrequest, revoke friendship

app.delete("/api/friends/:user2", (req, res) => {
    deleteFriendRequest(req.session.userID, req.params.user2).then(() =>
        res.send("done and dusted")
    );
});

// -------------------------------------------------------------------------------- accept friendrequest

app.post("/api/friends/:user2", (req, res) => {
    console.log("user2", req.params.user2, "user1", req.session.userID);
    acceptFriendRequest(req.params.user2, req.session.userID).then(() =>
        res.send("match made in heaven")
    );
});

// -------------------------------------------------------------------------------- upload profile pic

app.post("/profilePicUpload", uploader.single("file"), (req, res) => {
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
            addProfilePic(pictureData).then((userData) => {
                res.json(userData.rows[0]);
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

// -------------------------------------------------------------------------------- update

app.post("/bioupdate", (req, res) => {
    let bioData = {
        id: req.session.userID,
        bio: req.body.userBioUpdate,
    };
    updateProfileBio(bioData).then((bio) => {
        res.json(bio.rows[0].user_bio);
    });
});

// -------------------------------------------------------------------------------- catch all

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
