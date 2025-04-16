const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controller/listing.js");

const multer = require("multer");

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage})

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

///index route
// router.get(
//     "/",
//     wrapAsync(listingController.index)
// );

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroy));

// show route
// router.get(
//     "/:id",
//     wrapAsync(listingController.showListing)
// );

// create route
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

//update route
// router.put(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.update)
// );

// // delete route
// router.delete(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroy)
// );

module.exports = router;
