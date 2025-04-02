const express = require("express");
const port = 2005;

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


let task_record = [];

app.get("/", (req, res) => {
    res.render("index", { task_record })
})

app.post("/addData", (req, res) => {
    req.body.id = task_record.length + 1
    task_record.push(req.body)
    res.redirect("/")
})

app.get("/editData/:id", (req, res) => {
    let singleData = task_record.find((item) => item.id == req.params.id)
    res.render("edit", { singleData })
})


app.get("/deleteData", (req, res) => {
    let newData = task_record.filter((item) => item.id != req.query.id)
    task_record = newData;
    res.redirect("/")
})

app.post("/updateData", (req, res) => {
    task_record.forEach((item) => {
        if (item.id == req.body.id) {
            item.name = req.body.name,
                item.priority = req.body.priority,
                item.status = req.body.status
        } else {
            item
        }
    })
    res.redirect("/")
})


app.listen(port, (err) => {
    err ? console.log(err) : console.log("server started in" + port)

})