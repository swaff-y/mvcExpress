const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const Author = require('../models/author.js');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

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
  renderFormPage(res, new Book(), "new")
});

//Create
router.post('/', async (req, res)=>{
  const book = new Book({
    title: req?.body?.title || null,
    author: req?.body?.author || null,
    publishedDate: new Date(req?.body?.publishedDate) || null,
    pageCount: req?.body?.pageCount || null,
    description: req?.body?.description || null,
    // createdAt: new Date()
  });

  saveCover(book, req.body.cover);

  try{
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`);
    res.redirect(`books`);
  }catch{
    renderFormPage(res, book, "new",  true);
  }

});

//show
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.render('books/show', { book })
  } catch {
    res.redirect('/')
  }
})

//Edit book
router.get('/:id/edit', async (req, res)=>{
  try {
    const book = await Book.findById(req.params.id);
    renderFormPage(res, book, "edit");
  } catch {
    res.redirect("/");
  }
});

async function renderFormPage(res, book, form, hasError = false) {
  console.log("renderForm");
  try {
    const authors = await Author.find();
    const params = {
      authors: authors,
      book: book
    }
    // const book = new Book();
    if(hasError) params.errorMessage = "Error creating book";
    res.render(`books/${form}`, params)
  } catch(err) {
    res.redirect("/books")
  }
}

function saveCover(book, coverEncoded){
  if(!coverEncoded) return;
  const cover = JSON.parse(coverEncoded);
  if(cover && imageMimeTypes.includes(cover.type)){
    book.coverImage = new Buffer.from(cover.data, 'base64');
    book.coverImageType = cover.type;
  }
}
