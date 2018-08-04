let express = require("express")
let app = express()
let mongoose = require("mongoose")
let bodyParser = require('body-parser')

app.use(bodyParser.json())

mongoose.connect("mongodb://localhost/foodForEarth")

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    bins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bin"
        }
    ]
})

let binSchema = new mongoose.Schema({
    location: String
})

let User = mongoose.model("User", userSchema)

let Bin = mongoose.model("Bin", binSchema)

User.collection.drop()

Bin.collection.drop()

User.create (
    {
        name: "Harry",
        email: "harry@gmail.com"
    }, (err, user) => {
        if(err){
            console.log(err)
        } else {
            console.log("User Created")
            console.log(user)
            Bin.create(
                {
                    location: "7 Kelly St"
                }, 
                    (err, bin) => {
                    if(err) {
                        console.log(err)
                    } else {
                        user.bins.push(bin)
                        user.save()
                        console.log("bin created")
                    }
                }
            )
        }
    }
)

User.create (
    {
        name: "Sally",
        email: "sally@gmail.com"
    }, (err, user) => {
        if(err){
            console.log(err)
        } else {
            console.log("User Created")
            console.log(user)
        }
    }
)

app.get("/users", (req, resp) => {
    User.find({}).then(users => {
        resp.json(users)
    })
})

app.get("/bins", (req,resp) => {
    Bin.find({}).then(bins => {
        resp.json(bins)
    })
})

app.get('/users/:id', (req, resp) => {
    const id = req.params.id
    User.findById(id).then(user => {
        resp.json(user)
    }).catch(err => {
        console.log(err)
    })
})

app.post('/users', (req, resp) => {
    console.dir(req.body)
    resp.send('ok!')
    const user = req.body
    User.create(user).then(user => {
        resp.json(user)
    })
})

app.post('/users/:id/bins', (req, resp) => {
    const id = req.params.id
    const binparams = req.body 
    User.findById(id).then(user => {
        Bin.create(binparams, (err, bin) => {
            if(err) {
                console.log(err)
            } else {
                console.log(user.bins)
                user.bins.push(bin)
                user.save()
                console.log("bin created")
                resp.json(bin)
            }
        })
    })
})



app.listen(3000, () => {console.log('server started')})