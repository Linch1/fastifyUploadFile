var model = require('../models/ad');

async function find( filters ){
    return await model.find(filters);
}

module.exports = {
    find
};
