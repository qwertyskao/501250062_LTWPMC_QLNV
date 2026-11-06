var express = require('express');
var GhiDanh = express.Router();

let { MongoClient} = require('mongodb-legacy');

let client = new MongoClient('mongodb://127.0.0.1:27017');
let csdl = client.db("quanlynhanvien");

let bcrypt = require('bcrypt');

GhiDanh
.route('/')
.get( function (req, res, next) {
  res.render('ghidanh.ejs')
})
.post(function (req, res, next) {
  bcrypt.hash(req.body.txtPassword, 10)
    .then(matkhaudamahoa => {
      csdl.collection('nguoidung')
        .insertOne({
          "username": req.body.txtUsername,
          "password": matkhaudamahoa
        })
        .then(ketqua => { res.redirect('/dangnhap') })
        .catch(loi => { res.end('loi roi: ' + JSON.stringify(loi)) })
    })
    .catch(loi => { res.end('loi roi: ' + JSON.stringify(loi)) })
});

module.exports = GhiDanh;