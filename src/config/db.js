const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.DB_CONNECT
console.log('url', url);
mongoose.set({strictQuery:true})
mongoose.connect(`${url}`, {useNewUrlParser:true}).then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err);
    console.log("not connected")
})