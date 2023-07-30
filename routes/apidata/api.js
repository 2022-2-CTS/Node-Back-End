const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
var bodyParser = require('body-parser')
var router = express.Router();

app.use(bodyParser.json())

const fs = require('fs');

//부산 공공 데이터 포털
//연극
var Playdata = [];
var Concertdata = [];
var Musicaldata = [];
var Exhibitdata = [];
var axios = require('axios');
const key = 'g4PpueQjaKzayfFQRksvGpJ0jDZ%2BGGmRxzFDMU1o80hY8ObYPgFLuyZDB8iKnGoMh5PSeVLp2tp1lToKexwCjQ%3D%3D'
var listP;
var listC;
var listM;
var listE;


//연극 데이터
//total받기
async function getPlay() {
  console.log("gettotal play")
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCulturePlayDetailService/getBusanCulturePlayDetail?serviceKey=' + key + '&resultType=json',
    headers: {},
  };
  axios(config)
    .then(await function (response) {
      listP = response.data.getBusanCulturePlayDetail.totalCount;
      //console.log(listP);
    }).then(await function () {
      getplaydata()
    })
}

async function getplaydata() {
  await console.log("연극 개수 : " + listP);
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCulturePlayDetailService/getBusanCulturePlayDetail?serviceKey=' +key+'&resultType=json' + '&numOfRows=' + listP,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      "Accept-Encoding": "deflate, br"
    },
  };
  axios(config)
    .then(await function (response) {
      var xmlToJson = response.data.getBusanCulturePlayDetail;
      for (var i = 0; i < listP; i++) {
        //console.log("size: " + Playdata.length)
        const tmpData = {
          category: '연극',
          url: xmlToJson.item[i].dabom_url,
          data: {
            title: xmlToJson.item[i].title,
            op_ed_dt: xmlToJson.item[i].op_ed_dt,
            op_st_dt: xmlToJson.item[i].op_st_dt,
            showtime: xmlToJson.item[i].showtime,
            price: xmlToJson.item[i].price
          }
        }
        Playdata.push(tmpData);
      }
    })

}

async function getConcert() {
  console.log("gettotal concert")
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCultureConcertDetailService/getBusanCultureConcertDetail?serviceKey=' + key + '&resultType=json',
    headers: {}
  };
  axios(config)
    .then(await function (response) {
      listC = Number(response.data.getBusanCultureConcertDetail.totalCount);
    }).then(await function () {
      getConcertdata()
    })
}
async function getConcertdata() {
  await console.log("콘서트 개수 : " + listC);
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCultureConcertDetailService/getBusanCultureConcertDetail?serviceKey=' + key + '&numOfRows=' + listC + '&resultType=json',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      "Accept-Encoding": "deflate, br"
    },
  };
  axios(config)
    .then(await function (response) {
      var xmlToJson = response.data.getBusanCultureConcertDetail;
      //console.log(xmlToJson.item)
      for (var i = 0; i < listC; i++) {
        const tmpData = {
          category: '콘서트',
          url: xmlToJson.item[i].dabom_url,
          data: {
            title: xmlToJson.item[i].title,
            op_ed_dt: xmlToJson.item[i].op_ed_dt,
            op_st_dt: xmlToJson.item[i].op_st_dt,
            showtime: xmlToJson.item[i].showtime,
            price: xmlToJson.item[i].price
          }
        }
        Concertdata.push(tmpData);
      }
    })
}

async function getMusical() {
  console.log("gettotal musical")
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=' + key + '&resultType=json',
    headers: {}
  };
  axios(config)
    .then(await function (response) {
      // var xmlToJson = convert.xml2json(response.data, { compact: true, spaces: 4 });
      // xmlToJson = JSON.parse(xmlToJson)
      listM = Number(response.data.getBusanCultureMusicalDetail.totalCount);
    }).then(await function () {
      getMusicaldata()
    })
}
async function getMusicaldata() {
  await console.log("뮤지컬 개수 : " + listM);
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=' + key + '&numOfRows=' + listM + '&resultType=json',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      "Accept-Encoding": "deflate, br"
    },
  };
  axios(config)
    .then(await function (response) {
      var xmlToJson = response.data.getBusanCultureMusicalDetail;
      //console.log(xmlToJson.item)
      for (var i = 0; i < listM; i++) {
        const tmpData = {
          category: '뮤지컬',
          url: xmlToJson.item[i].dabom_url,
          data: {
            title: xmlToJson.item[i].title,
            op_ed_dt: xmlToJson.item[i].op_ed_dt,
            op_st_dt: xmlToJson.item[i].op_st_dt,
            showtime: xmlToJson.item[i].showtime,
            price: xmlToJson.item[i].price
          }
        }
        Musicaldata.push(tmpData);
      }
    })
}

async function getExhibit() {
  console.log("gettotal exhibit")
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCultureExhibitDetailService/getBusanCultureExhibitDetail?serviceKey=' + key + '&resultType=json',
    headers: {},
  };
  axios(config)
    .then(await function (response) {
      // var xmlToJson = convert.xml2json(response.data, { compact: true, spaces: 4 });
      // xmlToJson = JSON.parse(xmlToJson)
      listE = Number(response.data.getBusanCultureExhibitDetail.totalCount);
    }).then(await function () {
      getExhibitdata()
    })
}
async function getExhibitdata() {
  await console.log("전시 개수 : " + listE);
  var config = {
    method: 'get',
    url: 'http://apis.data.go.kr/6260000/BusanCultureExhibitDetailService/getBusanCultureExhibitDetail?serviceKey=' + key + '&numOfRows=' + listE + '&resultType=json',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      "Accept-Encoding": "deflate, br"
    },
  };
  axios(config)
    .then(await function (response) {
      //console.log(response)
      var xmlToJson = response.data.getBusanCultureExhibitDetail;
      // console.log(response);
      // console.log(xmlToJson.item)
      for (var i = 0; i < listE; i++) {
        const tmpData = {
          category: '전시',
          url: xmlToJson.item[i].dabom_url,
          data: {
            title: xmlToJson.item[i].title,
            op_ed_dt: xmlToJson.item[i].op_ed_dt,
            op_st_dt: xmlToJson.item[i].op_st_dt,
            showtime: xmlToJson.item[i].showtime,
            price: xmlToJson.item[i].price
          }
        }
        Exhibitdata.push(tmpData);
      }
    })
}

getExhibit();
getConcert();
getMusical();
getPlay();

module.exports = router;