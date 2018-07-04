import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    forumMessage,
    forumMessages
} from "./actions";

let socket;

export function getSocket(store) {
    if (!socket && store) {
        socket = io.connect();

        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", socket => {
            store.dispatch(userJoined(socket));
        });

        socket.on("userLeft", userLeavingId => {
            store.dispatch(userLeft(userLeavingId));
        });

        socket.on("forumMessage", message => {
            store.dispatch(forumMessage(message));
        });

        socket.on("forumMessages", messages => {
            store.dispatch(forumMessages(messages));
        });
    }

    return socket;
}

export function emit(event, data) {
    socket.emit(event, data);
}
