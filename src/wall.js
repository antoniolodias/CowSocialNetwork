import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { emit } from "./socket";

import { newWallPost, getWallPosts } from "./actions";

class Wall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.postHandler = this.postHandler.bind(this);
    }

    componentDidMount() {
        var pageId;

        if (!this.props.wallOwnerId) {
            pageId = this.props.user.id;
        } else {
            pageId = this.props.wallOwnerId;
        }
        this.props.dispatch(getWallPosts(pageId));
    }

    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }

    postHandler(e) {
        e.preventDefault();
        this.props.dispatch(
            newWallPost(this.post, this.props.wallOwnerId || this.props.user.id)
        );
    }

    render() {
        return (
            <div id="wallPosts">
                <p className="wallTitle">My Muuuuus</p>

                <button
                    className="wallTextAreaButton"
                    onClick={
                        this.postHandler
                    }
                >
                    Muuu
                </button>

                <textarea
                    className="wallTextArea"
                    name="post"
                    onChange={e => {
                        this.handleInput;
                        this[e.target.name] = e.target.value;
                    }}
                    placeholder="Muu it..."
                />

                <div id="wall-list" ref={elem => (this.elem = elem)}>
                    {this.props.posts &&
                        this.props.posts.map(post => (
                            <div className="eachPost" key={post.id}>
                                <img
                                    id="wallUsersPictures"
                                    src={post.photo || "/img/default.png"}
                                />
                                <p className="wallPostsName">
                                    {post.first} {post.last} muuued:
                                </p>
                                <p>
                                    {post.post}
                                </p>
                            </div>
                        ))}
                </div>
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        posts: state.wallPosts,
        user: state.userInfo
    };
};

export default connect(getStateFromRedux)(Wall);
