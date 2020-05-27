const express = require('express')
const app = express();

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const Client = new MongoClient('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/task', async (req, res) => {
    // GetToDos

    await Client.connect()
    let db = Client.db('toDo')
    let collection = db.collection('toDo')

    let done = parseInt(req.query.done);

    let data = await collection.find({
        Done: done
        }).toArray()

    if (data.length > 0) {
        let responseData = {
            status: "success",
            message: "ToDos successfully gotten!",
            data: data
        };
        return res.json(responseData)
    }

    let responseData = {
        status: "failure",
        message: "error getting data from database",
        data: null
    };
    return res.json(responseData)
})

app.put('/toDone/:id', jsonParser, async (req, res) => {
    // UpdateToDone

    await Client.connect()
    let db = Client.db('toDo')
    let collection = db.collection('toDo')

    let id = req.params.id

    let data = await collection.updateOne({
        _id: ObjectId(id)
    }, {
        $set: {
            Done: 1
        }
    })
    if (data.modifiedCount == 1) {
        let responseData = {
            status: "success",
            message: "ToDo successfully todone!",
            data: {}
        };
        return res.json(responseData)
    }

    let responseData = {
        status: "failure",
        message: "error getting data from database",
        data: data
    };
    return res.json(responseData)
})

app.post('/addTask/:task', jsonParser, async (req, res) => {
    // AddToDo

    await Client.connect()
    let db = Client.db('toDo')
    let collection = db.collection('toDo')

    let task = req.params.task

    let data = await collection.insertOne({
        Task: task,
        Done: 0
    })
    console.log(data)
    if (data.insertedCount == 1) {
        let responseData = {
            status: "success",
            message: "ToDo successfully added!",
            data: data
        };
        return res.json(responseData)
    }

    let responseData = {
        status: "failure",
        message: "error getting data from database",
        data: {}
    };
    return res.json(responseData)
})

// app.get('/done', async (req, res) => {
//     // getToDones

//     await Client.connect()
//     let db = Client.db('toDo')
//     let collection = db.collection('toDo')

//     let data = await collection.find({
//         Done: 1
//     }).toArray()
//     if (data.length > 0) {
//         let responseData = {
//             status: "success",
//             message: "ToDones successfully gotten!",
//             data: data
//         };
//         return res.json(responseData)
//     }

//     let responseData = {
//         status: "failure",
//         message: "error getting data from database",
//         data: data
//     };
//     return res.json(responseData)
// })

app.listen(3000);