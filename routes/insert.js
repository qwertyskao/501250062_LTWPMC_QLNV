var express = require('express');
var ChenDuLieu = express.Router();

let { MongoClient} = require('mongodb-legacy');

let client = new MongoClient('mongodb://127.0.0.1:27017');
let csdl = client.db("quanlynhanvien");


ChenDuLieu
    .route('/')
    .get(function (req, res, next) {
        res.render('themnv.ejs');
    })
    .post(function (req, res, next) {
    let sampleFile, uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        csdl.collection("nhanvien")
        .insertOne({
            "ten": req.body.txtTen,
            "tuoi": Number(req.body.txtTuoi),

        })
        .then(ketqua => {
            res.redirect('/');
        })
        .catch(loi => {
            res.end("Co loi: " + JSON.stringify(loi));
        });
        return;
    }
  sampleFile = req.files.sampleFile;

  uploadPath = 'public/hinhnhanvien/' + sampleFile.name;
  sampleFile.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send(err);
    csdl.collection("nhanvien")
      .insertOne({
        "ten": req.body.txtTen,
        "tuoi": Number(req.body.txtTuoi),
        "hinh": sampleFile.name
      })
      .then(ketqua => {
        res.redirect('/');
      })
      .catch(loi => {
        res.end("Co loi: " + JSON.stringify(loi));
      });
  });

    });
 module.exports = ChenDuLieu;