const express = require("express");
const path = require("path");
const port = 1112;
const app = express()

const schema = require("./model/fiSchema")
const db = require("./config/db")
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))


app.get("/", async (req, res) => {
    await schema.find({}).then((book) => {

        res.render("index", { book })
    })
})

app.get("/book", (req, res) => {
    res.render("add")
})

app.post("/add", async (req, res) => {
    await schema.create(req.body).then(() => {
        res.redirect("/")
    })
})

app.get("/deletebook", async (req, res) => {
    await schema.findByIdAndDelete(req.query.id).then(() => {
        res.redirect("/")
    })
})

app.get("/editbook", async (req, res) => {
    await schema.findById(req.query.id).then((singleData) => {
        res.render("Edit", {singleData})
    })
})

app.post("/Updatebook", async (req, res) => {
    await schema.findByIdAndUpdate(req.body.id, req.body).then(() => {
        res.redirect("/")
    })
})

app.listen(port, (err) => {
    err ? console.log(err) : console.log("Server Started" + port);
})