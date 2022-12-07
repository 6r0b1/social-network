import React from "react";
import { useState, useEffect } from "react";

function ReceivedRequests() {
    const [recievedRequests, setRecievedRequests] = useState([]);

    useEffect(() => {
        fetch("/api/recievedRequests")
            .then((result) => result.json())
            .then((requestData) => {
                setRecievedRequests([...requestData]);
            });
    }, []);

    function acceptFriendship(requestID) {
        fetch("/api/recievedRequests")
            .then((result) => result.json())
            .then((requestData) => {
                setRecievedRequests([...requestData]);
            });
    }

    return (
        <>
            <div className="requests">
                <h3>Friend requests you recieved</h3>
                {recievedRequests.map((user) => (
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
                                onClick={acceptFriendship(user.id)}
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

export default ReceivedRequests;
