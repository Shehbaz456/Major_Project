const User =require("../models/user")

module.exports.RenderSignUpForm = (req,res)=>{
    res.render("users/signup")
}

module.exports.SignUp = async(req,res)=>{
    try {
        let {username,email,password} = req.body;
        let newUser = new User({username,email})
        let registerUser = await User.register(newUser,password);
        // console.log(registerUser);

        req.login(registerUser,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash("success","Welcome to wonderLust");
            res.redirect("/listings")
        });
    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }
} 

//RenderLoginForm
module.exports.RenderLoginForm = (req,res)=>{
    res.render("users/login")
}
//Login
module.exports.Login = async(req,res)=>{
    req.flash("success", "Welcome to wonderlust , You are Logged In");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}

//Logout
module.exports.LogOut =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged Out!")
        res.redirect("/listings")
    });
}