export default function messagesReducer(messages = [], action) {
    if (action.type == "messages/all") {
        return [...action.payload];
    }

    if (action.type == "messages/new") {
        let updateMessages = structuredClone(messages);
        updateMessages.push(action.payload);
        return updateMessages;
    }

    return messages;
}

export function gotMessages(messages) {
    return {
        type: "messages/all",
        payload: messages,
    };
}

export function newMessage(messageData) {
    return {
        type: "messages/new",
        payload: messageData,
    };
}
