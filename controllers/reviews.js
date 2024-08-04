const Listing = require("../models/listing");
const Review = require("../models/review")

module.exports.CreateReview = async(req,res,next)=>{
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // console.log(newReview);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash('success','New Review Created!')
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.DeleterReview = async(req,res,next)=>{
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})    
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review Deleted!')
    res.redirect(`/listings/${id}`)
}