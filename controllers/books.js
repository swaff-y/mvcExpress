const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');

module.exports = router;

//All Authors
router.get('/', async (req,res)=>{
  let searchOptions = {}

  if(req?.query?.name){
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  try {
    const books = await Book.find(searchOptions);
    const query = req?.query || "";
    res.render('books/index', {
      books: books,
      searchOptions: query
    })
  } catch {
    res.redirect('/');
  }
})

//New Author
router.get('/new', (req, res)=>{
  res.render('books/new', { book: new Book()})
})

//Create
router.post('/', async (req, res)=>{
  const book = new Book({
    name: req.body.name
  });

  try{
    const newBook = await book.save();
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect(`books`);
  }catch{
    res.render('books/new', {
      book: book,
      errorMessage: "Error creating book"
    })
  }
})
