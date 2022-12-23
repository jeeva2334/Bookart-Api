const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = Schema({
    fullname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    Otp:{
        type:String,
        default:''
    },
    validTill:{
        type:Date,
        default:Date.now()
    },
    isAuth:{
        type:Boolean,
        default:false
    },
    booksTaken:{
        type:Array,
        default:[]
    }
});

const user = mongoose.model('user',User);
module.exports = user;