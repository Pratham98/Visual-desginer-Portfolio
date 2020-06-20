const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    name: String,
    image: String,
    thumbnail:String
});

const Video = mongoose.model("Video", videoSchema);

module.exports=Video;