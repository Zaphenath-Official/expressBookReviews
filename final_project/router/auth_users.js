const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let validusers = users.filter((user)=>{
    return (user.username === username)
  });
  if(validusers.length > 0){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  }else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          username: username
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      if (req.session) {
        req.session.authorization = {
          accessToken, username
        };
      }
      return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
  } else {
    return res.status(400).json({ message: "Username or Password not provided" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(req.session && req.session.authorization){
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if(books[isbn]){
      books[isbn]['reviews'][username] = review;
      return res.status(200).json({message: "Review added/updated successfully", reviews: books[isbn]['reviews']});
    }else{
      return res.status(404).json({message: "Book not found"});
    }
  }else{
    return res.status(403).json({message: "User not logged in"});
  }
});

// Delete a book review of a specific user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if(req.session && req.session.authorization){
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if(books[isbn]){
      if(books[isbn]['reviews'][username]){
        delete books[isbn]['reviews'][username];
        return res.status(200).json({message: "Review deleted successfully", reviews: books[isbn]['reviews']});
      }else{
        return res.status(404).json({message: "Review by user not found"});
      }
    }else{
      return res.status(404).json({message: "Book not found"});
    }
  }else{
    return res.status(403).json({message: "User not logged in"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
