const express = require("express")
const bodyParser = require("body-parser")
const connection = require("./Configiration/Config");
const router = require("./Controller/Routes/Routers");
const cors = require("cors");
const app = express();


// app.use(express.static("uploads"))
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.disable('etag')
function logApiStatus(req, res, next) {
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} - ${res.statusCode}`);
  });
  next();
}
app.use("/api",logApiStatus, router)

app.use((err, req, res, next) => {
    console.log("Error:", err);
     
    res.status(500).send("Internal Server Error");
})
process.on("SIGINT", () => {
    connection.end();
    process.exit();
})
// console.log(process);
const port = 8080;
app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
})