const express = require("express");
const {CreatChat, UserChat, FindChat} = require("../controller/chatController")
const router = express.Router()

router.post('/',CreatChat)
router.get('/:userId',UserChat)
router.get('/find/:firstId/:secondId',FindChat)


module.exports = router;