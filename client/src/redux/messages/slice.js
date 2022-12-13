// -------- hey veit, this is your messages slice! -------- //

export default function messagesReducer(messages = [], action) {
    if (action.type == "messages/all") {
        return [...action.payload];
    }

    if (action.type == "messages/new") {
        let updateMessages = structuredClone(messages);
        updateMessages.unshift(action.payload);
        if (updateMessages.length > 10) {
            updateMessages.pop();
        }

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
