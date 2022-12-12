import { combineReducers } from "redux";
import friendsReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
import userIDReducer from "./userID/slice";

const rootReducer = combineReducers({
    friends: friendsReducer,
    messages: messagesReducer,
    userID: userIDReducer,
});

export default rootReducer;
