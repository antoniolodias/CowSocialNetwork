import React from "react";
import axios from "./axios";

export default class BioUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.uploadBio = this.uploadBio.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        this.bio = e.target.value;
    }

    uploadBio(e) {
        e.preventDefault();
        console.log("THIS: ", this.bio);

        axios.post("/bio", { bio: this.bio }).then(({ data }) => {
            console.log("this is the data: ", data);
            this.props.setBio(data.bioText.bio);
            this.props.closeBio();
        });
    }

    render() {
        return (
            <div>
                <p onClick={this.props.closeBio} />
                <textarea className="bioText" onChange={this.handleInput} />
                <button
                    className="submitBioTextButton"
                    onClick={this.uploadBio}
                >
                    SUBMIT
                </button>
            </div>
        );
    }
}
