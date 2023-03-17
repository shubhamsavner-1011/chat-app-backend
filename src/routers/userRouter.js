const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController");

router.post("/register", usersController.user_create);
router.post("/login", usersController.user_login);
router.get("/logout", usersController.user_logout);
router.get("/", usersController.user_all);
router.get("/:userId", usersController.user_details);
router.put("/:userId", usersController.user_update);
router.delete("/:userId", usersController.user_delete);
// router.get("/home", );

module.exports = router;
