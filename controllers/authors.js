const express = require('express');
const router = express.Router();

module.exports = router;

//All Authors
router.get('/', (req,res)=>{
  res.render('authors/index')
})

//New Author
router.get('/new', (req, res)=>{
  res.render('authors/new')
})

//Create
router.post('/', (req, res)=>{
  res.send('create')
})
