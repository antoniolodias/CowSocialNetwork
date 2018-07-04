import React from "react";
import axios from "./axios";

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonText: "Send Friend Request",
            friendshipStatus: null
        };
        this.requestHandler = this.requestHandler.bind(this);
    }

    componentDidMount() {
        axios.get(`/friendshipstatus/${this.props.otherUserId}`).then(resp => {
            let friendshipStatus;
            if (!resp.data.friendshipStatus) {
                friendshipStatus = null;
                return;
            }

            friendshipStatus = resp.data.friendshipStatus.status;
            const recipientId = resp.data.friendshipStatus.recipient_id;

            if (friendshipStatus == 1) {
                if (recipientId == this.props.otherUserId) {
                    this.setState({
                        buttonText: "Cancel Friend Request",
                        friendshipStatus: 1,
                        recipient: recipientId
                    });
                } else {
                    this.setState({
                        buttonText: "Accept Friend Request",
                        friendshipStatus: 1,
                        recipient: recipientId
                    });
                }
            } else if (friendshipStatus == 2) {
                this.setState({
                    buttonText: "End Friendship",
                    friendshipStatus: 2,
                    recipient: recipientId
                });
            }
        });
    }

    requestHandler(e) {
        e.preventDefault();
        if (!this.state.friendshipStatus) {
            axios
                .post("/makefriendrequest", {
                    recipient: this.props.otherUserId
                })
                .then(({ data }) => {
                    this.setState({
                        friendshipStatus: data.data.status,
                        buttonText: "Cancel Friend Request",
                        recipient: data.data.recipient_id,
                        sender: data.data.sender_id
                    });
                });
        }

        if (this.state.friendshipStatus == 1) {
            if (this.state.recipient == this.props.otherUserId) {
                axios
                    .post("/deletefriendrequest", {
                        recipient: this.props.otherUserId
                    })
                    .then(({ data }) => {
                        this.setState({
                            friendshipStatus: null,
                            buttonText: "Send Friend Request"
                        });
                    });
            } else {
                axios
                    .post("/acceptfriendrequest", {
                        recipient: this.props.otherUserId
                    })
                    .then(({ data }) => {
                        this.setState({
                            friendshipStatus: 2,
                            buttonText: "End Friendship"
                        });
                    });
            }
        }
        if (this.state.friendshipStatus == 2) {
            axios
                .post("/deletefriendrequest", {
                    recipient: this.props.otherUserId
                })
                .then(({ data }) => {
                    this.setState({
                        friendshipStatus: null,
                        buttonText: "Send Friend Request"
                    });
                });
        }
    }

    render() {
        return (
            <button className="FriendshipButton" onClick={this.requestHandler}>
                {this.state.buttonText}
            </button>
        );
    }
}
