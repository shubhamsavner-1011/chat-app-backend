const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { type: String},
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: "User",
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    imageId : {
      type : String,
      ref:"Image"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
