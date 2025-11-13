const mongoose = require('mongoose');
const { mongoURI } = require('./env.config');

const mongooseConnection = mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongooseConnection;