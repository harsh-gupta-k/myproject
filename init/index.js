const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');2

main().then(()=>
{
    console.log("connection established");
}).catch((err)=>
{
    console.log(err);
});

async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async()=>
{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "67ee926f0f2390a1610c6c11"

    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();