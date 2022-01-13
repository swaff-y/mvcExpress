const express = require('express');
const router = express.Router();
const Author = require('../models/author.js');

module.exports = router;

//All Authors
router.get('/', async (req,res)=>{
  let searchOptions = {}

  if(req?.query?.name){
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  try {
    const authors = await Author.find(searchOptions);
    const query = req?.query || "";
    res.render('authors/index', {
      authors: authors,
      searchOptions: query
    })
  } catch {
    res.redirect('/');
  }
})

//New Author
router.get('/new', (req, res)=>{
  res.render('authors/new', { author: new Author()})
})

//Create
router.post('/', async (req, res)=>{
  const author = new Author({
    name: req.body.name
  });

  try{
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect(`authors`);
  }catch{
    res.render('authors/new', {
      author: author,
      errorMessage: "Error creating author"
    })
  }
})

//Get one author
router.get('/:id',(req, res)=>{
  res.send("Show Author" + req.params.id)
})
//edit one author
router.get('/:id/edit',(req, res)=>{
  res.send("Edit Author" + req.params.id)
})
//update one author
router.put('/:id',(req, res)=>{
  res.send("Update Author" + req.params.id)
})
//delete one author
router.delete('/:id',(req, res)=>{
  res.send("Delete Author" + req.params.id)
})
