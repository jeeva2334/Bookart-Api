const MyBooks = require('../Models/Cart.model');
const Book = require('../Models/Books.Model');
const user = require("../Models/User.model");

async function takeBook(req,res){
    try {
        const myBooks = new MyBooks({
          bookId: req.body.bookId,
          userId: req.body.userId
        });
        await myBooks.save().then(async()=>{
            await Book.findByIdAndUpdate(req.body.bookId,{isTaken : true});
        });
        res.send(myBooks);
      } catch (error) {
        res.status(400).send(error);
      }
}

async function myBooks(req,res){
    const { userId } = req.body;
    try{
        console.log(userId);
        if(!userId){
          return res.status(400).send("User Id is required");
        }  
        const myBookss = await MyBooks.find({ userId: userId });
        res.status(200).json({books:myBookss});
    }catch(error){
        res.status(500).send(error);
    }
}

async function removeBook(req,res){
    const { id } = req.body;
    try {
        if(!id){
            return res.status(400).send("Id is required");
        }
        console.log(id);
        const myBooks = await MyBooks.findOne({bookId:id});
        console.log(myBooks);
        if (!myBooks) {
            res.status(404).send('Item not found');
        }else{
            const myBooks = await MyBooks.findOneAndDelete({bookId:id});
            await Book.findByIdAndUpdate(id,{isTaken : false});
            res.status(200).json({message:"Book Deleted Sucessfully"});
        }
      } catch (error) {
        res.status(500).send(error);
      }
};

async function getSingleCart(req,res){
    const { cartId } = req.body;
    try{
        const myBooks = await MyBooks.findOne({_id:cartId});
        if(myBooks){
            const book = await Book.findOne({_id:myBooks.bookId});
            res.send(book);
        }else{
            res.send("No Book Found");
        }
    }catch(error){
        res.status(500).send(error);
    }
}

module.exports = {
    takeBook,
    myBooks,
    removeBook,
    getSingleCart
}