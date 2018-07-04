import React from "react";
import axios from "./axios";
import App from "./app";

import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export default class AllUsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios.get(`/alluserslist`).then(({ data }) => {
            this.setState(
                {
                    users: data.data
                },
                () => console.log("new state: ", this.state.users)
            );

        });
    }
    render() {
        return (
            <div>
                <div className="allUsersList">
                    {this.state.users &&
                        this.state.users.map(user => {
                            return (
                                <Link key={user.id} to={`/user/${user.id}`}>
                                    <div className="eachUser" key={user.id}>
                                        <p className="eachUserName">
                                            {" "}
                                            {user.first} {user.last}
                                        </p>
                                        <img
                                            className="eachUserPicture"
                                            src={
                                                user.photo || "/img/default.png"
                                            }
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                </div>
                <Link className="linkToOnline" to={`/online`}>
                    Online
                </Link>
            </div>
        );
    }
}
