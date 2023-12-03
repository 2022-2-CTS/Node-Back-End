var express = require('express');
var router = express.Router();

// ADD: cors
var cors = require('cors');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
const axios = require('axios');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const maria = require('../database/connect/maria');

const crypto = require('crypto-js');

const secretKey = 'culture';

router.post('/', (req, res) => {
    const token = req.body.token
    console.log(token)

    if(token == null){
        res.status(400).json({status:"fail", msg:"token 값 오류"})
        return
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        try{
            if(!err){
                res.status(200).json({status:"success", msg:"valid", data:decoded})
            }else{
                res.status(200).json({status:"success", msg:"invalid", data:err})
            }
        }catch{
            res.status(500).json({status:"fail", msg:"서버 오류 발생"})
        }
    })
})



module.exports = router