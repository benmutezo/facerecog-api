const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt-nodejs")
const cors = require("cors")
const knex = require('knex')


const register = require('./controlers/register')
const signIn = require('./controlers/signIn')
const profile = require('./controlers/profile')
const image = require('./controlers/image')


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'ben',
        database: 'facerecog'
    }
});
app.use(bodyParser.json())

app.use(cors())

app.post("/signin", signIn.handleSignin(db, bcrypt))

app.get("/profile/:id", (req, res, db) => { profile.getProfile(req, res, db) })

app.put("/image", (req, res) => { image.handleImage(req, res, db) })

app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) })

const PORT = process.env.PORT
app.listen(PORT || 3000, () => {
    console.log(`App is running on port ${PORT}`);
})


