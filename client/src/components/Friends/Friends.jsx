import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    gotFriends,
    acceptFriend,
    declineFriend,
} from "../../redux/friends/slice";

function Friends() {
    const dispatch = useDispatch();

    const recievedRequests = useSelector((state) => {
        return (
            state.friends && state.friends.filter((friend) => !friend.accepted)
        );
    });

    const confirmedFriends = useSelector((state) => {
        return (
            state.friends && state.friends.filter((friend) => friend.accepted)
        );
    });

    useEffect(() => {
        fetch("/api/friendslist")
            .then((result) => result.json())
            .then((requestData) => {
                console.log(requestData);
                dispatch(gotFriends(requestData));
            });
    }, []);

    function acceptFriendship(id) {
        fetch(`/api/friends/${id}`, {
            method: "POST",
        }).then(() => {
            dispatch(acceptFriend(id));
        });
    }

    function deleteFriendship(id) {
        fetch(`/api/friends/${id}`, {
            method: "DELETE",
        }).then(() => {
            dispatch(declineFriend(id));
        });
    }

    return (
        <>
            <div className="requests">
                <h3>Open friendship requests</h3>
                {recievedRequests?.map((user) => (
                    <div className="results_entry" key={user.id}>
                        <img
                            className="profile_picture_results"
                            src={user.user_picture_url}
                            alt=""
                        />
                        <h2 className="results">
                            {user.firstname} {user.lastname}
                        </h2>
                        <div>
                            <button
                                className="bio_save"
                                onClick={() => acceptFriendship(user.id)}
                            >
                                Accept
                            </button>
                            <button
                                className="bio_save"
                                onClick={() => deleteFriendship(user.id)}
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="requests">
                <h3>Your friends</h3>
                {confirmedFriends?.map((user) => (
                    <div className="results_entry" key={user.id}>
                        <img
                            className="profile_picture_results"
                            src={user.user_picture_url}
                            alt=""
                        />
                        <h2 className="results">
                            {user.firstname} {user.lastname}
                        </h2>
                        <div>
                            <button
                                className="bio_save"
                                onClick={() => deleteFriendship(user.id)}
                            >
                                Unfriend
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Friends;
