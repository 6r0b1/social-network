export default function friendsReducer(friends = [], action) {
    if (action.type == "friends/all") {
        return [...action.payload];
    }

    if (action.type == "friends/accept") {
        let updateFriends = structuredClone(friends);
        updateFriends.forEach((friend) => {
            if (friend.id === action.payload) {
                friend.accepted = true;
            }
        });
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
        payload: id,
    };
}

export function declineFriend(id) {
    return {
        type: "friends/decline",
        payload: { id },
    };
}
