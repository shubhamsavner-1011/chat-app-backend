const express = require("express")
const router = express.Router()
const { addMessage, getMessages } = require("../controller/messageController");

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;