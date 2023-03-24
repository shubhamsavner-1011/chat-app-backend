const MessageModel = require("../model/messageModel");
const ImageModel = require("../model/ImageModel");

const cloudinary = require("cloudinary").v2;
module.exports.getMessages = async (req, res) => {
  try {
    const data = await MessageModel.find({
      chatId: req.body.chatId,
    })
      .populate("chatId")
      .populate("senderId", "username")
      .populate("imageId")
    return res.status(200).json({ data });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports.addMessage = async (req, res) => {
  console.log(req.body, 'body', req.file)
  try {
    const file = await cloudinary.uploader.upload(req.file.path, {folder: "images",
    width: 150,
    crop: "scale",});
    console.log(file, 'file????')
    const newImage = new ImageModel({
      "image": file.url,
      "public_id": file.public_id
     });
     const image = await newImage.save();
    const newMessage = new MessageModel({
      senderId: req.body.senderId,
      text: req.body.text,
      chatId: req.body.chatId,
      imageId: image.id
    });
    const result = await newMessage.save();
  const messageData = await MessageModel.findById(result.id).populate("imageId")  
  console.log(messageData, 'messageData')
  const imageUrl = messageData?.imageId.image
  const {text, chatId, createdAt} = messageData
    return res.status(200).json({data: {chatId,imageUrl,text,createdAt}});
  } catch (error) {
    res.json({ message: error });
  }
};
