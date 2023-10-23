const mongoose = require("mongoose")

const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URL,{useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
        console.log("database connected successfully")
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDatabase
