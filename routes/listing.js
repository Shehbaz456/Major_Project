const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const {IsLoggedIn,IsOwner,validateListing} = require("../middleware.js")

const listingController = require("../controllers/listings");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")

const upload = multer({ storage })
// index Route (Show HomeListing) & //Create Listing route
router.route("/")
.get(wrapAsync(listingController.Index))
.post(IsLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.CreateListing))



// new Route
router.get("/new",IsLoggedIn,listingController.RenderNewForm)

//show Listing Route & // Update route & // Delete Route
router.route("/:id")
.get(wrapAsync(listingController.ShowListing))
.put(IsLoggedIn,IsOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.UpdateListing))
.delete(IsLoggedIn,IsOwner, wrapAsync(listingController.DeleteListing))

// Edit route
router.get("/:id/edit" ,IsLoggedIn,IsOwner, wrapAsync(listingController.RenderEditForm))








module.exports = router;