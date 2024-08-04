const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js")
const {validateReview, IsLoggedIn, IsReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

//Post Reviews
router.post("/", IsLoggedIn,validateReview ,wrapAsync(reviewController.CreateReview))

// Delete Review 
router.delete("/:reviewId", IsLoggedIn,IsReviewAuthor,wrapAsync(reviewController.DeleterReview))


module.exports = router