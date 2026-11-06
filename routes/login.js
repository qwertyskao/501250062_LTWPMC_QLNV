var express = require('express');
var DangNhap = express.Router();
let { MongoClient } = require('mongodb-legacy');
let client = new MongoClient('mongodb://127.0.0.1:27017');
let csdl = client.db("quanlynhanvien");
let bcrypt = require('bcrypt');

// hiện form (GET), file views/dangnhap.ejs
DangNhap
    .route('/')
    .get(function (req, res, next) {
        res.render('dangnhap.ejs');
    })
    .post(function (req, res, next) {
        csdl.collection('nguoidung')
            .findOne({ "username": req.body.txtUsername })
            .then(nguoidung => {
                bcrypt.compare(req.body.txtPassword, nguoidung.password)
                    .then(ok => {
                        if (ok) {
                            req.session.userID = nguoidung._id;
                            res.redirect('/');
                        }
                        else
                            res.redirect('/dangnhap');
                    })
                    .catch(loi => { res.end('loi roi: ' + loi.message) });
            })
            .catch(loi => { res.end('loi roi: ' + loi.message) });
    });

module.exports = DangNhap;