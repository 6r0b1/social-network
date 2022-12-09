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

// -------------------------------------------------------------------------------- get last 3 user's data

router.get("/api/others/?", (req, res) => {
    db.getThreeNewestUsers().then((othersData) => {
        res.json(othersData.rows);
    });
});

// -------------------------------------------------------------------------------- get other user's data with query

router.get("/api/others/:searchString?", (req, res) => {
    db.getThreeOthersBySerchParam(req.params.searchString).then(
        (othersData) => {
            res.json(othersData.rows);
        }
    );
});

// -------------------------------------------------------------------------------- get public profile of one oter

router.get("/api/publicprofile/:id", (req, res) => {
    db.getUserdataByID(req.params.id).then((othersData) => {
        res.json(othersData.rows);
    });
});

module.exports = router;
