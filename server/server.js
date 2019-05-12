'use strict'

const axios = require('axios')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const http = require('http')
// https://github.com/expressjs/multer
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const cs = require('./truffle/build/contracts/ContractSimple.json')

const PORT = 9001

const app = express()
const server = http.createServer(app)

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
// TODO: replace with persistent mappings.
db.defaults({ contracts: [] }).write()

// const io = require('socket.io')(server, {origins: '*:*'})

const contractsimple = require('./contractsimple')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.get('/hello', (req, res) => {
    return res.json("hello world")
})


app.get('/upload/')

/** Permissible loading a single file,
 the value of the attribute "name" in the form of "recfile". **/
 const type = upload.any();

app.post('/upload', type, function (req, res, next) {
    // req.body contains the text fields
    const fileContent = req.body.file
    const metadata = JSON.parse(req.body.metadata)
    // TODO: save these metadata fields to Neo.
    const name = metadata.name
    const lastModified = metadata.lastModifiedDate
    const address = metadata.address
    const fileHash = metadata.hash
    const key = metadata.key // TODO: confirm signing authority.
    console.log(fileContent)

    const fileName = address + "_" + name

    fs.writeFileSync(`./contracts/${fileName}`, fileContent)

    // Save the encrypted file to the upload directory, and return success.
    contractsimple.deployContract(fileName, metadata, (e, address) => {
        console.log('deploy contract', e, address)
        db.get('contracts').push({ address, metadata}).write()
        return res.json(contract)
    })
})

app.put('/view/:address/:user', (req, res) => {
    const address = req.params.address
    const user = req.params.user
    console.log('address', address)

    cs.viewed(address)
})

app.put('/edit/:address/:user', (req, res) => {
    const address = req.params.address
    const user = req.params.user
    console.log('address', address)

    cs.edited(address)
})


/* API endpoints below */

// Return a list of files associated with the given address.
app.get('/api/files/:address', (req, res) => {
    const address = req.params.address
    console.log('address', addEventListener)
    const data = db.get('posts').find({ address }).value()
    return res.json(data || {})
})

app.get('/api/files', (req, res) => {
    const data = db.get('posts').find().value()
    return res.json(data || {})
})


server.listen(PORT, () => {
    console.log('Express server listening on localhost port: ' + PORT)
})
