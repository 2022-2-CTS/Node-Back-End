var express = require('express');
var router = express.Router();

// ADD: body paser
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());
const axios = require('axios');
const { response } = require('express');
const jwt = require('jsonwebtoken');
const maria = require('../database/connect/maria');

require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;

router.post("/status", (req, res) => {
    try{
        const userToken = req.body.userToken

        jwt.verify(userToken, secretKey, (err, decoded) => {
            try{
                if(!err){
                    // console.log("activate")
                    res.status(200).json({status:"success", msg:"valid"})
                }else{
                    res.status(200).json({status:"success", msg:"invalid"})
                }
            }catch{
                res.status(500).json({status:"fail", msg:"서버 오류 발생"})
            }
        })
    }catch{
        res.status(500).json({status:"error", msg:"서버 오류 발생"})
    }
})

module.exports = router