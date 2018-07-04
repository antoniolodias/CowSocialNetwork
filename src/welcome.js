import React from "react";
import { HashRouter, Route } from "react-router-dom";

import Register from "./register";
import Login from "./login";

export default function Welcome() {
    console.log(location.pathname);

    return (
        <div id="welcome">
            <p>Muuuuu</p>

            <HashRouter>
                <div>
                    <Route exact path="/" component={Register} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
