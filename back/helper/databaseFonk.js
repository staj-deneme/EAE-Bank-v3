const Members = require("../models/Members");
const UserLogs = require("../models/UserLogs");
const storage = require('node-persist');
var mysql = require('mysql');

if (process.env.SELECTED_DATABASE == "mysql") {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'eae'
    });
    connection.connect(function (err) {
        if (err) {
            console.error('Veri tabanına bağlanırken hata : ' + err.stack);
            return;
        } else {
            console.log("Mysql Bağlantı Tamam");
        }
    });
}


module.exports = {
    kayitOlustur: {
        mongoDB: function (data) {
            return new Promise((resolve, reject) => {
                data = new Members(data);
                data.save((err, data) => {
                    if (err) { reject("mukerrer"); }
                    else { resolve(data); }
                });

            });
        },
        json: function (data) {
            return new Promise((resolve, reject) => {

                storage.initSync();
                var accounts = storage.getItemSync("Members");
                var mukerrer = false;

                if (accounts == null) { accounts = []; }

                var member = {
                    name: data.name,
                    surName: data.surName,
                    age: data.age,
                    city: data.city,
                    gender: data.gender,
                    userName: data.userName,
                    password: data.password,
                    eMail: data.eMail,
                    resources: {
                        coin: 0,
                        milk: 0,
                        egg: 0,
                        honey: 0,
                        seed: 0,
                        cow: [],
                        chicken: [],
                        bee: []
                    }
                };
                accounts.forEach(account => {
                    if (data.userName == account.userName || data.eMail == account.eMail) {
                        mukerrer = true;
                    }
                });
                if (mukerrer == false) {
                    accounts.push(member);
                    storage.setItemSync("Members", accounts);
                    resolve(member);
                } else {
                    reject("mukerrer");
                }
            });
        },
        mysql: function (data) {
            return new Promise((resolve, reject) => {
                data.resources = JSON.stringify({
                    coin: 0,
                    milk: 0,
                    egg: 0,
                    honey: 0,
                    seed: 0,
                    cow: [],
                    chicken: [],
                    bee: []
                });
                connection.query('INSERT INTO members SET ?', data, (err, res) => {
                    if (err) reject("mukerrer");
                    else resolve(res.insertId);
                });
            });
        }
    },
    kayitGetir: {
        mongoDB: function (userData) {
            return new Promise((resolve, reject) => {
                Members.findOne(userData, (err, data) => {
                    if (err) reject(err);

                    if (data == null) {
                        reject("bulunamadı");
                    }
                    else {
                        if (data.userName == "tosuncuk") {
                            res.redirect("/tosuncuk");
                        } else {
                            resolve(data);
                        }
                    }
                });
            });
        },
        json: function (userData) {
            return new Promise((resolve, reject) => {
                storage.initSync();
                var accounts = storage.getItemSync("Members");
                var member = null;
                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i].userName == userData.userName && accounts[i].password == userData.password) {
                        member = accounts[i];
                        member._id = i;
                    }
                }
                if (member != null) {
                    resolve(member);
                } else {
                    reject("bulunamadı");
                }

            });
        },
        mysql: function (userData) {
            return new Promise((resolve, reject) => {
                var sqlQuery = 'SELECT * FROM members where userName = "' + userData.userName + '" and password="' + userData.password + '"';
                connection.query(sqlQuery, (err, rows) => {
                    if (err) throw err;

                    if (rows.length == 0) {
                        reject("bulunamadı");
                    } else {
                        rows[0].resources = JSON.parse(rows[0].resources);
                        resolve(rows[0]);
                    }
                });
            });
        }
    },
    findByIdAndUpdate: {
        mongoDB: function (userId, rData) {
            return new Promise((resolve, reject) => {

                Members.findByIdAndUpdate(
                    userId,
                    { "resources": rData },
                    (err, data) => {
                        if (err) reject(err);
                        else {
                            resolve(rData);
                        }
                    });

            });
        },
        json: function (userId, rData) {
            return new Promise((resolve, reject) => {
                storage.initSync();
                var accounts = storage.getItemSync("Members");

                accounts[userId].resources = rData;

                storage.setItemSync("Members", accounts);

                resolve(rData);
            });
        },
        mysql: function (userId, rData) {
            return new Promise((resolve, reject) => {
                var sqlQuery = 'UPDATE members SET resources=? where _id = ?';
                connection.query(sqlQuery, [JSON.stringify(rData), userId], (err, result) => {
                    if (err) throw err;
                    else {
                        resolve(rData);
                    }
                });
            });
        }
    },
    logOlustur: {
        mongoDB: function (data) {
            return new Promise((resolve, reject) => {
                data = new UserLogs(data);
                data.save((err, data) => {
                    if (err) { reject("mukerrer"); }
                    else { resolve(data); }
                });

            });
        },
        json: function (data) {
            return new Promise((resolve, reject) => {

                storage.initSync();
                var logs = storage.getItemSync("UserLogs");
                if (logs == null) { logs = []; }

                var log = data;

                logs.push(log);
                storage.setItemSync("UserLogs", logs);
                resolve(log);

            });
        },
        mysql: function (data) {
            return new Promise((resolve, reject) => {
                
                data.logs = JSON.stringify(data.logs);

                connection.query('INSERT INTO userlogs SET ?', data, (err, res) => {
                    if (err) reject(err);
                    else resolve(res.insertId);
                });
            });
        }
    }

};