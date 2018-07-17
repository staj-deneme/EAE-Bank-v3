const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogsSchema = new Schema({
    name: String,
    surName: String,
    age: Number,
    city: String,
    gender: String,
    userName: String,
    logs: {
        logType: String ,
        logTime: {
            type: Date,
            default: Date.now
        },
        buyCoin: {
            type: Number,
            default: 0
        },
        sellCoin: {
            type: Number,
            default: 0
        },
        buyAnimal: {
            type: String,
            default: "none"
        },
        sellProducts: {
            productType: {
                type: String,
                default: "none"
            },
            amountProduct: {
                type: Number,
                default: 0
            }
        }
    }
});

module.exports = mongoose.model("userlogs", LogsSchema);