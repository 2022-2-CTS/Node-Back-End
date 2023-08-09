const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();
router.use(bodyParser.json());

const fs = require('fs');
const axios = require('axios');

const conn = require('../../database/connect/maria');

var sql = 'INSERT INTO POST (ID, TITLE, DATE, LOCATION, TAG, CONTENT) values ( ?, ?, ?, ?, ?, ? )';

router.post('/posts', (req, res) => {

    var data = [
        req.userId,
        req.title,
        req.date,
        req.location,
        req.tag,
        req.contant,
    ]

    conn.query(sql, data, function (err, rows) {
        if (err) {
            console.log(err)
        }
        else{
            console.log("저장")
        }
    })

})

module.exports = router;