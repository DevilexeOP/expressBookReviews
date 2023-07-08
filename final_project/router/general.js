const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Extract the username and password from the request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Return a success message or the newly created user details in the response
  return res.status(200).json({ message: "Registration successful" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    // Simulate an asynchronous operation, such as fetching data from a database
    // Return the books data as the response
    return res.status(200).json(books);
  } catch (error) {
    // Handle any errors that occur during the asynchronous operation
    console.error("Error fetching books data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Wrap the logic in a promise
  const findBookByIsbn = new Promise((resolve, reject) => {
    // Simulate an asynchronous operation, such as fetching data from a database
    // In this case, we'll directly check if the ISBN exists in the books object
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
  // Use the promise to handle the success and error cases
  findBookByIsbn
    .then((book) => {
      return res.status(200).json({ book });
    })
    .catch((error) => {
      console.error("Error finding book by ISBN:", error);
      return res.status(404).json({ message: "Book not found" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  // Iterate through the books object to find books by the specified author
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.author === author) {
        booksByAuthor.push(book);
      }
    }
  }
  // Check if any books were found for the specified author
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(404).json({ message: "No books found for the author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = [];

  // Iterate through the books object to find books by the specified title
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title === title) {
        booksByTitle.push(book);
      }
    }
  }

  // Check if any books were found for the specified title
  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  } else {
    return res.status(404).json({ message: "No books found with the title" });
  }
});

//  Get book review
public_users.get("/review", function (req, res) {
  const allReviews = [];

  // Iterate through the books object to gather all reviews
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      const review = book.reviews;
      allReviews.push(review);
    }
  }

  // Check if any reviews were found
  if (allReviews.length > 0) {
    return res.status(200).json({ reviews: allReviews });
  } else {
    return res.status(404).json({ message: "No reviews found" });
  }
});

module.exports.general = public_users;
