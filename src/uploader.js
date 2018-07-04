import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
    }

    onChange(e) {
        this.file = e.target.files[0];
    }

    uploadPhoto(e) {
        e.preventDefault();
        const fd = new FormData();

        fd.append("file", this.file);

        axios.post("/upload", fd).then(({ data }) => {
            console.log("this is the data: ", data);
            this.props.setImage(data.photo);
        });
    }

    render() {
        return (
            <div>
                <input onChange={this.onChange} type="file" name="file" />
                <button onClick={this.uploadPhoto}>UPLOAD</button>
            </div>
        );
    }
}
