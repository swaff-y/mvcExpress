const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const Author = require('../models/author.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = router;

//All Books
router.get('/', async (req,res)=>{
  let query = Book.find();

  if(req.query.title){
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }

  if(req.query.publishedBefore){
    query = query.lte('publishedDate', req.query.publishedBefore);
  }

  if(req.query.publishedAfter){
    query = query.gte('publishedDate', req.query.publishedAfter);
  }

  try {
    const books = await query.exec();

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
  renderNewPage(res, new Book())
});

//File upload - Multer
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = path.join('public', Book.coverImageBasePath);
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
});

//Create
router.post('/', upload.single('cover'), async (req, res)=>{
  const fileName = await req.file ? req.file.filename : null;
  const book = new Book({
    title: req?.body?.title || null,
    author: req?.body?.author || null,
    publishedDate: new Date(req?.body?.publishedDate) || null,
    pageCount: req?.body?.pageCount || null,
    coverImageName: fileName,
    description: req?.body?.description || null,
    // createdAt: new Date()
  });

  try{
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect(`books`);
  }catch{
    if(book.coverImageName){
      removeBookCover(book.coverImageName);
    }
    renderNewPage(res, book, true);
  }

});

function removeBookCover(fileName){
  fs.unlink(path.join(uploadPath, fileName), err => {
     if(err){
       console.log(err);
     }
  })
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    }
    // const book = new Book();
    if(hasError) params.errorMessage = "Error creating book";
    res.render('books/new', params)
  } catch(err) {
    res.redirect("/books")
  }
}
