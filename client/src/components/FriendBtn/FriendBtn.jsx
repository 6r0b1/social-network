import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function FriendBtn() {
    const { id } = useParams();
    const [friendStatus, setFriendStatus] = useState([]);

    useEffect(() => {
        fetch(`/api/friends/${id}`)
            .then((result) => result.json())
            .then((friendStatus) => {
                console.log("friendstatus", friendStatus);
                setFriendStatus(friendStatus);
            });
    }, []);

    const navigate = useNavigate();

    function goToPrivateProfile(e) {
        navigate("/");
    }

    function befriend(e) {
        fetch(`/api/friends/${id}`, {
            method: "PUT",
        }).then((friendStatus) => {
            location.reload();
        });
    }

    function cancelBefriend(e) {
        fetch(`/api/friends/${id}`, {
            method: "DELETE",
        }).then((friendStatus) => {
            location.reload();
        });
    }

    if (friendStatus.friendStatus === "same") {
        console.log("same");
        return (
            <div>
                <button className="bio_save" onClick={goToPrivateProfile}>
                    Go to private Profile
                </button>
            </div>
        );
    }

    if (friendStatus.friendStatus === "none") {
        console.log("none");
        return (
            <div>
                <button className="bio_save" onClick={befriend}>
                    Send Friend Request
                </button>
            </div>
        );
    }

    if (friendStatus.friendStatus === "pending") {
        console.log("pending");
        return (
            <div>
                <button className="bio_save" onClick={cancelBefriend}>
                    Cancel Friendship Request
                </button>
            </div>
        );
    }
}

export default FriendBtn;
