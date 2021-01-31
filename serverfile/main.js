const Promise = require("bluebird");
const mysql = require("mysql");
//const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "poonam",
    database: "abc",
};

let addUser = async (input) => {
    const connection = mysql.createConnection(DB_CONFIG);
    // const hashedPassword = await bcrypt.hash(input.passWord, 8);
    // input.passWord = hashedPassword;
    await connection.connectAsync();

    let sql =
        "INSERT INTO USERs (userName,name,email,passWord) VALUES (?, ?, ?, ?)";
    await connection.queryAsync(sql, [
        input.userName,
        input.name,
        input.email,
        input.passWord,
    ]);

    await connection.endAsync();
};



let loginUser = async (input) => {
    const connection = mysql.createConnection(DB_CONFIG);

    await connection.connectAsync();
    let sql = "Select * from Users where userName=?";
    const b = await connection.queryAsync(sql, [
        input.userName
    ]);
    var a = JSON.parse(JSON.stringify(b))
    var c = false;

    // if (a[0].userName == input.userName && (await bcrypt.compare(input.passWord, a[0].passWord))) //rowdatapacket accessing
    if (a[0].userName == input.userName && input.passWord == a[0].passWord) //rowdatapacket accessing
    {
        c = true;

        const token = jwt.sign({ userName: input.userName }, "newToken")

        let sql1 = "update users set token=? where userName=?";
        try {
            await connection.queryAsync(sql1, [token, input.userName])

        } catch (error) {
            console.log(error)
        }

        await connection.endAsync();

        return { c, token }
    }

    await connection.endAsync();
    return c
};



let getData = async () => {
    const url = 'http://kbcs.in:8080/englishlab/TenseAPI'

    const request = require('request');

    const r = request({ url: url, json: true }, function (error, response1, body) {
        // console.log(response1.body);
        // console.log(response1.body.questArray);
        return response1;
    })
    console.log("1");
    console.log();
    console.log(r);
    return r;
};

const authmid = async (req, res, next) => {
    try {
        const connection = mysql.createConnection(DB_CONFIG);

        await connection.connectAsync();

        const token = req.header("Authorization").replace("Bearer",);
        const decoded = jwt.verfiy(token, "newToken")
        console.log(decode.userName)

        next();
    } catch (error) {

    }
}
module.exports = { addUser, loginUser, getData, authmid };
