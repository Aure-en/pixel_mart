const Item = require('../models/item');

// Display all items
exports.item_list = function(req, res) {
  res.send('All items');
};

// Display a specific item's details
exports.item_detail = function(req, res) {
  res.send('Item detail');
};

// Display item create form on GET
exports.item_create_get = function(req, res) {
  res.send('Item create GET');
};

// Display item create form on POST
exports.item_create_post = function(req, res) {
  res.send('Item create POST');
};

// Display item update form on GET
exports.item_update_get = function(req, res) {
  res.send('Item update GET');
};

// Display item update form on POST
exports.item_update_post = function(req, res) {
  res.send('Item update POST');
};

// Display item delete form on GET
exports.item_delete_get = function(req, res) {
  res.send('Item delete GET');
};

// Display item delete form on POST
exports.item_delete_post = function(req, res) {
  res.send('Item delete POST');
};
