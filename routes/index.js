var express = require('express');
var router = express.Router();

// ADD: body paser, cors
var cors = require('cors');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(cors());
router.use(bodyParser.json());
const axios = require('axios');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const maria = require('../database/connect/maria');

const crypto = require('crypto-js');


router.post("/favoriteUpload", (req, res) => {
    const id = req.body.id;
    const url = req.body.url;

    var sql = 'INSERT INTO fList (ID, url) VALUES (?,?)';

    maria.query(sql, [id, url], function(err, rows, fields){
        if(!err){
            console.log("DB저장 성공")
        }else{
            console.log("DB저장 실패")
        }
    })
})

router.get("/favoritDownload", (req, res) => {
    const id = req.body.id;
    
    var sql = "SELECT url FROM fList WHERE ID = ?;"

    maria.query(sql, id, function(err, rows, feilds){
        if(!err){
            if(rows.length == 0){
                res.send("0");
            }else{
                res.send(rows);
            }
        }
        else{
            console.log(err);
        }
    })
})


module.exports = router;