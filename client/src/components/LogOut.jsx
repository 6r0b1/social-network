import React from "react";
import { useNavigate } from "react-router";

function LogOut() {
    const navigate = useNavigate();
    function logOutHandler() {
        fetch("/user_logout")
            .then((result) => result.json())
            .then(() => {
                navigate("/");
                location.reload();
            });
    }
    return logOutHandler();
}

export default LogOut;
