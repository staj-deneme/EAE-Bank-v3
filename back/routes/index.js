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
                //hayvan sayısına göre bonus
                var oran=1.0;
                if(rData.cow.length>=10 && rData.cow.length<20){   oran=1.2;} 
                else if(rData.cow.length>=20 && rData.cow.length<30){   oran=1.5;}
                else if(rData.cow.length>=30){   oran=2.0;}
                //
                dif = fonk.diffMin(new Date(), new Date(rData.cow[j].cal));//son beslenmeden beri geçen zaman
                if(parseInt(dif/5)>=1 && rData.seed <= fonk.eatSeedBee(dif)){
                    rData.cow[j].death=fonk.upTime(rData.cow[j].death,parseInt(dif/5));//ömür kısaltma
                }
                difDeath = fonk.diffMin(new Date(), new Date(rData.cow[j].death));//yaşamış olduğu süre
                difTotal = fonk.deathCow() - fonk.diffMin(new Date(rData.cow[j].cal), new Date(rData.cow[j].death));

                if (difDeath >= fonk.deathCow()) {
                    if (rData.seed >= fonk.eatSeedCow(dif)) {
                        if (difTotal > 0) {
                            rData.milk = parseFloat(rData.milk) + parseFloat(fonk.cowMilk(difTotal,oran));
                            if (rData.seed >= fonk.eatSeedCow(difTotal)) {
                                rData.seed -= fonk.eatSeedCow(difTotal)
                            }
                        }
                    }
                } else {
                    if (rData.seed >= fonk.eatSeedCow(dif)) {
                            rData.milk = parseFloat(rData.milk) + parseFloat(fonk.cowMilk(dif,oran));
                            rData.cow[j].cal = new Date();
                            rData.seed -= fonk.eatSeedCow(dif);
                    }
                    olmeyecekler.cow.push(rData.cow[j]);
                }
            }
            rData.cow = olmeyecekler.cow;
        }

        if (rData.chicken != null) {
            olmeyecekler.chicken = [];
            for (var j = 0; j < rData.chicken.length; j++) {
                //hayvan sayısına göre bonus
                var oran=1.0;
                if(rData.chicken.length>=10 && rData.chicken.length<20){   oran=1.2;} 
                else if(rData.chicken.length>=20 && rData.chicken.length<30){   oran=1.5;}
                else if(rData.chicken.length>=30){   oran=2;}
                //

                dif = fonk.diffMin(new Date(), new Date(rData.chicken[j].cal));
                if(parseInt(dif/5)>=1 && rData.seed <= fonk.eatSeedBee(dif)){
                    rData.chicken[j].death=fonk.upTime(rData.chicken[j].death,parseInt(dif/5));//ömür kısaltma
                }
                difDeath = fonk.diffMin(new Date(), new Date(rData.chicken[j].death));
                difTotal = fonk.deathChicken() - fonk.diffMin(new Date(rData.chicken[j].cal), new Date(rData.chicken[j].death));

                if (difDeath >= fonk.deathChicken()) {
                    if (rData.seed >= fonk.eatSeedChicken(dif)) {
                        if (difTotal > 0) {
                            rData.egg = parseFloat(rData.egg) + parseFloat(fonk.chickenEgg(difTotal,oran));
                            if (rData.seed >= fonk.eatSeedChicken(difTotal)) {
                                rData.seed -= fonk.eatSeedChicken(difTotal)
                            }
                        }
                    }
                } else {
                    if (rData.seed >= fonk.eatSeedChicken(dif)) {
                            rData.egg = parseFloat(rData.egg) + parseFloat(fonk.chickenEgg(dif,oran));
                            rData.chicken[j].cal = new Date();
                            rData.seed -= fonk.eatSeedChicken(dif);
                    }
                    olmeyecekler.chicken.push(rData.chicken[j]);
                }
            }
            rData.chicken = olmeyecekler.chicken;
        }

        if (rData.bee != null) {

            olmeyecekler.bee = [];
            for (var j = 0; j < rData.bee.length; j++) {
                //hayvan sayısına göre bonus
                var oran=1.0;
                if(rData.bee.length>=10 && rData.bee.length<20){   oran=1.2;} 
                else if(rData.bee.length>=20 && rData.bee.length<30){   oran=1.5;}
                else if(rData.bee.length>=30){   oran=2;}
                //

                dif = fonk.diffMin(new Date(), new Date(rData.bee[j].cal));
                if(parseInt(dif/5)>=1 && rData.seed <= fonk.eatSeedBee(dif)){
                    rData.bee[j].death=fonk.upTime(rData.bee[j].death,parseInt(dif/5));//ömür kısaltma
                }
                difDeath = fonk.diffMin(new Date(), new Date(rData.bee[j].death));
                difTotal = fonk.deathBee() - fonk.diffMin(new Date(rData.bee[j].cal), new Date(rData.bee[j].death));

                if (difDeath >= fonk.deathBee()) {
                    if (rData.seed >= fonk.eatSeedBee(dif)) {
                        if (difTotal > 0) {
                            rData.honey = parseFloat(rData.honey) + parseFloat(fonk.beeHoney(difTotal,oran));
                            if (rData.seed >= fonk.eatSeedBee(difTotal)) {
                                rData.seed -= fonk.eatSeedBee(difTotal)
                            }
                        }
                    }
                } else {
                    if (rData.seed >= fonk.eatSeedBee(dif)) {
                            rData.honey = parseFloat(rData.honey) + parseFloat(fonk.beeHoney(dif,oran));
                            rData.bee[j].cal = new Date();
                            rData.seed -= fonk.eatSeedBee(dif);
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

    const { id, rData } = req.body.islemler;
    const log = req.body.loglar;

    dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](id, rData).then((resultData) => {

        dFonk.logOlustur[process.env.SELECTED_DATABASE](log).then((result) => {

            res.json({ status: 201, rData: rData });

        }).catch((reason) => {
            res.json({ status: 499 });
        });

    }).catch((reason) => {
        res.json({ status: 409 });
    });
});

router.post('/buyAnimalFeed', function (req, res, next) {

    let { id, islem, rData } = req.body.islemler;

    let log = req.body.loglar;

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

            dFonk.logOlustur[process.env.SELECTED_DATABASE](log).then((result) => {

                res.json({ status: 201, rData: rData });

            }).catch((reason) => {
                res.json({ status: 499 });
            });


        }).catch((reason) => {
            res.json({ status: 409 });
        });
    } else {
        res.json({ status: 101 }); // yeterli altını yok
    }
});

router.post('/sellProducts', function (req, res, next) {

    let { id, islem, rData } = req.body.islemler;
    let log = req.body.loglar;

    if (rData[islem] > 0) {
        rData.coin += fonk.sellMilk(rData[islem]);
        rData[islem] = 0;
    }

    dFonk.findByIdAndUpdate[process.env.SELECTED_DATABASE](id, rData).then((resultData) => {

        dFonk.logOlustur[process.env.SELECTED_DATABASE](log).then((result) => {

            res.json({ status: 201, rData: rData });

        }).catch((reason) => {
            res.json({ status: 409 });
        });

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
