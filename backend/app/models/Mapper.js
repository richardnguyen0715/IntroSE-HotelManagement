const mongoose = require('mongoose');

const mapperSchema = new mongoose.Schema({
  vnkey: {
    type: String,
    required: true,
    unique: true
  },
  engkey: {
    type: String,
    required: true,
  }
});

const Mapper = mongoose.model('Mapper', mapperSchema);

module.exports = Mapper;
