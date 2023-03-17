const mongoose = require("mongoose")
require("dotenv").config()

const url = process.env.DB_CONNECT
mongoose.set({strictQuery:true})
mongoose.connect(`${url}`, {useNewUrlParser:true}).then(()=>{
    console.log("connected")
}).catch(()=>{
    console.log("not connected")
})