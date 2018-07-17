var express = require('express');
var router = express.Router();

var apiLink = "http://localhost:3030";

var fonk = require("./uretimZaman");
var dFonk = require("./databaseFonk");
var request = require("request");

const Members = require("../models/Members");

var viewData = {
    err: null,
    success: null,
    kayitSuccess: null,
    loginSuccess: null,
    alSuccess: null
};

// Kullanıcı Session Kontrolünün Yapıldığı Ara Katman
var middleware = {
    requireAuthentication: function (req, res, next) {
        if (req.session.account) {
            var userName = req.session.account.userName;
            var password = req.session.account.password;

            request({
                url: apiLink + "/requireAuthentication",
                json: true,
                body: {
                    userName: userName,
                    password: password
                },
                method: "post"
            }, function (error, response, body) {
                if (error) {
                    res.json(error);
                } else {
                    if (body.status == "201") {
                        req.session.account = body.account;
                        res.locals.account = req.session.account;
                        next();
                    } else if (body.status == "204") {
                        req.session.destroy();
                        viewData.loginSuccess = false;
                        res.render("page-login", { viewData: viewData });
                    } else {
                        req.session.destroy();
                        res.send(body.reason);
                    }
                }
            });
        } else {
            res.redirect("/login");
        }
    }
}

// Ana Sayfa Yönlendirmesi
router.get('/', middleware.requireAuthentication, function (req, res, next) {
    res.render('index');
});

// Login İşleminin Yapıldığı Post İşlemi
router.post('/', function (req, res, next) {
    const { userName, password } = req.body;
    var userData = {
        userName: userName,
        password: password
    }
    request({
        url: apiLink + "/userControl",
        json: true,
        body: {
            userName: userName,
            password: password
        },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            if (body.status == "201") {
                req.session.account = body.account;
                res.redirect("/");
            } else if (body.status == "204") {
                viewData.loginSuccess = false;
                res.render("page-login", { viewData: viewData });
            } else {
                res.send("Sunucu Hatası");
            }
        }
    });
});

//Kullanıcı Kayıt İşleminin Yapıldığı Post İşlemi
router.post('/register', function (req, res, next) {

    const member = {
        name: req.body.ad,
        surName: req.body.soyad,
        userName: req.body.kadi,
        password: req.body.sifre,
        eMail: req.body.eposta
    };
    request({
        url: apiLink + "/userCreate",
        json: true,
        body: { member: member },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            if (body.status == "201") {
                viewData.kayitSuccess = true;
                res.render("page-login", { viewData: viewData });
            } else if (body.status == "499") {
                viewData.kayitSuccess = false;
                res.render("page-login", { viewData: viewData });
            }
        }
    });
});

// Login Sayfası Yönlendirme
router.get('/login', function (req, res, next) {
    var data = {
        hata: false,
        kayitSuccess: null
    };
    res.render('page-login', { viewData: data });
});

// Session öldürme işlemi ve oturumu sonlandırma
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('/login');
});

//Altın Satma ve Alma İşlemlerinin Yapıldığı Sayfaya Yönlendirme
router.get('/altin-islem', middleware.requireAuthentication, function (req, res, next) {
    viewData.alSuccess = null;
    viewData.success = null;
    res.render('sat-satinal', { viewData: viewData });
});

//Altın Satma ve Alma İşlemlerinin Yapıldığı Kısım
router.post('/altin-islem-al', middleware.requireAuthentication, function (req, res, next) {

    var altinMiktar = parseInt(req.session.account.resources.coin) + parseInt(req.body.miktar);
    var rData = req.session.account.resources;
    rData.coin = altinMiktar;

    request({
        url: apiLink + "/userUpdate",
        json: true,
        body: {
            id: req.session.account._id,
            rData: rData
        },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            if (body.status == "201") {

                req.session.account.resources = body.rData;
                res.send({ some: JSON.stringify(body.rData) });

            } else {
                res.send("409");
            }
        }
    });

});

router.post('/altin-islem-sat', function (req, res, next) {

    if (req.session.account.resources.coin >= req.body.miktar) {

        var altinMiktar = parseInt(req.session.account.resources.coin) - parseInt(req.body.miktar);

        var rData = req.session.account.resources;
        rData.coin = altinMiktar;

        request({
            url: apiLink + "/userUpdate",
            json: true,
            body: {
                id: req.session.account._id,
                rData: rData
            },
            method: "post"
        }, function (error, response, body) {
            if (error) {
                res.json(error);
            } else {
                if (body.status == "201") {

                    req.session.account.resources = body.rData;
                    res.send({ status: 201 });

                } else {
                    res.send({ status: 409 });
                }
            }
        });

    } else {
        res.send({ status: false });
    }
});

// Hayvan Ve Yem Alma Sayfasına Yönlendirme
router.get('/hayvan-yem-al', middleware.requireAuthentication, function (req, res, next) {
    viewData.success = null;
    res.render('hayvan-al', { viewData: viewData });
});

// Hayvan Ve Yem Aldırma İşlemleri
router.post('/hayvan-yem-al', middleware.requireAuthentication, function (req, res, next) {

    request({
        url: apiLink + "/buyAnimalFeed",
        json: true,
        body: {
            id: req.session.account._id,
            islem: req.body.islem,
            rData: req.session.account.resources
        },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            if (body.status == "201") {

                req.session.account.resources = body.rData;
                res.send({ status: 201 });

            }else {
                res.send({ status: body.status });
            }
        }
    });
});
// Hayvan Ve Yem Aldırma İşlemleri
router.get('/urun-sat', middleware.requireAuthentication, function (req, res, next) {
    viewData.success = null;
    res.render('urun-sat', { viewData: viewData });
});

router.post('/urun-sat', middleware.requireAuthentication, function (req, res, next) {

    request({
        url: apiLink + "/sellProducts",
        json: true,
        body: {
            id: req.session.account._id,
            islem: req.body.islem,
            rData: req.session.account.resources
        },
        method: "post"
    }, function (error, response, body) {
        if (error) {
            res.json(error);
        } else {
            if (body.status == "201") {

                req.session.account.resources = body.rData;
                res.send({ status: 201 });

            }else {
                res.send({ status: body.status });
            }
        }
    });


   /*  var islem = req.body.islem;
    var rData = req.session.account.resources;
 */
    /* if (islem == "milk") {
        if (rData.milk > 0) {
            rData.coin += fonk.sellMilk(rData.milk);
            rData.milk = 0;
        }
    } else if (islem == "egg") {
        if (rData.egg > 0) {
            rData.coin += fonk.sellEgg(rData.egg);
            rData.egg = 0;
        }
    } else if (islem == "honey") {
        if (rData.honey > 0) {
            rData.coin += fonk.sellHoney(rData.honey);
            rData.honey = 0;
        }
    }

    dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](req.session.account._id, rData).then((resultData) => {

        req.session.account.resources = rData;
        res.contentType('application/json; charset=utf-8');
        res.send({ status: true });

    }).catch((reason) => {
        res.send({ status: false });
    }); */

});

router.get('/tosuncuk', middleware.requireAuthentication, function (req, res, next) {
    viewData.success = null;
    if (req.session.account.userName == "tosuncuk") {

        Members.find({}, (err, data) => {
            var para = 0;
            data.forEach(member => {
                para += member.resources.coin;
            });
            viewData.para = para;
            res.render('tosuncuk', { viewData: viewData });
        });

    } else {
        res.redirect("/login");
    }
});

router.post('/tosuncuk', middleware.requireAuthentication, function (req, res, next) {
    viewData.success = null;
    if (req.session.account.userName == "tosuncuk") {

        Members.update(
            {},
            { "resources.coin": 0 },
            { multi: true },
            (err, data) => {
                if (err) res.json(err);
                else {
                    viewData.para = 0;
                    res.render('tosuncuk', { viewData: viewData });
                }
            });

    } else {
        res.redirect("/login");
    }
});


module.exports = router;
