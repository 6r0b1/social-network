export default function friendsReducer(friends = [], action) {
    if (action.type == "friends/all") {
        let allFriends = [...action.payload];
        console.log("all friends", allFriends);
        return allFriends;
    }
    if (action.type == "friends/accept") {
        let updateFriends = [...friends];
        for (const friend of updateFriends) {
            if (friend.id === action.payload.id) {
                friend.accepted = true;
            }
        }
        return updateFriends;
    }
    if (action.type == "friends/decline") {
        return action.payload.id;
        // filter
    }
    return friends;
}

export function gotFriends(friends) {
    return {
        type: "friends/all",
        payload: friends,
    };
}

export function acceptFriend(id) {
    return {
        type: "friends/accept",
        payload: { id },
    };
}

export function declineFriend(id) {
    return {
        type: "friends/decline",
        payload: { id },
    };
}
