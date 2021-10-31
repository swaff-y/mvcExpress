# mvcExpress

## Dependancies
1. express
2. ejs
3. express-ejs-layouts
4. --save-dev nodemon
5. *bash*
6. mongoose
7. --save-dev dotenv
8. body-parser
9. multer

## Notes
1. "start":"node server.js" -> for production
2. "devStart":"nodemon server.js" -> for development
3. Create a server.js

## When a new server / project is created
1. create packege.json
2. install dependancies
3. git Init
4. mkdir .env & .gitignore
5. echo secret, PORT,  -> .env
6. echo .env -> git ignore
7. create server.js
8. mkdir - views, public, controllers, models, layouts
9. touch index.js -> controllers(create file)
10. touch index.ejs -> views(create file)
11. touch layout.ejs -> layouts(create file)
11. mkdir partials.ejs -> touch errorMessage.ejs, header.ejs

## When a new "Scaffold" is created
1. server is updated
2. Partials -> header is updated
3. Book views are created -> Index, new
4. A new model is created
5. A new controller is created
