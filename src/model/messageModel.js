const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: { type: String},
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
    image: { type: String },
    public_id: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
