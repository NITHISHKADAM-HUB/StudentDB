const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    images: [{
        url: String,
        filename: String
    }],
    degree: String

});

module.exports = mongoose.model('Student', StudentSchema);