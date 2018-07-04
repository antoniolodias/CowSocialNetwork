import React from "react";
import { Link } from "react-router-dom";

import ProfilePic from "./profilepic";
import BioUploader from "./biouploader";
import Wall from "./wall";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.showBioUploader = this.showBioUploader.bind(this);
        this.closeBio = this.closeBio.bind(this);
    }

    showBioUploader() {
        this.setState(
            {
                bioUploaderIsVisible: true
            },
            () => console.log("state of the bio: ", this.state)
        );
    }

    closeBio() {
        this.setState({
            bioUploaderIsVisible: false
        });
    }

    render() {
        return (
            <div>
                <p id="welcomeMessage">
                    Welcome, {this.props.first} {this.props.last}!
                </p>

                <div id="bioArea">
                    <p
                        className="writeBioButton"
                        onClick={this.showBioUploader}
                    >
                        Write your bio:
                    </p>

                    <p className="bioText">{this.props.bio}</p>

                    <div id="bioEditArea">
                        {this.state.bioUploaderIsVisible && (
                            <BioUploader
                                setBio={this.props.setBio}
                                closeBio={this.closeBio}
                            />
                        )}
                    </div>
                </div>
                <Wall id="wall" />

                <div id="profileProfilePic">
                    <ProfilePic
                        url={this.props.url}
                        actionToDo={this.props.showUploader}
                    />
                </div>
            </div>
        );
    }
}
