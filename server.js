// server config
const express = require("express")
const server = express()

// server config to present static files
server.use(express.static('public'))

// enable form body
server.use(express.urlencoded({ extended: true }))

// database connection config
const Pool = require('pg').Pool
const database = new Pool({
    user: 'postgres',
    password: 'test4321',
    host: 'localhost',
    port: 5432,
    database: 'donate'
})

// template engine config
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// page presentation config
server.get("/", function(req, res) {
    database.query(`SELECT * FROM donor`, function(err, result) {
        if (err) return res.send("Database error")

        const donors = result.rows
        return res.render("index.html", { donors })

    })
})

// post form data
server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const bloodType = req.body.bloodType

    if (name == "" || email == "" || bloodType == "") {
        return res.send("All the fields are required!")
    }


    /* push function: insert values into an array
    donors.push({
        name: name,
        bloodType: bloodType,
    }) */


    // insert values into database
    const query = `
    INSERT INTO donor ("name", "email", "blood_type") 
    VALUES ($1, $2, $3)`

    const values = [name, email, bloodType]

    database.query(query, values, function(err) {
        // if (error), return
        if (err) return res.send("Database error")

        // else, redirect to /
        return res.redirect("/")
    })
    
})

// turn on server and listen on port 3000
server.listen(3000, function() {
    console.log("server started")
})