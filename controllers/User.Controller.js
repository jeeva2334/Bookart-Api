const user = require("../Models/User.model");
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

async function passhash(password){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    return hash;
}

function verifyPassword(password,hash){
    return bcrypt.compareSync(password,hash);
}


let mailtransporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: true,
    service : "Hotmail",
    port:"587",
    auth :{
        user: "testvalidatorautomation@outlook.com",
        pass: "Sanjay@321"
    },
    tls: {
        ciphers:'SSLv3'
    },
    logger: true,
    debug: true
})

const signup = async(req,res)=>{
    const {fullname,phone,email,password} = req.body;
    const pass = await passhash(password);
    try{
        const usr = await user.findOne({email});
        if(usr){
           return res.status(401).json({msg:"User already exists"});
        }else{
            const newUser = new user({
                fullname:fullname,
                phone:phone,
                email:email,
                password:pass
            });
            const usr1 = await newUser.save();
            const OTP = otpGenerator.generate(4,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
            const updateOtp = await user.findByIdAndUpdate(usr1._id,{Otp:OTP,validTill:Date.now()+300000});
            console.log(updateOtp);
            let details = {
                from: "testvalidatorautomation@outlook.com",
                to: `${email}`,
                subject: "Your Otp",
                html: `
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <p style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Book Kart</p>
                </div>
                <p style="font-size:1.1em">Hi,${fullname}</p>
                <p> Use the following OTP to complete your Sign Up procedures. OTP is valid for 1 Hour</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Book Kart</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Book Kart</p>
                    <p>Tamil Nadu</p>
                    <p>India</p>
                </div>
                </div>
            </div>
                `
            }
            mailtransporter.sendMail(details,function(err,data){
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent");
                    res.status(200).json({message:"User Created",user:usr1._id});
                }
            });
        }
    }catch(e){
        console.log(e);
    }
}

//resend otp
const resendOtp = async(req,res)=>{
    const {email} = req.body;
    try{
        const usr = await user.findOne({email:email});
        if(usr){
            const OTP = otpGenerator.generate(4,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
            const updateOtp = await user.findByIdAndUpdate(usr._id,{Otp:OTP,validTill:Date.now()+300000});
            console.log(updateOtp);
            let details = {
                from: "testvalidatorautomation@outlook.com",
                to: `${email}`,
                subject: "Your Otp",
                html: `
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <p style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Book Kart</p>
                </div>
                <p style="font-size:1.1em">Hi,${updateOtp.fullname}</p>
                <p> Use the following OTP to complete your Sign Up procedures. OTP is valid for 1 Hour</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Book Kart</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Book Kart</p>
                    <p>Tamil Nadu</p>
                    <p>India</p>
                </div>
                </div>
            </div>
                `
            }
            mailtransporter.sendMail(details,function(err,data){
                if(err){
                    console.log(err);
                }else{
                    console.log("Email sent");
                    res.status(200).json({message:"Otp Sent"});
                }
            });
        }
    }catch(e){
        console.log(e);
    }
}
            

async function verifyOtp(req,res){
    const {uid,otp} = req.body;
    const User = await user.findById(uid);
    console.log(User);
    if(User.Otp === otp){
        const usr = await user.findByIdAndUpdate(User._id,{Otp:'',isAuth:true});
        console.log(usr);
        let details = {
            from: "testvalidatorautomation@outlook.com",
            to: `${usr.email}`,
            subject: "Thank You",
            html: `
            <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title></title>
            <link href='https://fonts.googleapis.com/css?family=Lato:300,400|Montserrat:700' rel='stylesheet' type='text/css'>
            <style>
                @import url(//cdnjs.cloudflare.com/ajax/libs/normalize/3.0.1/normalize.min.css);
                @import url(//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css);
            </style>
            <link rel="stylesheet" href="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/default_thank_you.css">
            <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/jquery-1.9.1.min.js"></script>
            <script src="https://2-22-4-dot-lead-pages.appspot.com/static/lp918/min/html5shiv.js"></script>
        </head>
        <body>
            <header class="site-header" id="header">
                <h1 class="site-header__title" data-lead-id="site-header-title">Verified!</h1>
            </header>

            <div class="main-content">
                <i class="fa fa-check main-content__checkmark" id="checkmark"></i>
                <p class="main-content__body" data-lead-id="main-content-body">Hi, ${usr.name} ,You have been Successfully Verified. Now you can take books and read , Be sure not to damage anything</p>
            </div>

            <footer class="site-footer" id="footer">
                <p class="site-footer__fineprint" id="fineprint">Book Kart</p>
            </footer>
        </body>
        </html>
        `
        }
        mailtransporter.sendMail(details,function(err,data){
            if(err){
                console.log(err);
            }else{
                console.log("Email sent");
            }
        });
        res.json({message:"Otp Verified Sucessfully"});
    }else{
        res.status(401).json({message:"Invalid Otp"});
    }
}

async function login(req,res){
    try{
        const {email,password} = req.body;
        const User = await user.findOne({email:email});
        if(User){
            const pass = verifyPassword(password,User.password);
            if(pass){
                const token = jwt.sign({_id:User._id},"Hello");
                res.cookie("token",token,{expires:new Date(Date.now()+ 7200000)}).status(200).json({message:"Login Successfull",token:token,user:User._id});
            }else{
                res.status(401).send("Invalid Password");
            }
        }else{
            res.status(402).send("User Not Found");
        }
    }catch(err){
        console.log(err);
    }
}

async function Logout(req,res) {
    try {
        res.clearCookie("token").status(200).json({message:"Logged out sucessfully"});
    } catch (error) {
        console.log(error);
    }
}

async function profile(req,res){
    try {
        const {id} = req.params;
        if(id){
            const User = await user.findById(id);
            res.status(200).json({user:User});
        }else{
            res.status(401).json({message:"Provide an id"});
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    signup,
    resendOtp,
    verifyOtp,
    login,
    Logout,
    profile
}