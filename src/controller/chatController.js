const ChatModel = require("../model/chatModel");

//get all products

const CreatChat = async (req, res) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.json({ message: error });
  }
};

const UserChat = async (req, res) => {
  try {
    const chat = await ChatModel.find({
        members: {$in: [req.params.userId]}
    });
    res.status(200).json(chat);
  } catch (error) {
    res.json({ message: error });
  }
};

const FindChat = async (req, res) => {
    try {
      const chat = await ChatModel.findOne({
          members: {$all: [req.params.firstId, req.params.secondId]}
      }).populate("members", "-password");
      if(!chat){
        const newChat = new ChatModel({
          members: [req.params.firstId, req.params.secondId],
        });
        const result = await newChat.save();
        res.status(200).json(result);
        return;
      }
      res.status(200).json(chat);
    } catch (error) {
      res.json({ message: error });
    }
  };

module.exports = {
  CreatChat,
  UserChat,
  FindChat
};