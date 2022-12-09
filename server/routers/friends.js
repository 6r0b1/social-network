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

router.get("/api/friends/:user2", (req, res) => {
    let requestStatus = {
        friendStatus: "",
    };
    db.getFriendRequest(req.session.userID, req.params.user2).then(
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

router.put("/api/friends/:user2", (req, res) => {
    db.createFriendRequest(req.session.userID, req.params.user2).then(() =>
        res.send("did that")
    );
});

// -------------------------------------------------------------------------------- cancel/decline friendrequest, revoke friendship

router.delete("/api/friends/:user2", (req, res) => {
    db.deleteFriendRequest(req.session.userID, req.params.user2).then(() =>
        res.send("done and dusted")
    );
});

// -------------------------------------------------------------------------------- accept friendrequest

router.post("/api/friends/:user2", (req, res) => {
    console.log("user2", req.params.user2, "user1", req.session.userID);
    db.acceptFriendRequest(req.params.user2, req.session.userID).then(() =>
        res.send("match made in heaven")
    );
});

// -------------------------------------------------------------------------------- get friends

router.get("/api/friendslist", (req, res) => {
    db.getFriendslist(req.session.userID).then((result) => {
        res.json(result.rows);
    });
});

module.exports = router;
