const initialState = { listOfOnlineUsers: [] };

export default function(state = initialState, action) {
    if (action.type == "RECEIVE_FRIENDS_AND_WANNABES") {

        state = Object.assign({}, state, {
            listOfFriends: action.list
        });
    }

    if (action.type == "ACCEPT_FRIENDSHIP") {
        state = {
            ...state,
            listOfFriends: state.listOfFriends.map(user => {
                if (user.id == action.otherUserId) {
                    return {
                        ...user,
                        status: action.updateFriendship
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "END_FRIENDSHIP") {
        state = {
            ...state,
            listOfFriends: state.listOfFriends.filter(user => {
                if (user.id == action.otherUserId) {
                    return;
                } else {
                    return user;
                }
            })
        };
    }
    //--------------------------------------------------
    //ONLINE PEOPLE

    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            listOfOnlineUsers: action.users
        };
    }

    if (action.type == "USER_JOINED") {
        console.log("ACTION: ", action);
        state = {
            ...state,
            listOfOnlineUsers: state.listOfOnlineUsers.concat(action.newUser)
        };
    }

    if (action.type == "USER_LEFT") {
        console.log("User Left action : ", action);
        state = {
            ...state,
            listOfOnlineUsers: state.listOfOnlineUsers.filter(
                userLeaving => userLeaving.id != action.userLeavingId
            )
        };
    }

    if (action.type == "GET_FORUM_MESSAGES") {
        state = {
            ...state,
            forumMessages: action.forumMessages
        };
    }

    if (action.type == "NEW_FORUM_MESSAGE") {
        state = {
            ...state,
            forumMessages: state.forumMessages.concat(action.message)
        };
    }
    //---------------------------------------
    //WALL POST

    if (action.type == "GET_WALL_POSTS") {
        state = {
            ...state,
            wallPosts: action.posts
        };
    }

    if (action.type == "NEW_WALL_POST") {
        state = {
            ...state,
            wallPosts: [action.post, ...state.wallPosts]
        };
    }

    if (action.type == "USER_INFO") {
        state = {
            ...state,
            userInfo: action.user
        };
    }

    return state;
}
