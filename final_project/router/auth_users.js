const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const filtered_users = users.filter((u) => (u.username === username));
    return (filtered_users.length > 0);
}

const authenticatedUser = (username, password) => {
    const filtered_users = users.filter((u) => {
        return (u.username === username && u.password === password);
    });
    return (filtered_users.length > 0);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. Provide username/password" });
    }
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({
            data: password,
        }, "access", { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query?.review;
    const user = req.user;

    if (!review) {
        return res.status(400).json({ message: "Empty review" });
    }
    if(books[isbn]) {
        books[isbn].reviews[user] = review;
        return res.status(200).send("Review added successfuly");
    }
    res.status(404).json({ message: "ISBN not found" })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
