const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

// Middelware :: Programs :: Which runs in advance.
app.use(cors()); // unblocking cors policy
app.use(express.json()); // BODY :: RAW :: JSON
app.use(express.urlencoded({ extended: true })); // BODY :: URL ENCODED
const upload = multer(); // BODY :: FORM DATA


const main = require("./main.js");


app.get("/a", (req, res) => {
    res.json({ title: "Welcome!!" });
});


app.post("/adduser", async (req, res) => {
    try {
        // lets read the query parameter

        const input = req.body;

        // calling db logic :: async :: non blocking
        await main.addUser(input);

        res.json({ message: "success" });
    } catch (err) {
        //res.json({ message: "failure" });
        res.json(err);
    }
});

app.post("/loginuser", async (req, res) => {
    try {

        const input = req.body;
        const bol = await main.loginUser(input);

        res.send(bol);
    } catch (error) {
        res.json(error)
    }

});

app.get("/getData", main.authmid, async (req, res) => {

    // const bol = await main.getData();
    // console.log("aaa")
    // console.log(bol)
    // res.json(bol);
    res.send("Working fine")
});


app.listen(5000);

// app.use((req, res, next) => {
//     console.log(req.method, req.path);
//     next();
// })

//inetrpeter