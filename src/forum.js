import React from "react";
import { connect } from "react-redux";
import axios from "./axios";
import { emit } from "./socket";

class Forum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight - this.elem.clientHeight;
    }

    render() {
        return (
            <div id="forumMessages">
                <p className="forumTitle">What´s muuing on</p>

                <div id="forum-message-list" ref={elem => (this.elem = elem)}>
                    {this.props.messages &&
                        this.props.messages.map(msg => (
                            <div className="eachMessage" key={msg.id}>
                                <img
                                    id="forumUsersPictures"
                                    src={msg.photo || "/img/default.png"}
                                />
                                <p>
                                    {msg.first} {msg.last}
                                    <span> - {msg.createdat}</span>
                                </p>
                                <p>{msg.message}</p>
                            </div>
                        ))}
                </div>

                <button
                    className="forumTextAreaButton"
                    onClick={e => {
                        emit("forumMessage", this.textarea);
                    }}
                >
                    Muuu
                </button>

                <textarea
                    className="forumTextArea"
                    name="textarea"
                    onChange={e => (this[e.target.name] = e.target.value)}
                    placeholder="Muu it..."
                />
            </div>
        );
    }
}

const getStateFromRedux = state => {
    return {
        messages: state.forumMessages
    };
};

export default connect(getStateFromRedux)(Forum);
