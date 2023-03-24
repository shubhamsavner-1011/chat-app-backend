const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: { type: String },
    public_id: { type: String },
  },
);

module.exports = mongoose.model("Image", imageSchema);
