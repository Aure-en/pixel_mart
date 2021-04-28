const mongoose = require('mongoose');

const { Schema } = mongoose;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: {
    name: String,
    data: Buffer,
    contentType: String,
  },
});

ItemSchema.virtual('url').get(function () {
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);
