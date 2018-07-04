import React from "react";

export default function profilePic(props) {
    return (
        <img src={props.url || "/img/default.png"} onClick={props.actionToDo} />
    );
}
