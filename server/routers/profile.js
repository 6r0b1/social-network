const express = require("express");
const router = express.Router();
const path = require("path");
require("dotenv").config();
const compression = require("compression");
const { PASSPHRASE, AWS_KEY, AWS_SECRET, AWS_REGION } = process.env;
const aws = require("aws-sdk");
const { uploader } = require("../middleware");
const { db } = require("../db");
const fs = require("fs");

// session hash
const cookieSession = require("cookie-session");

router.use(
    cookieSession({
        secret: `${PASSPHRASE}`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// AWS S3
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
});

// json parser
router.use(express.json());

router.use(compression());

router.use(express.static(path.join(__dirname, "..", "client", "public")));
router.use(express.static(path.join(__dirname, "uploads")));

// -------------------------------------------------------------------------------- get user data

router.get("/profile", (req, res) => {
    db.getUserdataByID(req.session.userID).then((userData) => {
        res.json(userData.rows[0]);
    });
});

// -------------------------------------------------------------------------------- upload profile pic

router.post("/profilePicUpload", uploader.single("file"), (req, res) => {
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
            db.addProfilePic(pictureData).then((userData) => {
                res.json(userData.rows[0]);
            });
        })
        .catch((err) => {
            console.log(err);
        });
});

// -------------------------------------------------------------------------------- update bio

router.post("/bioupdate", (req, res) => {
    let bioData = {
        id: req.session.userID,
        bio: req.body.userBioUpdate,
    };
    db.updateProfileBio(bioData).then((bio) => {
        res.json(bio.rows[0].user_bio);
    });
});

module.exports = router;
