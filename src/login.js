import React from "react";
import axios from "./axios";

import { Link } from "react-router-dom";
import App from "./app";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: ""
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log(this.state);
            }
        );
    }

    onSubmit(e) {
        e.preventDefault();

        axios
            .post("/login", this.state)
            .then(response => {
                if (response.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true
                });
            });
    }

    render() {
        return (
            <div id="register">
                {this.state.error && <p>Oops! Something went wrong</p>}
                <br />
                <br />
                <p>Login</p>
                <br />

                <form onSubmit={this.onSubmit}>
                    <input
                        onChange={this.onChange}
                        name="email"
                        placeholder="Email"
                        type="email"
                    />
                    <br />
                    <input
                        onChange={this.onChange}
                        name="password"
                        placeholder="Password"
                        type="password"
                    />
                    <br />
                    <br />
                    <button>LOGIN</button>
                    <br />
                </form>
                <Link to="/" className="link">
                    Registration
                </Link>
            </div>
        );
    }
}
