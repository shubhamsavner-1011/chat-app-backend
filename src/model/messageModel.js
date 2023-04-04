const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, default : null},
    senderId: {
    _id: {
      type: String,
      ref: "User",
    },
    username: {
      type: String,
      ref: "User"
    }
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    imageId : {
      type : String,
      ref: "Image"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
