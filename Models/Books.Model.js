const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = Schema({
    title:{
        type:String
    },
    author:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    },
    genre:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isTaken:{
        type:Boolean,
        default:false
    }
})

const Book = mongoose.model('book',BookSchema);

module.exports = Book
