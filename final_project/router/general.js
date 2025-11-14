const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }else{
    return res.status(404).json({message: "Username and Password not provided"});
  }
});

// Get the book list available in the shop
let myPromise1 = new Promise((resolve, reject) => {
    resolve(books);
});
myPromise1.then((books) => {
  public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books,null,4));
  });
});

// Get book details based on ISBN
let myPromise2 = new Promise((resolve, reject) => {
    resolve(books);
});
myPromise2.then((books) => {
  public_users.get('/isbn/:isbn',function (req, res) {
    return res.send(JSON.stringify(books[req.params.isbn],null,4));
   });
});
// Get book details based on author\
let myPromise3 = new Promise((resolve, reject) => {
    resolve(books);
});
myPromise3.then((books) => {
  public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    const book = Object.values(books).find(b => b.author === author);
    if (book) {
      return res.send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  });
});

// Get all books based on title
let myPromise4 = new Promise((resolve, reject) => {
    resolve(books);
});
myPromise4.then((books) => {
  public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    const book = Object.values(books).find(b => b.title === title);
    if(!book){
      return res.status(404).json({message: "Title not found"});
    }else{
      return res.send(JSON.stringify(book, null, 4));
    }
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book_review = books[isbn]['reviews'];
  if(book_review){
    return res.send(book_review);
  }else{
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
