import React from "react";
import axios from "./axios";
import App from "./app";

import { Link } from "react-router-dom";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInput(e) {
        this[e.target.name] = e.target.value;
    }

    handleSubmit() {
        const { first, last, email, password } = this;

        axios
            .post("/register", {
                first: this.first,
                last: this.last,
                email: this.email,
                password: this.password
            })
            .then(resp => {
                if (resp.data.success) {
                    location.replace("/");
                } else {
                    this.setState(
                        {
                            error: true
                        },
                        () => {
                            console.log("State situation: ", this.state);
                        }
                    );
                }
            });
    }
    render() {
        return (
            <div id="register">
                {this.state.error && (
                    <div className="err">Oops! Something went wrong</div>
                )}

                <br />
                <br />
                <p>Register</p>
                <br />

                <input
                    type="text"
                    placeholder="First Name"
                    name="first"
                    onChange={this.handleInput}
                />
                <br />
                <input
                    type="text"
                    placeholder="Last Name"
                    name="last"
                    onChange={this.handleInput}
                />
                <br />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={this.handleInput}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleInput}
                />
                <input type="hidden" name="_csrf" value="{{csrfToken}}" />
                <br />
                <br />
                <button onClick={this.handleSubmit}>Register</button>
                <br />
                <Link to="/login" className="link">
                    Login
                </Link>
            </div>
        );
    }
}
