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
        console.log("state", state);

        return (
            state.friends && state.friends.filter((friend) => !friend.accepted)
        );
    });
    // const [recievedRequests, setRecievedRequests] = useState([]);

    useEffect(() => {
        fetch("/api/friendslist")
            .then((result) => result.json())
            .then((requestData) => {
                console.log(requestData);
                dispatch(gotFriends(requestData));
            });
    }, []);

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
                                // onClick={acceptFriendship(user.id)}
                            >
                                Accept
                            </button>
                            <button className="bio_save">Decline</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Friends;
