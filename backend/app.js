let express = require("express")
let app = express()
let mongoose = require("mongoose")
let bodyParser = require('body-parser')

app.use(bodyParser.json())

mongoose.connect("mongodb://localhost/foodForEarth")

let binSchema = new mongoose.Schema({
    name: String,
    location: String
})

let Bin = mongoose.model("Bin", binSchema)

Bin.create (
    {
        name: "Bin 1",
        location: "123 John Street"
    }, (err, bin) => {
        if(err){
            console.log(err)
        } else {
            console.log("Bin Created")
            console.log(bin)
        }
    }
)

app.get("/bins", (req, resp) => {
    resp.json([])
})


app.get("/", (req, resp) => {
    resp.send("testing connection")
})

app.listen(3000, () => {console.log('server started')})