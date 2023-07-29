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

const secretKey = 'culture';


//구글 로그인 구현부
router.post('/googleLogin_', (req, res) => {
    const credential = req.body.credentialCode
    const clientId = req.body.clientIdCode

    console.log(credential)
    console.log(clientId)
    
    const decodedToken = jwt.decode(credential, {complete : true});

    console.log(decodedToken);

    if (decodedToken.payload.aud !== clientId){
        console.log('Invalid client ID.');
        res.send("로그인 실패..")
        return;
    }else{
        res.send("로그인 성공!!")
    }
      
})

module.exports = router;