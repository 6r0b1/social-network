export default function userIDReducer(userID = [], action) {
    if (action.type == "userID/login") {
        return [...action.payload];
    }

    return userID;
}

export function gotUserID(userID) {
    return {
        type: "userID/login",
        payload: userID,
    };
}
