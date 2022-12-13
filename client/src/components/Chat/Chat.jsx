import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { gotMessages, newMessage } from "../../redux/messages/slice";
import { socket } from "../../socket";

function Chat() {
    const dispatch = useDispatch();
    const messages = useSelector((state) => {
        return state.messages;
    });
    const [userData, setUserData] = useState({});
    const [messageBody, setMessageBody] = useState("");

    useEffect(() => {
        fetch("/api/messages")
            .then((messages) => messages.json())
            .then((messages) => {
                console.log(messages);
                dispatch(gotMessages(messages));
            });
    }, []);

    useEffect(() => {
        fetch("/profile")
            .then((result) => result.json())
            .then((result) => {
                console.log("profile", result);
                setUserData(result);
            });
    }, []);

    function handleMessageInput(e) {
        setMessageBody(e.currentTarget.value);
    }

    function sendMessage(messageData) {
        socket.emit("newMessage", { message: `>> ${messageBody}` });
    }

    return (
        <div className="chat">
            <div className="results">
                <h2>Live Chat</h2>
                <input
                    type="text"
                    name="othersQuery"
                    id=""
                    placeholder="Write a message"
                    onChange={handleMessageInput}
                />
                <button
                    className="bio_save"
                    onClick={() => sendMessage(messageBody)}
                >
                    Send!
                </button>
            </div>
            <div className="chat_history">
                {messages.map((message) => (
                    <div className="chat_entry" key={message.id}>
                        <img
                            className="profile_picture_mini"
                            src={message.user_picture_url}
                            alt=""
                        />
                        <div className="chat_message">
                            <h2 className="results">
                                {message.firstname} {message.lastname}
                            </h2>
                            <p className="message">{message.message_body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;
