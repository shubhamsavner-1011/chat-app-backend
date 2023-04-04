const MessageModel = require("../model/messageModel");
// const ImageModel = require("../model/ImageModel");

const cloudinary = require("cloudinary").v2;
module.exports.getMessages = async (req, res) => {
  try {
    const data = await MessageModel.find({
      chatId: req.body.chatId,
    })
      .populate("chatId")
      .populate("senderId", "username");
    console.log(data, "get-messsa");
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.addMessage = async (req, res) => {
  try {
    if (req.body?.text && req.file) {
      console.log("both of value")
      const file = await cloudinary.uploader.upload(req.file.path, {
        folder: "images",
        width: 150,
        crop: "scale",
      });
      const newMessage = new MessageModel({
        image: file.url,
        public_id: file.public_id,
        senderId: {
          _id: req.body?.senderId,
          username: req.body?.senderId.username,
        },
        text: req.body?.text,
        chatId: req.body?.chatId,
      });
     const result = await newMessage.save();
      return res.status(200).json({ data: result });
    }
    if (req.file) {
      console.log(req.file, 'only file')
      const file = await cloudinary.uploader.upload(req.file.path, {
        folder: "images",
        width: 150,
        crop: "scale",
      });
      const newMessage = new MessageModel({
        image: file.url,
        public_id: file.public_id,
        chatId: req.body?.chatId,
        senderId: {
          _id: req.body?.senderId,
          username: req.body?.senderId.username,
        },
      });
     const result = await newMessage.save();
      return res.status(200).json({ data: result });
    }
    if (req.body?.text) {
      console.log(req.body?.text, 'only body')
      const newMessage = new MessageModel({
        senderId: {
          _id: req.body?.senderId,
          username: req.body?.senderId.username,
        },
        text: req.body?.text,
        chatId: req.body?.chatId,
      });

      const result = await newMessage.save();
      return res.status(200).json({ data: result });
      // console.log(result, "server-result");
    }
    // const imageUrl = req.imgUrl;
    // const { text, chatId, createdAt, senderId } = result;
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
