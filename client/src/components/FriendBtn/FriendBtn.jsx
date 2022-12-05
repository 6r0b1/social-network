import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function FriendBtn() {
    return (
        <div>
            <button className="bio_save">Send Friendrequest</button>
        </div>
    );
}

export default FriendBtn;
