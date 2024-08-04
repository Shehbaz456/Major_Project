if (process.env.NODE_ENV != "Production") {
    require('dotenv').config()
}
console.log(process.env.SECRET)

const express = require("express");
const app = express();
const PORT = 8000;
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

// let mongo_Url = "mongodb://127.0.0.1:27017/wanderlust"
let Atlas_db_url = process.env.ATLASDB_URL

// mongoose Server with database Wanderlust
main().then((res)=>{
    console.log("connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(Atlas_db_url);
}

// override with POST having ?_method=DELETE,PUT
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")))

const store = MongoStore.create({
    mongoUrl:Atlas_db_url,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",(err)=>{
    console.log("Error in Mongo session STORE",err);  
})

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true ,
        expires:Date.now() + 7 * 24 *60*60*1000,
        maxAge:7 * 24 *60*60*1000,
        httpOnly:true
    }
}

app.get("/",(req,res)=>{
    res.redirect("/listings")
})



app.use(session(sessionOption))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash('success'),
    res.locals.error = req.flash('error'),
    res.locals.currUser = req.user;
    next();
})


app.use("/listings",listingsRouter)
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/",userRouter)


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not found!"))
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"} = err
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(PORT,()=>{
    console.log(`Active Port ${PORT}`);
})


// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"Hello@gmail.com",
//         username:'Shehbaz'
//     })
//     let registerUser = await User.register(fakeUser,"helloWorldPassword");
//     res.send(registerUser);
// })
