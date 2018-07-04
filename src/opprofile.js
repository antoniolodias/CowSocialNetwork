import React from "react";
import axios from "./axios";
import App from "./app";

import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import FriendshipButton from "./friendshipbutton";
import Wall from "./wall";

export default class OtherPersonProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`/user/${id}.json`).then(({ data }) => {

            if (data.redirectToProfile) {
                return this.props.history.push("/");
            }

            this.setState(
                {
                    first: data.data.first,
                    last: data.data.last,
                    url: data.data.photo,
                    id: data.data.id,
                    bio: data.data.bio,
                    friendshipStatus: data.friendshipStatus

                }
            );
        });
    }

    render() {
        if (!this.state.id) {
            return <h1>That user doesnt exist...</h1>;
        }
        return (
            <div id="opp">
                <p id="welcomeMessage">
                    {this.state.first} {this.state.last} profile
                </p>
                <div id="bioArea">
                    <p className="bioText">{this.state.bio}</p>
                </div>
                <FriendshipButton otherUserId={this.props.match.params.id} />

                {this.state.friendshipStatus &&
                    this.state.friendshipStatus.status == 2 && (
                        <Wall
                            id="wall"
                            wallOwnerId={this.props.match.params.id}
                        />
                    )}
                <div id="profileProfilePic">
                    <ProfilePic url={this.state.url} />
                </div>
            </div>
        );
    }
}
