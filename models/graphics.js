const mongoose = require("mongoose");

const graphicSchema = new mongoose.Schema({
    name: String,
    image: String,
    thumbnail:String
});

const Graphic = mongoose.model("Graphic", graphicSchema);

module.exports=Graphic;