import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function PWReset() {
    const [resetInitialized, setresetInitialized] = useState([]);
    const [email, setEmail] = useState();
    const [code, setCode] = useState();
    const [newPW, setNewPW] = useState();

    useEffect(() => {
        fetch("/api/reset")
            .then((result) => result.json())
            .then((resetStatus) => {
                console.log(resetStatus);
                setresetInitialized(resetStatus);
            });
    }, []);

    function updateEmail(e) {
        setEmail({ userEmail: e.target.value });
    }

    function updateResetCode(e) {
        setCode({ resetCode: e.target.value });
    }

    function updateNewPW(e) {
        setNewPW({ password: e.target.value });
    }

    function startReset(e) {
        fetch("/api/reset", {
            method: "PUT",
            body: JSON.stringify(email),
            headers: { "Content-Type": "application/json" },
        }).then(() => {
            location.reload();
        });
    }

    const navigate = useNavigate();

    function confirmReset(e) {
        fetch("/api/reset", {
            method: "POST",
            body: JSON.stringify([code, newPW]),
            headers: { "Content-Type": "application/json" },
        }).then(() => navigate("/login"));
    }

    if (resetInitialized.started) {
        return (
            <div className="register">
                <h2 className="register">
                    You should have gotten an email ...
                </h2>
                <p className="register">
                    Please enter the code we just sent you along with your new
                    password below.
                </p>
                <p className="register">
                    We will then redirect you back to the log-in page.
                </p>
                <div className="inputs">
                    <input
                        className="register"
                        type="text"
                        name="email"
                        placeholder="Reset Code"
                        onChange={updateResetCode}
                    />
                    <input
                        className="register"
                        type="text"
                        name="email"
                        placeholder="New Password"
                        onChange={updateNewPW}
                    />
                    <button className="register" onClick={confirmReset}>
                        Reset password!
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div className="register">
                <h2 className="register">So you forgot your Password ...</h2>
                <p className="register">
                    Well, it can happen to anyone. It shouldn't though, so use a
                    password manager in the future, okay?
                </p>
                <p className="register">
                    Meanwhile let us work on resetting that thing. Give us your
                    mail address first.
                </p>
                <div className="inputs">
                    <input
                        className="register"
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={updateEmail}
                    />
                    <button className="register" onClick={startReset}>
                        Reset password!
                    </button>
                </div>
            </div>
        );
    }
}

export default PWReset;
