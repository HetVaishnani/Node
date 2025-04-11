const express = require("express");
const port = 1111;
const path = require("path")

const app = express();

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/bc_typography", (req, res) => {
    res.render("bc_typography")
})


app.listen(port, (err) => {
    err ? console.log(err) : console.log("server Started Successfully" + port);

})