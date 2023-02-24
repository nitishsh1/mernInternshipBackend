import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import router from './Routes/router.js'
import cors from "cors"
import './db/conn.js'
const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static('./uploads'))
app.use("/files",express.static("./public/files"));

app.use(router)

const PORT= process.env.PORT||8080;

app.get('/' , (req, res) => {
    res.send("hello world")
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})