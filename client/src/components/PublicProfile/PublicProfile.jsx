import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function PublicProfile() {
    const { id } = useParams();
    const [otherProfileData, setOtherProfileData] = useState([]);

    useEffect(() => {
        fetch(`/api/publicprofile/${id}`)
            .then((result) => result.json())
            .then((profileData) => {
                console.log(profileData);
                setOtherProfileData(...profileData);
                console.log(otherProfileData);
            });
    }, []);

    return (
        <div className="profile">
            <img
                className="profile_picture_others"
                src={otherProfileData.user_picture_url}
                alt={otherProfileData.firstname}
            />
            <div className="bio_area">
                <h3>
                    {otherProfileData.firstname} {otherProfileData.lastname}'s
                    Bio
                </h3>
                <p className="user_bio">{otherProfileData.user_bio}</p>
            </div>
        </div>
    );
}

export default PublicProfile;
