import axios from "./axios";

export function receiveFriendAndWannabes() {
    return axios.get(`/friends.json`).then(resp => {
        return {
            type: "RECEIVE_FRIENDS_AND_WANNABES",
            list: resp.data.allfriends
        };
    });
}

export function acceptFriendship(otherUserId) {
    return axios
        .post("/acceptfriendrequest", {
            recipient: otherUserId
        })
        .then(resp => {
            return {
                type: "ACCEPT_FRIENDSHIP",
                updateFriendship: resp.data.data.status,
                otherUserId
            };
        });
}

export function terminateFriendship(otherUserId) {
    return axios
        .post("/deletefriendrequest", {
            recipient: otherUserId
        })
        .then(resp => {
            return {
                type: "END_FRIENDSHIP",
                updateFriendship: null,
                otherUserId
            };
        });
}
export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users
    };
}

export function userJoined(newUser) {
    return {
        type: "USER_JOINED",
        newUser
    };
}
export function userLeft(userLeavingId) {
    return {
        type: "USER_LEFT",
        userLeavingId
    };
}

export function forumMessages(messages) {
    return {
        type: "GET_FORUM_MESSAGES",
        forumMessages: messages
    };
}

export function forumMessage(message) {
    return {
        type: "NEW_FORUM_MESSAGE",
        message
    };
}

//--------------------------------
//WALL

export function getWallPosts(someId) {
    return axios.get("/wallposts/" + someId).then(({ data }) => {
        return {
            type: "GET_WALL_POSTS",
            posts: data.wallPosts
        };
    });
}

export function newWallPost(post, wallOwnerId) {
    return (
        axios
            .post("/wallpost", { post, wallOwnerId })
            .then(({ data }) => {
                return {
                    type: "NEW_WALL_POST",
                    post: data
                };
            })
    );
}

export function getUserInfo() {
    return axios.get("/user").then(({ data }) => {
        return {
            type: "USER_INFO",
            user: data.data
        };
    });
}
