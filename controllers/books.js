const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const Author = require('../models/author.js');

module.exports = router;

//All Authors
router.get('/', async (req,res)=>{
  let searchOptions = {}

  if(req?.query?.title){
    searchOptions.title = new RegExp(req.query.title, 'i');
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

//New Book
router.get('/new', async (req, res)=>{
  try {
    const authors = await Author.find({});
    const book = new Book();
    res.render('books/new', {
      authors: authors,
      book: book
    })
  } catch(err) {
    res.redirect("/books")
  }
  res.render('books/new', { book: new Book()})
})

//Create
router.post('/', async (req, res)=>{
  const book = new Book({
    title: req?.body?.title || null,
    description: req?.body?.description || null,
    publishedDate: req?.body?.publishedDate || null,
    pageCount: req?.body?.pageCount || null,
    createdAt: req?.body?.createdAt || null,
    coverImageName: req?.body?.coverImageName || null,
    author: req?.body?.author || null,
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
