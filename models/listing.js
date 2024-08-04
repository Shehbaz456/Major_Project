const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review")

let listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
      url:String,
      filename: String,
      // set : (v) => v === "" ? "https://images.pexels.com/photos/5906081/pexels-photo-5906081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1":v,

      // default:"https://images.pexels.com/photos/5906081/pexels-photo-5906081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in : listing.reviews } })
  }
})

const Listing = mongoose.model("Listing",listingSchema)

module.exports = Listing

