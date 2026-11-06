var express = require('express');
var SuaDuLieu = express.Router();

let { MongoClient, ObjectId } = require('mongodb-legacy');

let client = new MongoClient('mongodb://127.0.0.1:27017');
let csdl = client.db("quanlynhanvien");

//localhost:3000/sua/:maso

SuaDuLieu
    .get('/:maso', function (req, res, next) {
        csdl.collection("nhanvien")
            .findOne({ "_id": new ObjectId(req.params.maso) })
            .then(nv => {
                res.render('suanv.ejs', { nv });
            })
            .catch(loi => {
                res.end("Co loi: " + JSON.stringify(loi));
            });
    });
SuaDuLieu.route('/').post(function (req, res, next) {
    let sampleFile, uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        csdl.collection('nhanvien')
            .updateOne({ "_id": ObjectId.createFromHexString(req.body.txtId) },
                { $set: { "ten": req.body.txtTen, "tuoi": Number(req.body.txtTuoi) } }
            ).then(ketqua => { res.redirect('/') })
            .catch(toiloi => { res.end('loi roi : ' + JSON.stringify(toiloi)) })
        return
    }
    sampleFile = req.files.sampleFile;
    uploadPath = 'public/hinhnhanvien/' + sampleFile.name;
    sampleFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        csdl.collection('nhanvien')
            .updateOne({ "_id": ObjectId.createFromHexString(req.body.txtId) },
                {
                    $set: {
                        "ten": req.body.txtTen, "tuoi": Number(req.body.txtTuoi),
                        "hinh": sampleFile.name
                    }
                })
            .then(ketqua => { res.redirect('/') })
            .catch(toiloi => { res.end('loi roi : ' + JSON.stringify(toiloi)) })
    });
});

module.exports = SuaDuLieu;