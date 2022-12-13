const express = require("express");
const router = express.Router();
const path = require("path");
const compression = require("compression");

const { db } = require("../db");

// json parser
router.use(express.json());

router.use(compression());

router.use(express.static(path.join(__dirname, "..", "client", "public")));
router.use(express.static(path.join(__dirname, "uploads")));

// -------------------------------------------------------------------------------- friendrequests

// -------------------------------------------------------------------------------- get friendship status

router.get("/api/messages", (req, res) => {
    db.getTenLatestMessages().then((messages) => {
        res.json(messages.rows);
    });
});

router.post("/api/messages", (req, res) => {
    db.createNewMessage(req.messageData).then(() => res.send("i read you"));
});

module.exports = router;
