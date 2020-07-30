const express = require('express')
const app = express();
const cors = require('cors')
const monk = require('monk')

const db = monk('localhost:27017/meower')
const mews = db.get('mews')


app.use(cors());
app.use(express.json())
app.get('/', (req,res)=>{
    res.json({
        message:"Meower"
    })
})


app.get('/mews', (req,res)=>{
    mews.find()
    .then(mews => {
        res.json(mews)
    })
})

function isValid(mew) {
    return mew.name && mew.name.toString().trim() !== "" &&
     mew.content && mew.content.toString().trim() !== ""
}

app.post("/mews" , (req,res) =>{
    if (isValid(req.body)) {
        const mew = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        }
        mews.insert(mew)
        .then(createdMew => {
            res.json(createdMew)
        })
    } else {
        res.status(422)
        res.status({
            message:'Name and content are required'
        })
    }
})


app.listen(5000, ()=>{
    console.log("Listening on localhost 5000")
})