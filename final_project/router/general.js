const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExists = (username) => {
    const filtered_users = users.filter((u) => (u.username === username));
    return (filtered_users.length > 0);
}

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!userExists(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered" });
        } else {
            return res.status(404).json({ message: "User already exists" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. username/password missing" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const booksList = Object.keys(books).map((id) => {
        return { id: id, ...books[id] };
    });
    res.status(200).send(JSON.stringify(booksList, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "ISBN not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksList = Object.keys(books).map((id) => {
        return { id: id, ...books[id] };
    });
    filteredBooks = booksList.filter((book) => (book.author === author));
    res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksList = Object.keys(books).map((id) => {
        return { id: id, ...books[id] };
    });
    filteredBooks = booksList.filter((book) => (book.title === title));
    res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "ISBN not found" });
    }
});

module.exports.general = public_users;
