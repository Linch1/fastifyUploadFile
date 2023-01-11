// Step 3 - this is the code for ./models.js
var mongoose = require('mongoose');
var adSchema = new mongoose.Schema({
    name: String,
    desc: String,
    img: {
        name: String,
        id: String
    },
});
 
//Image is a model which has a schema imageSchema
module.exports = new mongoose.model('Ad', adSchema);
