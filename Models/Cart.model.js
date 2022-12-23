const mongoose = require('mongoose')
const schema = mongoose.Schema;

const MyBooksSchema = new schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'books',
        required:true
    }
});

const MyBooks = mongoose.model('MyBooks',MyBooksSchema);

module.exports = MyBooks;