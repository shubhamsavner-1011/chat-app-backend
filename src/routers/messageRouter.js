const express = require("express")
const router = express.Router()
const { addMessage, getMessages } = require("../controller/messageController");
const { uploadImage } = require("../middleware/multer");

router.post("/createmsg/",uploadImage, addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;