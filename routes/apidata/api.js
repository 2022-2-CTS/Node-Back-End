const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();

app.use(bodyParser.json())

const conn = require('../../database/connect/maria');

const val =['concert','musical','play','exhibit']

var sql = 'INSERT INTO apiData (category, url, title,st_dt,ed_dt,showtime,price,poster,location) values (?,?,?,?,?,?,?,?,?)';

for(let j=0;j<val.length;j++){
  var tmpData = require('../event/json/'+val[j]+'_json.json');
  for (let i = 0; i < tmpData.length; i++) {
    var Par = [
      tmpData[i].category, 
      tmpData[i].url, 
      tmpData[i].data.title, 
      tmpData[i].data.op_st_dt, 
      tmpData[i].data.op_ed_dt, 
      tmpData[i].data.showtime, 
      tmpData[i].data.price, 
      tmpData[i].data.imgSrc, 
      tmpData[i].data.location]
    conn.query(sql, Par, function (err, rows, fields) {
      if (err) {
        console.log(err)
      }
    })
  }
}

module.exports = router;