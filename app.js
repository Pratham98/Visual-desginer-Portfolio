const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Graphic=require("./models/graphics");
const Video=require("./models/video");
const methodOverride=require("method-override");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const User = require("./models/user");
const nodemailer = require("nodemailer");
const flash=require("connect-flash");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/moksh", { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false });

app.use(express.static(__dirname + "/public"));
app.use("/media",express.static(__dirname + "/media"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Pratham",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
})

app.get("/", function (req, res, next) {
    res.render("home");
});

app.get("/about", function (req, res, next) {
    res.render("about");
});

app.get("/graphics", function (req, res, next) {
    Graphic.find({},function(err,allgraphics){
        if(err){
            console.log(err);
        }else{
            res.render("graphics/graphics",{graphics:allgraphics});
        }
    })
    
});

app.post("/graphics",isLoggedIn,function(req,res,next){
    let name = req.body.name;
    let image = req.body.image;
    let thumbnail=req.body.thumbnail

    let newGraphic = { name: name, image: image, thumbnail:thumbnail};
    Graphic.create(newGraphic,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/graphics");
        }
    })
})

app.get("/graphics/new",isLoggedIn,function(req,res,next){
    res.render("graphics/new");
})

app.delete("/graphics/:id",isLoggedIn,function(req,res,next){
    Graphic.findByIdAndDelete(req.params.id,function(err,deletedgraphic){
        if(err){
            res.redirect("/graphics");
        }else{
            res.redirect("/graphics");

        }
    })
});

app.get("/video", function (req, res, next) {
    Video.find({},function(err,allvideos){ 
        if(err){
            console.log(err);
        }else{
            res.render("video/video",{videos:allvideos});
        }
    })
});

app.post("/video",isLoggedIn,function(req,res,next){
    let name = req.body.name;
    let image = req.body.image;
    let thumbnail=req.body.thumbnail;

    let newVideo = { name: name, image: image,thumbnail:thumbnail};
    Video.create(newVideo,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/video");
        }
    })
})

app.get("/video/new",isLoggedIn,function(req,res,next){
    res.render("video/new");
})

app.delete("/video/:id",isLoggedIn,function(req,res,next){
    Video.findByIdAndDelete(req.params.id,function(err,deletedvideo){
        if(err){
            res.redirect("/video");
        }else{
            res.redirect("/video");

        }
    })
});

app.get("/contact", function (req, res, next) {
    res.render("contact");
});

app.post("/contact",function (req, res, next){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'example@gmail.com',
          pass: 'password'
        }
      });
      
      var mailOptions = {
        from: 'example@gmsil.com',
        to: 'example@gmsil.com',
        subject: req.body.contact.name,
        text:req.body.contact.email+" \n \n" + req.body.contact.comment
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          req.flash('error',error.message);
          res.redirect("/contact")
        } else {
          console.log('Email sent: ' + info.response);
          req.flash('success','Message sent successfully');
          res.redirect("/contact")
        }
      });
      

})


app.get('/register',function(req,res,next){
    res.render("register");
})

app.post("/register",function(req,res,next){
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register')
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/");
            })
        }
    })
})

app.get('/login',function(req,res,next){
    res.render("login");
})

app.post('/login',passport.authenticate("local",{
successRedirect:"/",
failureRedirect:"/login"
}), function(req,res,next){
});

app.get("/logout",function(req,res,next){
    req.logOut();
    res.redirect("/");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

app.listen(3000, function () {
    console.log("server started at port 3000")
})