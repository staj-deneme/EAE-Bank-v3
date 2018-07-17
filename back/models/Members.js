const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembersSchema = new Schema({
    name: String,
    surName: String,
    age:Number,
    city:String,
    gender:String,
    userName: {
        type: String,
        unique: true
    },
    password: String,
    eMail: {
        type: String,
        unique: true
    },
    resources: {
        coin: {
            type: Number,
            default: 0
        },
        milk: {
            type: Number,
            default: 0
        },
        egg: {
            type: Number,
            default: 0
        },
        honey: {
            type: Number,
            default: 0
        },
        seed: {
            type: Number,
            default: 0
        },
        cow: [{
            cal: {
                type: Date,
                default: Date.now
            },
            death: {
                type: Date,
                default: Date.now
            }
        }],
        chicken: [{
            cal: {
                type: Date,
                default: Date.now
            },
            death: {
                type: Date,
                default: Date.now
            }
        }],
        bee: [{
            cal: {
                type: Date,
                default: Date.now
            },
            death: {
                type: Date,
                default: Date.now
            }
        }]
    }
});

module.exports = mongoose.model("member", MembersSchema);