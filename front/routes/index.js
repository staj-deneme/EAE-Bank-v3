var express = require('express');
var request = require("request");
var router = express.Router();

var apiLink = process.env.API_LINK;
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
        age: req.body.yas,
        city: req.body.sehir,
        gender: req.body.cinsiyet,
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
        kayitSuccess: null,
        loginSuccess: null
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
            islemler: {
                id: req.session.account._id,
                rData: rData
            },
            loglar: {
                name: req.session.account.name,
                surName: req.session.account.surName,
                age: req.session.account.age,
                city: req.session.account.city,
                gender: req.session.account.gender,
                userName: req.session.account.userName,
                logs: {
                    logType: "buyCoin",
                    buyCoin: req.body.miktar,
                    sellCoin: 0,
                    buyAnimal: "none",
                    sellProducts: {
                        productType: "none",
                        amountProduct: 0
                    }
                }
            }
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
                islemler: {
                    id: req.session.account._id,
                    rData: rData
                },
                loglar: {
                    name: req.session.account.name,
                    surName: req.session.account.surName,
                    age: req.session.account.age,
                    city: req.session.account.city,
                    gender: req.session.account.gender,
                    userName: req.session.account.userName,
                    logs: {
                        logType: "sellCoin",
                        buyCoin: 0,
                        sellCoin: req.body.miktar,
                        buyAnimal: "none",
                        sellProducts: {
                            productType: "none",
                            amountProduct: 0
                        }
                    }
                }
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
            islemler: {
                id: req.session.account._id,
                islem: req.body.islem,
                rData: req.session.account.resources
            },
            loglar: {
                name: req.session.account.name,
                surName: req.session.account.surName,
                age: req.session.account.age,
                city: req.session.account.city,
                gender: req.session.account.gender,
                userName: req.session.account.userName,
                logs: {
                    logType: "buyAnimal",
                    buyCoin: 0,
                    sellCoin: 0,
                    buyAnimal: req.body.islem,
                    sellProducts: {
                        productType: "none",
                        amountProduct: 0
                    }
                }
            }
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
            islemler: {
                id: req.session.account._id,
                islem: req.body.islem,
                rData: req.session.account.resources
            },
            loglar:{
                name: req.session.account.name,
                surName: req.session.account.surName,
                age: req.session.account.age,
                city: req.session.account.city,
                gender: req.session.account.gender,
                userName: req.session.account.userName,
                logs: {
                    logType: "sellProducts",
                    buyCoin: 0,
                    sellCoin: 0,
                    buyAnimal: 0,
                    sellProducts: {
                        productType: req.body.islem,
                        amountProduct: req.session.account.resources[req.body.islem]
                    }
                }
            }
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
                res.send({ status: body.status });
            }
        }
    });
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
