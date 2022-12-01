require('dotenv').config({path:"./.env"});
const express = require('express')
const app = express()
const db = require('cyclic-dynamodb')
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {
  createUser,
  verifyOtp,
  login,
  logout,
  getProfile,
  takeBooks,
  returnBooks,
  resendOtp
} = require('./Controller/Users.Controller');

const {
  createBook,
  getAllBooks,
  getBookById,
  deleteBook
} = require('./Controller/Books.controller') 

mongoose.connect("mongodb+srv://sanju:jeeva@cluster0.coo6nxz.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(  
  "Access-Control-Allow-Headers",  
  "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods",  
    "GET, POST, PATCH, DELETE, OPTIONS");  
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.post('/users/signup',createUser);
app.post('/users/verify',verifyOtp);
app.post('/users/login',login);
app.get('/users/logout',logout);
app.get('/users/profile/:id',getProfile);
app.post('/users/takeBooks',takeBooks);
app.post('/users/returnBooks',returnBooks);
app.post('/users/resendOtp',resendOtp);

app.post('/books/create',createBook);
app.get('/books/getAll',getAllBooks);
app.get('/books/getOne/:id',getBookById);
app.delete('/books/delete/:id',deleteBook);

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

// Create or Update an item
app.post('/:col/:key', async (req, res) => {
  console.log(req.body)

  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).set(key, req.body)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Delete an item
app.delete('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).delete(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).get(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get('/:col', async (req, res) => {
  const col = req.params.col
  console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})

// Catch all handler for all other request.
app.get('/', (req, res) => {
  res.json({message:"Hello World"})
});

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
