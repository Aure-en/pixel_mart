const Category = require('../models/category');

// Display all category
exports.category_list = function (req, res) {
  res.send('All categories');
};

/* Display category details for a single category:
- Name, description
- Item list */
exports.category_detail = function (req, res) {
  res.send(`Category details${req.params.id}`);
};

// Display Category Create Form on GET
exports.category_create_get = function (req, res) {
  res.send('Category create GET');
};

// Display Category Create Form on POST
exports.category_create_post = function (req, res) {
  res.send('Category create POST');
};

// Display Category Update Form on GET
exports.category_update_get = function (req, res) {
  res.send('Category update GET');
};

// Display Category Update Form on POST
exports.category_update_post = function (req, res) {
  res.send('Category update POST');
};

// Display Category Delete Form on GET
exports.category_delete_get = function (req, res) {
  res.send('Category Delete GET');
};

// Display Category Delete Form on POST
exports.category_delete_post = function (req, res) {
  res.send('Category Delete POST');
};
