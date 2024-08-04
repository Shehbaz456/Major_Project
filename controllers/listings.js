let Listing = require("../models/listing")

module.exports.Index = async(req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index",{allListings});
    
}

module.exports.RenderNewForm =  (req,res)=>{
    res.render("listings/new");  
}

module.exports.ShowListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner")
    if(!listing){
        req.flash('error','listing you requested does not exist.')
        res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/show",{listing});  
}

module.exports.CreateListing =async(req,res,next)=>{
    let url = req.file.path;
    let filename =req.file.filename;
    // console.log(url,"...",filename);
    let newlisting =  new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename}
    await newlisting.save();
    req.flash('success','New listing Created!')
    res.redirect('/listings')
}
module.exports.RenderEditForm =async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash('error','listing you requested does not exist.')
        res.redirect("/listings")
    }

    let originalImgUrl = listing.image.url
    originalImgUrl=originalImgUrl.replace("/upload","/upload/w_250")

    res.render("listings/edit",{listing,originalImgUrl});   
}

module.exports.UpdateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!== "undefined"){
        let url = req.file.path;
        let filename =req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash('success','Listing Updated!');
    res.redirect(`/listings/${id}`);   
}

module.exports.DeleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','Listing Deleted!')
    res.redirect("/listings");   
}