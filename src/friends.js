import React from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";

import { Link } from "react-router-dom";

import {
    receiveFriendAndWannabes,
    acceptFriendship,
    terminateFriendship
} from "./actions";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(receiveFriendAndWannabes());
    }
    render() {
        return (
            <div>
                <p className="myWannabeFriends">Wannabes</p>
                <div id="wannabes">
                    {this.props.wannabes &&
                        this.props.wannabes.map(f => (
                            <div className="eachUser" key={f.id}>
                                <Link to={`/user/${f.id}`}>
                                    <img
                                        className="eachUserPicture"
                                        src={f.photo || "/img/default.png"}
                                    />
                                    <p className="eachUserName">
                                        {f.first} {f.last}
                                    </p>
                                </Link>

                                <button
                                    onClick={() =>
                                        this.props.dispatch(
                                            acceptFriendship(f.id)
                                        )
                                    }
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        ))}
                </div>

                <br />
                <br />
                <br />
                <br />
                <br />
                <p className="myFriends">Friends</p>
                <div id="friends">
                    {this.props.friends &&
                        this.props.friends.map(f => (
                            <div className="eachUser" key={f.id}>
                                <Link to={`/user/${f.id}`}>
                                    <img
                                        className="eachUserPicture"
                                        src={f.photo || "/img/default.png"}
                                    />
                                    <p className="eachUserName">
                                        {f.first} {f.last}
                                    </p>
                                </Link>

                                <button
                                    onClick={() =>
                                        this.props.dispatch(
                                            terminateFriendship(f.id)
                                        )
                                    }
                                >
                                    End Friendship
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        );
    }
}
const getStateFromRedux = state => {

    return {
        friends:
            state.listOfFriends &&
            state.listOfFriends.filter(f => f.status == 2),
        wannabes:
            state.listOfFriends &&
            state.listOfFriends.filter(f => f.status == 1)
    };
};

export default connect(getStateFromRedux)(Friends);
