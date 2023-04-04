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
      // .populate("imageId");
      console.log(data, 'get-messsa')
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.addMessage = async (req, res) => {
  try {
    if (req.file) {
      const file = await cloudinary.uploader.upload(req.file.path, {
        folder: "images",
        width: 150,
        crop: "scale",
      });
      console.log(file, 'file>>>>>>')
      const newImage = new ImageModel({
        image: file.url,
        public_id: file.public_id,
      });
      const Image = await newImage.save();
      req.imageId = Image._id
      req.imgUrl = file.url
    }
    console.log(req.imageId, "imageId", req.body?.senderId.username);
    const newMessage = new MessageModel({
      senderId: {_id : req.body?.senderId, username: req.body?.senderId.username }, 
      text:  req.body?.text,
      chatId: req.body?.chatId,
      imageId: req?.imageId || "",
    });
    const result = await newMessage.save();
    console.log(result, 'server-result')
    // const messageData = await MessageModel.findById(result.id).populate(
    //   "imageId"
    // );
    // console.log(messageData, "messageData");
    const imageUrl = req.imgUrl 
    const { text, chatId, createdAt , senderId} = result;
    return res
      .status(200)
      .json({ data: { chatId, imageUrl, text, createdAt, senderId } });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
