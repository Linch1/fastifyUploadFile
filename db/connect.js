var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL,
{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
    console.log('connected')
});