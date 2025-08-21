const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!isValid(username)) {
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

// Get the book list available in the shop (Async)
public_users.get('/get-all-books', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        const booksList = response.data;
        res.status(200).send(JSON.stringify(booksList, null, 4));
    } catch (err) {
        res.status(500).send("An error occured");
    }
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

// Get book details based on ISBN (Async)
public_users.get('/async-isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        const book = response.data;
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json(err.message);
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

// Get book details based on author (Async)
public_users.get('/async-author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        const book = response.data;
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json("An error occured");
    }
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

// Get all books based on title (Async)
public_users.get('/async-title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        const book = response.data;
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json("An error occured");
    }
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
