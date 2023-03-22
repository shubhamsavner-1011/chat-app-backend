const MessageModel = require("../model/messageModel");

module.exports.



getMessages = async (req, res, next) => {
  console.log(req.body.chatId, 'chatId>>>>>>>')
  try {
    const data = await MessageModel.find({
      chatId: req.body.chatId,
    }).populate("chatId").populate("senderId", "username");
    return res.status(200).json({ data });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports.addMessage = async (req, res) => {
  console.log(req.body, "body??????");
  try {
    const newMessage = new MessageModel({
      senderId: req.body.senderId,
      text: req.body.text,
      chatId: req.body.chatId,
    });
    const result = await newMessage.save();
    return res.status(200).json(result);
  } catch (error) {
    res.json({ message: error });
  }
};
