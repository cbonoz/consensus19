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

const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'a secret');

const PORT = 9001

const app = express()
const server = http.createServer(app)

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db._.mixin({
    upsert: function(collection, obj, key) {
      key = key || 'id';
      for (var i = 0; i < collection.length; i++) {
        var el = collection[i];
        if(el[key] === obj[key]){
          collection[i] = obj;
          return collection;
        }
      };
      collection.push(obj);
    }
  });

// Set some defaults (required if your JSON file is empty)
// TODO: replace with persistent mappings.
db.defaults({ contracts: [] }).write()

// const io = require('socket.io')(server, {origins: '*:*'})

const contractsimple = require('./contractsimple')

function getHash(data) {
    hmac.update(data);
    return hmac.digest('hex')
}

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
    const fileName = metadata.name
    const uploadUrl = `./contracts/${fileName}`

    // Save the encrypted file to the upload directory, and return success.
    contractsimple.deployContract(fileName, uploadUrl, JSON.stringify(metadata), metadata.privateChecked || false, (e, address) => {
        console.log('errors', e)
        console.log(`deploy contract ${address} for ${fileName}`)
        // metadata.address = address
        fs.writeFileSync(uploadUrl, fileContent)
        metadata.address = address

        // Save and store the contract address -> contract mapping.
        const contracts = db.get('contracts')
        const existing = contracts.find({address}).value()
        if (existing) {
            contracts.find({address}).assign(metadata).write()
        } else {
            contracts.push(metadata).write()
        }

        return res.json(metadata)
    })
})

app.put('/view/:address/:user', (req, res) => {
    const address = req.params.address
    const user = req.params.user

//     const batch = new web3.BatchRequest();
// batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest'));
// batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}));
// batch.execute().then(...);
    const contract = contractsimple.getContract(address)
    // contract.methods.viewed(user).send(contractsimple.getDefaultAccount()).then((data)=>{
        // console.log('Created View Event on quorum', address, user, data);
    // })
    console.log('Creating View Event on quorum', address, user)
})

// TODO: add edit/sign features.
/* API endpoints below */

// Return a list of files associated with the given key.
app.get('/api/files/:sharingKey', (req, res) => {
    const sharingKey = req.params.sharingKey
    const data = db.get('contracts').find({ sharingKey }).value()
    return res.json(data || {})
})

app.get('/api/files', (req, res) => {
    const data = db.get('contracts').find().value()
    return res.json(data || {})
})


server.listen(PORT, () => {
    console.log('Express server listening on localhost port: ' + PORT)
})
