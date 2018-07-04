const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const compression = require("compression");

const csurf = require("csurf");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const db = require("./db.js");
const s3 = require("./s3");
const config = require("./config");

app.use(compression());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(bodyParser.json());

app.use(express.static("public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
//-------------------------------
//DONT TOUCH

var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//DONT TOUCH
//-------------------------------------------------------------------
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//------------------------------------------------------

app.post("/register", (req, res) => {
    db
        .hashPassword(req.body.password)
        .then(hashPassword => {
            return db.register(
                req.body.first,
                req.body.last,
                req.body.email,
                hashPassword
            );
        })
        .then(userId => {
            req.session.userId = userId.rows[0].id;
        })
        .then(() => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            res.json({
                success: false
            });
        });
});

//---------------------------

app.post("/login", (req, res) => {
    var userId;

    db
        .getUserByEmail(req.body.email)
        .then(result => {
            userId = result.rows[0].id;

            return db.checkPassword(
                req.body.password,
                result.rows[0].hashpassword
            );
        })
        .then(doesMatch => {
            if (!doesMatch) {
                res.json({
                    error: true
                });
            } else {
                req.session.userId = userId;

                res.json({
                    success: true
                });
            }
        })
        .catch(err => {
            res.json({
                error: true
            });
        });
});
//------------------------------------------------------
app.get("/user", (req, res) => {
    db
        .getUserById(req.session.userId)
        .then(data => {
            res.json({
                data: data.rows[0]
            });
        })
        .catch(err => {
            console.log("Error at get /user: ", err);
        });
});
//------------------------------------------------------

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {

    db
        .uploadProfilePicture(
            req.session.userId,
            config.s3Url + req.file.filename
        )
        .then(function(result) {

            res.json({
                photo: config.s3Url + req.file.filename
            });
        })
        .catch(function(err) {
            res.sendStatus(500);
        });
});
//------------------------------------------------------
app.post("/bio", (req, res) => {
    db.saveBio(req.session.userId, req.body.bio).then(bioText => {
        res.json({
            bioText: bioText.rows[0]
        });
    });
});
//------------------------------------------------------
app.get(`/user/:id.json`, function(req, res) {
    if (req.params.id == req.session.userId) {
        return res.json({
            redirectToProfile: true
        });
    }
    db.getUserById(req.params.id).then(data => {
        return db
            .friendshipstatus(req.session.userId, req.params.id)
            .then(result => {

                res.json({
                    friendshipStatus: result.rows[0],
                    data: data.rows[0]
                });
            });
    });
});
//------------------------------------------------------

app.get("/alluserslist", (req, res) => {
    db.getAllUsers().then(data => {
        return res.json({
            data: data.rows
        });
    });
});
//------------------------------------------------------
app.post("/makefriendrequest", (req, res) => {
    db
        .sendFriendRequest(req.session.userId, req.body.recipient)
        .then(data => {
            res.json({ data: data.rows[0] });
        })
        .catch(err => {
            console.log("sending friend request error: ", err);
        });
});
//------------------------------------------------------
app.post("/deletefriendrequest", (req, res) => {
    db
        .deletefriendrequest(req.session.userId, req.body.recipient)
        .then(() => {
            res.json({ deleted: true });
        })
        .catch(function(err) {
        });
});
//------------------------------------------------------
app.post("/acceptfriendrequest", (req, res) => {
    db
        .acceptFriendRequest(req.session.userId, req.body.recipient)
        .then(data => {
            res.json({ data: data.rows[0] });
        })
        .catch(err => {
        });
});
//------------------------------------------------------
app.get("/friendshipstatus/:id", (req, res) => {
    db.friendshipstatus(req.session.userId, req.params.id).then(result => {
        res.json({ friendshipStatus: result.rows[0] });
    });
});
//------------------------------------------------------
app.get("/friends.json", (req, res) => {
    db.getFriendsAndWannabes(req.session.userId).then(results => {
        res.json({
            allfriends: results.rows
        });
    });
});

// //------------------------------------------------------
app.get("/wallposts/:someId", (req, res) => {
    db
        .getWallPosts(parseInt(req.params.someId), req.session.userId)
        .then(results => {
            res.json({
                wallPosts: results.rows
            });
        })
        .catch(err => console.log("wallposts err: ", err));
});

// //------------------------------------------------------
app.post("/wallpost", (req, res) => {

    db
        .writePost(req.session.userId, req.body.post, req.body.wallOwnerId)
        .then(results => {
            return db.getUserInfo(req.session.userId).then(data => {
                const { first, last, photo, id } = data.rows[0];
                let newPostData = {
                    createdat: results.rows[0].createdat,
                    post: results.rows[0].post,
                    photo,
                    first,
                    last,
                    id
                };

                res.json(newPostData);
            });
        });
});

// //------------------------------------------------------

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

//------------------------------------------------------
app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, () => {
    console.log("Listening 8080");
});
//-----------------------------------------------------------------------------

let onlineUsers = {};

io.on("connection", function(socket) {
    if (!socket.request.session || !socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;

    onlineUsers[socket.id] = userId;

    db.getUsersByIds(Object.values(onlineUsers)).then(({ rows }) => {
        socket.emit("onlineUsers", rows);
    });

    let count = Object.values(onlineUsers).filter(id => id == userId).length;

    if (count == 1) {
        db
            .userJoined(userId)
            .then(user => socket.broadcast.emit("userJoined", user.rows[0]));
    }

    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];

        if (Object.values(onlineUsers).indexOf(userId) == -1) {
            socket.broadcast.emit("userLeft", userId);
        }
    });

    socket.on("forumMessage", message => {
        db
            .insertNewMessage(socket.request.session.userId, message)
            .then(message => {
                return db
                    .getUserInfo(socket.request.session.userId)
                    .then(({ rows }) => {
                        rows[0].userId = rows[0].id;
                        rows[0].id = message.rows[0].id;
                        rows[0].message = message.rows[0].message;
                        rows[0].createdat = message.rows[0].createdat;

                        io.emit("forumMessage", rows[0]);
                    });
            });
    });

    db
        .getLastTenMessages()
        .then(messages => {
            socket.emit("forumMessages", messages.rows.reverse());
        })
        .catch(err => console.log("ERROR: ", err));
});
