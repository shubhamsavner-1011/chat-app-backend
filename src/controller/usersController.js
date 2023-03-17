const User = require("../model/usersModel");
const sendToken = require("../../jwtToken");
const { hash, compare, genSalt } = require("bcrypt");
const saltRounds = 10;

const user_all = async (req, res) => {
  try {
    const allUser = await User.find();
    res.send(allUser);
  } catch (error) {
    res.json({ message: error });
  }
};

const user_details = async (req, res) => {
  try {
    const userDetails = await User.findById(req.params.userId);
    res.json(userDetails);
  } catch (error) {
    res.json({ message: error });
  }
};

const user_create = async (req, res) => {
  const { username, email, password } = req.body;
console.log("user_create")
  try {
    const userFound =  await User.findOne({email})

    if(userFound){
      return res.status(400).json({ message: "User Already Exists" });
      throw new Error()
    }
   const saltRound = await genSalt(saltRounds)
   const hashPassword = await hash(password,saltRound )
    const users = new User({
      username: username,
      email: email,
      password: hashPassword,
    });
    const saveUser = await users.save();
    return res.json({
      message: "Signup successfully" 
    })
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const user_login = async (req, res) => {
  console.log("user_login")
  const { email, password } = req.body;
  // checking if user has given password and email both
  if (!email || !password) {
    return console.log("please fill email or password");
  }
  const users = await User.findOne({ email }).select("+password");
  console.log(users, 'users') 
  if (!users) {
    return res.json({
      message: "Invalid Credentials",
      statusCode: 400,
    });
  }
  const passwordCompare = await compare(password,users.password)
console.log(passwordCompare, 'passs>>>')
 if(!passwordCompare){
  return res.json({
    message: "Invalid Credentials",
      statusCode: 400,
  })
 }
return sendToken(users, 201, res)
};

const user_update = async (req, res) => {
  console.log(req.body, ">>>>>");
  const { username, email, password } = req.body;
  const user = {
    username: username,
    email: email,
    password: password,
  };

  try {
    const updateUser = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      user
    );
    res.send(updateUser);
  } catch (error) {
    res.json({ message: error });
  }
};

const user_delete = async (req, res) => {
  console.log(req.params.userId, "?????");
  try {
    const deleteUser = await User.findByIdAndDelete({ _id: req.params.userId });
    res.send(deleteUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

const user_logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

module.exports = {
  user_all,
  user_details,
  user_create,
  user_update,
  user_delete,
  user_login,
  user_logout,
};
