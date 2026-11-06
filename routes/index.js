var express = require('express');
var router = express.Router();
let { MongoClient, ObjectId } = require('mongodb-legacy');
let client = new MongoClient('mongodb://127.0.0.1:27017');
let csdl = client.db("quanlynhanvien");

router.get('*', function (req, res, next) {
  res.locals.userID = req.session.userID;
  next();
});

// Xem chi tiet nhan vien
router.get('/chitiet/:maso', function (req, res, next) {
  let maso = req.params.maso;

  csdl.collection("nhanvien")
    .findOne({ "_id": new ObjectId(maso) })
    .then(nv => {
      if (nv) {
        res.render('chitietnv.ejs', { nv });
      } else {
        res.redirect('/');
      }
    })
    .catch(loi => {
      res.end("Co loi: " + JSON.stringify(loi));
    });
});

//localhost:3000/xoa
router.get('/xoa/:maso', function (req, res, next) {
  csdl.collection("nhanvien")
    .deleteOne({ "_id": new ObjectId(req.params.maso) })
    .then(ketqua => {
      res.redirect('/');
    })
    .catch(loi => {
      res.end("Co loi: " + JSON.stringify(loi));
    });
});

//localhost:3000/tim
router.get('/tim', function (req, res, next) {
  res.render('timnv.ejs');
});

//localhost:3000/  -> xem danh sách + phân trang + tìm theo tên
router.get('/', function (req, res, next) {
  let ten = req.query.txtTen || '';
  let tuoiTu = req.query.tuoiTu || '';
  let tuoiDen = req.query.tuoiDen || '';
  let tranghientai = Number(req.query.page) || 1;
  let sonvmoitrang = 3;

  // Dieu kien tim theo ten
  let dieukien = { "ten": { $regex: ten, $options: "i" } };

  // Dieu kien loc theo tuoi
  let dieukienTuoi = {};
  if (tuoiTu !== '' && !isNaN(Number(tuoiTu))) {
    dieukienTuoi.$gte = Number(tuoiTu);
  }
  if (tuoiDen !== '' && !isNaN(Number(tuoiDen))) {
    dieukienTuoi.$lte = Number(tuoiDen);
  }
  if (Object.keys(dieukienTuoi).length > 0) {
    dieukien.tuoi = dieukienTuoi;
  }

  csdl.collection('nhanvien')
    .countDocuments(dieukien)
    .then(tongsonv => {
      const trangcuoicung = Math.ceil(tongsonv / sonvmoitrang);

      return csdl.collection('nhanvien').find(dieukien)
        .skip((tranghientai - 1) * sonvmoitrang)
        .limit(sonvmoitrang)
        .toArray()
        .then(dsnv => {
          res.render('xemdsnv.ejs', {
            dsnv,
            tranghientai,
            tongsonv,
            trangcuoicung,
            txtTen: ten,
            tuoiTu,
            tuoiDen
          });
        });
    })
    .catch(loi => {
      res.end("Co loi: " + JSON.stringify(loi));
    });
});

// Thong ke nhan vien
router.get('/thongke', function (req, res, next) {
  Promise.all([
    csdl.collection('nhanvien').countDocuments(),
    csdl.collection('nhanvien').countDocuments({ tuoi: { $lt: 18 } }),
    csdl.collection('nhanvien').countDocuments({ tuoi: { $gte: 18, $lte: 30 } }),
    csdl.collection('nhanvien').countDocuments({ tuoi: { $gte: 31, $lte: 50 } }),
    csdl.collection('nhanvien').countDocuments({ tuoi: { $gt: 50 } })
  ])
    .then(ketqua => {
      res.render('thongke.ejs', {
        tongsonv: ketqua[0],
        duoi18: ketqua[1],
        tu18den30: ketqua[2],
        tu31den50: ketqua[3],
        tren50: ketqua[4]
      });
    })
    .catch(loi => {
      res.end("Co loi: " + JSON.stringify(loi));
    });
});

router.get('/dangxuat', function (req, res, next) {
  req.session.userID = undefined;
  res.redirect('/');
});

module.exports = router;