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
const maria = require('../../database/connect/maria');

const crypto = require('crypto-js');


router.post("/favoriteUpload", (req, res) => {
    const id = req.body.id;
    const url = req.body.url;

    console.log(id, url)
    
    var sql = 'INSERT INTO FAVORITE (ID, URL) VALUES (?,?)';

    maria.query(sql, [id, url], function(err, rows, fields){
        if(!err){
            console.log("DB저장 성공")
        }else{
            console.log("DB저장 실패")
            console.log(err)
        }
    })
})

router.post("/favoriteDownload", (req, res) => {
    const id = req.body.id;
    console.log(id)
    
    var sql = "SELECT URL FROM FAVORITE WHERE ID = ?;"

    maria.query(sql, id, function(err, rows, feilds){
        if(!err){
            if(rows.length == 0){
                res.send("0");
            }else{
                res.send(rows.URL);
            }
        }
        else{
            console.log(err);
        }
    })
})


module.exports = router;