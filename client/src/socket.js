import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";

import { gotMessages, newMessage } from "./redux/messages/slice";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
        socket.on("updateMessage", (message) => {
            console.log(message.message.rows);
            store.dispatch(newMessage(message.message.rows[0]));
        });
    }
};
