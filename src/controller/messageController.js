const Messages = require("../model/messageModel");

module.exports.getMessages = async (req, res, next) => {
 
};

module.exports.addMessage = async (data) => {
 await Messages.create(data)
};