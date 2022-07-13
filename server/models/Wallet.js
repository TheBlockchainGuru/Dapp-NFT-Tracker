const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let walletSchema = new Schema({
title:{
    type: String,
    required: true
},
address: {
    type: String,
    required: true
},
userId: {
    type: String,
    required: true
}
},{
    timestamps: true,
    collection: 'wallets'
})
module.exports = mongoose.model('Wallet', walletSchema);