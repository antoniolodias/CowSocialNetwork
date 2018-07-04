import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherPersonProfile from "./opprofile";
import AllUsersList from "./alluserslist";
import Friends from "./friends";
import Online from "./online";
import Forum from "./forum";

import { connect } from "react-redux";

import { getUserInfo } from "./actions";

import { BrowserRouter, Link, Route } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {

        this.props.dispatch(getUserInfo());

        axios.get("/user").then(({ data }) => {
            this.setState(
                {
                    first: data.data.first,
                    last: data.data.last,
                    url: data.data.photo,
                    id: data.data.id,
                    bio: data.data.bio
                }
            );
        });
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio
        });
    }

    setImage(imgUrl) {
        this.setState({
            url: imgUrl,
            uploaderIsVisible: false
        });
    }

    render() {
        if (!this.state.id) {
            return <h1>Loading...</h1>;
        }

        return (
            <div id="app">
                <div id="header">
                    <Logo />
                    <p className="helloMessage">
                        Muuu dear {this.state.first} {this.state.last}
                    </p>

                    <div id="appProfilePic">
                        <ProfilePic
                            url={this.state.url}
                            actionToDo={this.showUploader}
                        />
                    </div>
                    <div id="uploader">
                        {this.state.uploaderIsVisible && (
                            <Uploader setImage={this.setImage} />
                        )}
                    </div>
                    <a className="logoutButton" href="/logout">
                        LOGOUT
                    </a>
                </div>
                <BrowserRouter>
                    <div id="BrowserRouter">
                        <Link className="linkToUsersPage" to={`/allusers`}>
                            <p>See all our users</p>
                        </Link>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    url={this.state.url}
                                    bio={this.state.bio}
                                    actionToDo={this.showUploader}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/user/:id"
                            component={OtherPersonProfile}
                        />
                        <Route
                            exact
                            path="/allusers"
                            component={AllUsersList}
                        />
                        <Link
                            className="linkToFriendsAndFriendRequests"
                            to={`/friends`}
                        >
                            Friends
                        </Link>
                        <Route exact path="/friends" component={Friends} />

                        <Link className="linkToForum" to={`/forum`}>
                            Forum
                        </Link>
                        <Route exact path="/forum" component={Forum} />

                        <Route exact path="/online" component={Online} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default connect(null)(App);
