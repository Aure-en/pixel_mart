const async = require('async');
const { body, validationResult } = require('express-validator');
const Category = require('../models/category');
const Item = require('../models/item');

// Display all category
exports.category_list = function (req, res) {
  res.render('index', { categories: res.locals.categories });
};

/* Display category details for a single category:
- Name, description
- Item list */
exports.category_detail = function (req, res, next) {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    items(callback) {
      Item.find({ category: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);
    if (!results.category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category/category_detail', {
      title: results.category.name,
      description: results.category.description,
      url: results.category.url,
      items: results.items,
      categories: res.locals.categories,
    });
  });
};

// Display Category Create Form on GET
exports.category_create_get = function (req, res) {
  res.render('category/category_form', { title: 'Create Category', categories: res.locals.categories });
};

// Display Category Create Form on POST
exports.category_create_post = [
  // Validate and sanitize fields
  body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified.').trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    async.waterfall([
      // Check database to see if name is already taken
      function (callback) {
        Category.findOne({ name: req.body.name }).exec((err, result) => {
          if (result) {
            errors.errors.push({
              value: '',
              param: 'name',
              msg: 'Name already in use.',
              location: 'body',
            });
          }
          callback();
        });
      },

      // Check for errors
      function (callback) {
        if (!errors.isEmpty()) {
          // There are errors. Render form again with values and errors.
          res.render('category/category_form', {
            title: 'Create Category',
            category: req.body,
            errors: errors.array(),
            categories: res.locals.categories,
          });
          return;
        }

        // Data form is valid
        // Create a Category object with escaped and trimmed data
        const category = new Category({
          name: req.body.name,
          description: req.body.description,
        });
        // Save it in the database
        category.save((err) => {
          if (err) return next(err);
          // Redirect to the list of categories
          res.redirect('/');
        });
        callback();
      },
    ]);
  },
];

// Display Category Update Form on GET
exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) return next(err);
    if (!category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category/category_form', {
      title: 'Update Category',
      category,
      categories: res.locals.categories,
    });
  });
};

// Display Category Update Form on POST
exports.category_update_post = [
  // Validate and sanitize fields
  body('name', 'Name must be specified').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified.').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    async.waterfall([
      // Check database to see if name is already taken
      function (callback) {
        Category.findOne({ name: req.body.name }).exec((err, result) => {
          if (result) {
            errors.errors.push({
              value: '',
              param: 'name',
              msg: 'Name already in use.',
              location: 'body',
            });
          }
          callback();
        });
      },

      // Check for errors
      function (callback) {
        if (!errors.isEmpty()) {
          // There are errors. Render form again with values and errors.
          res.render('category/category_form', {
            title: 'Update Category',
            category: req.body,
            errors: errors.array(),
            categories: res.locals.categories,
          });
          return;
        }

        const category = new Category({
          name: req.body.name,
          description: req.body.description,
          _id: req.params.id,
        });

        // Data form is valid
        // Update the category
        Category.findByIdAndUpdate(req.params.id, category, {}, (err) => {
          if (err) return next(err);
          res.redirect('/catalog');
        });
      },
    ]);
  }];

// Display Category Delete Form on GET
exports.category_delete_get = function (req, res, next) {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    items(callback) {
      Item.find({ category: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);
    if (!results.category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    res.render('category/category_delete', {
      title: 'Delete Category',
      category: results.category,
      items: results.items,
      categories: res.locals.categories,
    });
  });
};

// Display Category Delete Form on POST
exports.category_delete_post = function (req, res, next) {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    items(callback) {
      Item.find({ category: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);
    if (!results.category) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }

    // Delete category and associated items
    async.parallel([
      function (callback) {
        Category.findByIdAndRemove(req.params.id).exec(callback);
      },
      function (callback) {
        Item.deleteMany({ category: req.params.id }).exec(callback);
      },
    ], (err) => {
      if (err) return next(err);
      // If successfully deleted, redirect to catalog.
      res.redirect('/catalog');
    });
  });
};
