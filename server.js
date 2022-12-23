const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { signup, verifyOtp, login, profile, Logout, resendOtp} = require('./controllers/User.Controller');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const { addBook, getBooks, getSingleBook, returnBooks } = require('./controllers/Books.controller');
const { takeBook, myBooks, removeBook, getSingleCart } = require('./controllers/Cart.Controller');
const { reset } = require('nodemon');

const PORT = 8000;

//MongoDB Connection
mongoose.Promise = global.Promise;
mongoose.set('strictQuery',false);
mongoose.connect('mongodb+srv://jeeva:jeeva@cluster0.xzpwvun.mongodb.net/?retryWrites=true&w=majority',()=>{
    console.log("Connected to MongoDB");
})

//Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieparser())

//Routes

app.get('/',(req,res)=>{
    res.json({message:"Working Fine"});
})
//User Routes
app.post('/api/user/addUser/',signup);
app.post('/api/user/addUser/Otp/Resend',resendOtp);
app.post('/api/user/addUser/Otp/',verifyOtp);
app.post('/api/user/login/',login);
app.post('/api/user/logout/',Logout);
app.get('/api/user/profile/:id',profile);

//Books Routes
app.post('/api/books/addBook/',addBook);
app.get('/api/books/getBooks/',getBooks);
app.get('/api/books/getBook/:id',getSingleBook);

//My books
app.post('/api/myBooks/TakeBook/',takeBook);
app.post('/api/myBooks/',myBooks);
app.post('/api/myBooks/getCartItem/',getSingleCart);
app.post('/api/myBooks/returnBook/',removeBook);

app.listen(PORT,()=>{
    console.log("Port is up and running at http://localhost:8000");
})