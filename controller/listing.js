const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    // console.log(listing.owner.username);
    if(!listing)
    {
        req.flash("error", "Listing you requested for does not existed");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}


module.exports.createListing = async (req, res, next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "new listing created");
        res.redirect("/listings");
    }

module.exports.edit = async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if(!listing)
            {
                req.flash("error", "Listing you requested for does not existed");
                return res.redirect("/listings");  
            }
        
        // let originalImageUrl = listing.image.url;
        // originalImageUrl.replace("/upload", "/upload/h_300,w_300");
        // console.log(originalImageUrl)
        res.render("listings/edit.ejs", { listing, });
    }


module.exports.update = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let del = await Listing.findByIdAndDelete(id);
    // console.log(del);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}