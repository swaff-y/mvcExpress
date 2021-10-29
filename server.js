//bash 1. create packege.json
//bash 2. install dependancies
//bash 3. git Init
//bash 4. mkdir .env & .gitignore
//bash 5. echo secret, PORT,  to .env
//bash 6. echo .env to git ignore
//bash 7. write this file
//bash 8. mkdir - views, public, controllers, models, layouts
//bash 9. touch index.js -> controllers(create file)
//bash 9. touch index.ejs -> views(create file)
//bash 10. touch layout.ejs -> layouts(create file)
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const port = process.env.PORT || 3000;
const database = process.env.DATABASE_URL;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
// app.set('views', __dirname + "/views");
app.set('views', __dirname + "/views");

//layout file, every single file is going to be put inside of this file
//so we don't have to duplicate all the beginnig HTML and ending HTML
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
mongoose.connect(database, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', error => console.error( error ))
db.once('open', () => console.log( "Connected to mongoose..." ))

app.use("/", require("./controllers/index"));
app.use("/authors", require("./controllers/authors"));
app.use("/books", require("./controllers/books"));
