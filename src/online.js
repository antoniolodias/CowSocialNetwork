import React from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";

import { emit } from "./socket";

import { Link } from "react-router-dom";

import { onlineUsers, userJoined, userLeft } from "./actions";

class Online extends React.Component {
    render() {
        return (
            <div>
                <p className="onlineTitle">Who´s muuuing</p>
                <div className="allUsersList">
                    {this.props.online &&
                        this.props.online.map(po => (
                            <div className="eachUser" key={po.id}>
                                <Link to={`/user/${po.id}`}>
                                    <img
                                        className="eachUserPicture"
                                        src={po.photo || "/img/default.png"}
                                    />
                                    <p className="eachUserName">
                                        {po.first} {po.last}
                                    </p>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        );
    }
}
const getStateFromRedux = state => {
    return {
        online: state.listOfOnlineUsers
    };
};

export default connect(getStateFromRedux)(Online);
