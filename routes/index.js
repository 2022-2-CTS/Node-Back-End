var express = require('express');
var router = express.Router();
var cors = require('cors');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(bodyParser.json());

app.post('/api', (req, res) => {
  const code = req.body.code;
  console.log(code);
  res.send("확인!!")
})

server.listen(8080, () => {
  console.log('server is running on 8080')
});

/* GET home page. */
// router.get('/test', function(req, res, next) {
//   // res.render('index', { title: 'Express' });
//   res.send({ success: true} );
// });

// module.exports = router;