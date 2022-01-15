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
    res.redirect(`books/${newBook.id}`);
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

//Update
router.put('/:id', async (req, res)=>{
  let book;

  try{
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishedDate = new Date(req.body.publishedDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if(req.body.cover){
      saveCover(book, req.body.cover)
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  }catch (err){
    if(book){
      renderFormPage(res, book, "edit",  true);
    } else {
      res.redirect(`/`);
    }

  }
});

//delete
router.delete('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect("/books");
  } catch (err){
    if(book){
      res.render("books/show", { book, errorMessage: "Could not remove book"});
    } else {
      res.redirect("/");
    }
  }
});

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find();
    const params = { authors, book }
    // const book = new Book();
    if(hasError && (form === "edit")) params.errorMessage = "Error updating book";
    if(hasError && (form === "new")) params.errorMessage = "Error creating book";
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
