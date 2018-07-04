import React from "react";
import ReactDOM from "react-dom";

import { getSocket } from "./socket";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";

import Welcome from "./welcome";
import App from "./app";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

getSocket(store);

let component;

if (location.pathname == "/welcome") {
    component = <Welcome />;
} else {
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));
