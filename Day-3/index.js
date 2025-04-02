const express = require("express")

const port = 1804;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let students = [
    { id: 1, name: "Manav", subject: "node" },
]
app.get("/", (req, res) => {
    res.render("index", { students })
})

app.post("/addData", (req, res) => {
    req.body.id = students.length + 1
    students.push(req.body)
    res.redirect("/")
})

app.get("/deleteData", (req, res) => {
    let newData = students.filter((item) => item.id != req.query.id)
    students = newData;
    res.redirect("/")
})

app.get("/editData/:id", (req, res) => {
    let singleData = students.find((item) => item.id == req.params.id)
    res.render("edit", { singleData })
})

app.post("/updateData", (req, res) => {
    students.forEach((item) => {
        if (item.id == req.body.id) {
            item.name = req.body.name,
                item.subject = req.body.subject
        } else {
            item
        }
    })
    res.redirect("/")
})

app.listen(port, (err) => {
    err ? console.log(err) : console.log("Server started port :" + port);
})