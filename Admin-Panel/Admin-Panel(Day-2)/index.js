const express = require("express")
const port  = 1008
const path = require("path")

const app = express()
const db = require("./config/db")
const cookie = require("cookie-parser")

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use(cookie())

app.use("/",require("./routes/route"))

app.listen(port,(err)=>{
    err ? console.log(err) : console.log("server started on port : "+port);
})
