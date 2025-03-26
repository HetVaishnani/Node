const http = require("http");
const port = 1804;

const PortHandler = (req, res) => {
    res.write("<h1>Server is started on port 1804</h1>");
    res.end();
}

const server = http.createServer(PortHandler);

server.listen(port, (err) => {
    err ? console.log(err) : console.log("Server started on Port" + port);

})