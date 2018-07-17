var express = require('express');
var router = express.Router();
var dFonk = require("../helper/databaseFonk.js");
var fonk = require("../helper/uretimZaman");

function uretimKaynak(data, id) {
    return new Promise(function (resolve, reject) {
        var rData = data.resources;
        let dif, difDeath, difTotal;
        let olmeyecekler = {
            cow: rData.cow,
            chicken: rData.chicken,
            bee: rData.bee
        };

        if (rData.cow != null) {
            olmeyecekler.cow = [];
            for (var j = 0; j < rData.cow.length; j++) {

                dif = fonk.diffMin(new Date(), new Date(rData.cow[j].cal));
                difDeath = fonk.diffMin(new Date(), new Date(rData.cow[j].death));
                difTotal = fonk.deathCow() - fonk.diffMin(new Date(rData.cow[j].cal), new Date(rData.cow[j].death));

                if (difDeath >= fonk.deathCow()) {
                    if (rData.seed >= fonk.eatSeedCow(dif)) {
                        if (difTotal > 0) {
                            rData.milk = parseInt(rData.milk) + parseInt(fonk.cowMilk(difTotal));
                            if (rData.seed >= fonk.eatSeedCow(difTotal)) {
                                rData.seed -= fonk.eatSeedCow(difTotal)
                            }
                        }
                    }
                } else {
                    if (rData.seed >= fonk.eatSeedCow(dif)) {
                        if (dif >= 1) {
                            rData.milk = parseInt(rData.milk) + parseInt(fonk.cowMilk(dif));
                            rData.cow[j].cal = new Date();
                            rData.seed -= fonk.eatSeedCow(dif);
                        }
                    }
                    olmeyecekler.cow.push(rData.cow[j]);
                }
            }
            rData.cow = olmeyecekler.cow;
        }


        if (rData.chicken != null) {
            olmeyecekler.chicken = [];
            for (var j = 0; j < rData.chicken.length; j++) {

                dif = fonk.diffMin(new Date(), new Date(rData.chicken[j].cal));
                difDeath = fonk.diffMin(new Date(), new Date(rData.chicken[j].death));
                difTotal = fonk.deathChicken() - fonk.diffMin(new Date(rData.chicken[j].cal), new Date(rData.chicken[j].death));

                if (difDeath >= fonk.deathChicken()) {
                    if (rData.seed >= fonk.eatSeedChicken(dif)) {
                        if (difTotal > 0) {
                            rData.egg = parseInt(rData.egg) + parseInt(fonk.chickenEgg(difTotal));
                            if (rData.seed >= fonk.eatSeedChicken(difTotal)) {
                                rData.seed -= fonk.eatSeedChicken(difTotal)
                            }
                        }
                    }
                } else {
                    if (rData.seed >= fonk.eatSeedChicken(dif)) {
                        if (dif >= 1) {
                            rData.egg = parseInt(rData.egg) + parseInt(fonk.chickenEgg(dif));
                            rData.chicken[j].cal = new Date();
                            rData.seed -= fonk.eatSeedChicken(dif);
                        }
                    }
                    olmeyecekler.chicken.push(rData.chicken[j]);
                }
            }
            rData.chicken = olmeyecekler.chicken;
        }

        if (rData.bee != null) {

            olmeyecekler.bee = [];
            for (var j = 0; j < rData.bee.length; j++) {

                dif = fonk.diffMin(new Date(), new Date(rData.bee[j].cal));
                difDeath = fonk.diffMin(new Date(), new Date(rData.bee[j].death));
                difTotal = fonk.deathBee() - fonk.diffMin(new Date(rData.bee[j].cal), new Date(rData.bee[j].death));

                if (difDeath >= fonk.deathBee()) {
                    if (rData.seed >= fonk.eatSeedBee(dif)) {
                        if (difTotal > 0) {
                            rData.honey = parseInt(rData.honey) + parseInt(fonk.beeHoney(difTotal));
                            if (rData.seed >= fonk.eatSeedBee(difTotal)) {
                                rData.seed -= fonk.eatSeedBee(difTotal)
                            }
                        }
                    }
                } else {
                    if (rData.seed >= fonk.eatSeedBee(dif)) {
                        if (dif >= 1) {
                            rData.honey = parseInt(rData.honey) + parseInt(fonk.beeHoney(dif));
                            rData.bee[j].cal = new Date();
                            rData.seed -= fonk.eatSeedBee(dif);
                        }
                    }
                    olmeyecekler.bee.push(rData.bee[j]);
                }
            }
            rData.bee = olmeyecekler.bee;
        }

        dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](id, rData).then((resultData) => {
            resolve(resultData);
        }).catch((reason) => {
            reject(reason);
        });

    });
}

/* GET home page. */
router.get('/', function (req, res, next) {

    res.redirect("http://localhost:3000/");
    
});

router.post('/userCreate', function (req, res, next) {

    var member = req.body.member;

    dFonk.kayitOlustur[process.env.SELECTED_DATABASE](member).then((result) => {
        res.json({ status: 201, member: result });
        /* res.send(result); */
    }).catch((reason) => {
        if (reason == "mukerrer") {
            res.json({ status: 499 });
        }
    });
});

router.post('/userControl', function (req, res, next) {

    const { userName, password } = req.body;
    var userData = {
        userName: userName,
        password: password
    }

    dFonk.kayitGetir[process.env.SELECTED_DATABASE](userData).then((result) => {

        res.json({ status: 201, account: result });

    }).catch((reason) => {
        if (reason == "bulunamadı") {
            res.json({ status: 204 });
        } else {
            res.json({ status: 409 });
        }
    });
});

router.post('/requireAuthentication', function (req, res, next) {

    const { userName, password } = req.body;
    var userData = {
        userName: userName,
        password: password
    }

    dFonk.kayitGetir[process.env.SELECTED_DATABASE](userData).then((resultData) => {

        uretimKaynak(resultData, resultData._id).then(function (result) {
            resultData.resources = result;
            res.json({ status: 201, account: resultData });
        });

    }).catch((reason) => {
        if (reason == "bulunamadı") {
            res.json({ status: 204 });
        } else {
            res.json({ status: 409, reason: reason });
        }
    });
});

router.post('/userUpdate', function (req, res, next) {

    const { id, rData } = req.body;

    dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](id, rData).then((resultData) => {

        res.json({ status: 201, rData: rData });

    }).catch((reason) => {
        res.json({ status: 409 });
    });
});

router.post('/buyAnimalFeed', function (req, res, next) {

    let { id, islem, rData } = req.body;

    var minCoin = 0;

    var kayit = {
        cal: new Date(),
        death: new Date()
    };

    if (islem == "cow") {
        minCoin = 50;
        rData.cow.push(kayit);
    } else if (islem == "chicken") {
        minCoin = 20;
        rData.chicken.push(kayit);
    } else if (islem == "bee") {
        minCoin = 5;
        rData.bee.push(kayit);
    } else if (islem == "seed") {
        minCoin = 1;
        rData.seed = parseInt(rData.seed) + 100;
    }

    if (rData.coin >= minCoin) {

        rData.coin -= minCoin;

        dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](id, rData).then((resultData) => {

            res.json({ status: 201, rData: rData });

        }).catch((reason) => {
            res.json({ status: 409 });
        });
    } else {
        res.json({ status: 101 }); // yeterli altını yok
    }
});

router.post('/sellProducts', function (req, res, next) {

    let { id, islem, rData } = req.body;

    if (rData[islem] > 0) {
        rData.coin += fonk.sellMilk(rData[islem]);
        rData[islem] = 0;
    }

    dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](id, rData).then((resultData) => {

        res.json({ status: 201, rData: rData });

    }).catch((reason) => {
        res.json({ status: 409 });
    });
});

router.get('/test', function (req, res, next) {

    var userData = {
        userName: "eminzun",
        password: "05312456227"
    }

    dFonk.kayitGetir[process.env.SELECTED_DATABASE](userData).then((result) => {

        req.session.account = result;
        res.send(result);

    }).catch((reason) => {
        if (reason == "bulunamadı") {
            res.send(reason);
        } else {
            res.send(reason);
        }
    });
});
module.exports = router;
