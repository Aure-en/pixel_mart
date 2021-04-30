const async = require('async');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Item = require('../models/item');
const Category = require('../models/category');

// Display all items
exports.item_list = function (req, res, next) {
  Item.find().exec((err, items) => {
    if (err) return next(err);
    res.render('item/item_list', {
      title: 'Item List',
      items,
      categories: res.locals.categories,
    });
  });
};

// Display a specific item's details
exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id).populate('category').exec((err, item) => {
    if (err) return next(err);
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }

    console.log(item);

    res.render('item/item_detail', {
      title: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      quantity: item.quantity,
      url: item.url,
      image: item.image,
      categories: res.locals.categories,
    });
  });
};

// Display item create form on GET
exports.item_create_get = function (req, res, next) {
  Category.find().exec((err, result) => {
    if (err) return next(err);
    res.render('item/item_form', {
      title: 'Create Item',
      category_list: result,
      categories: res.locals.categories,
    });
  });
};

// Display item create form on POST
exports.item_create_post = [
  // Validate and sanitize values
  body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified.').trim().isLength({ min: 1 }).escape(),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Price must be specified.')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be above 0.'),
  body('quantity')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Quantity must be specified.')
    .isInt({ min: 0 })
    .withMessage('Quantity cannot be below 0.'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form with values / errors.
      Category.find().exec((err, result) => {
        if (err) return next(err);
        res.render('item/item_form', {
          title: 'Create Item',
          category_list: result,
          item: req.body,
          errors: errors.array(),
          categories: res.locals.categories,
        });
      });
      return;
    }

    // No errors, create the item and save it.
    const data = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
    };

    // Add image field if there is an image
    if (req.file) {
      data.image = {
        name: req.file.filename,
        data: fs.readFileSync(path.join(__dirname, `../images/${req.file.filename}`)),
        contentType: req.file.mimetype,
      };
      // Delete the image from the disk after using it
      fs.unlink(path.join(__dirname, `../images/${req.file.filename}`), (err) => {
        if (err) throw err;
      });
    }

    const item = new Item(data);

    item.save((err) => {
      if (err) return next(err);
      res.redirect(item.url);
    });
  },
];

// Display item update form on GET
exports.item_update_get = function (req, res, next) {
  async.parallel({
    item(callback) {
      Item.findById(req.params.id).exec(callback);
    },
    categories(callback) {
      Category.find().exec(callback);
    },
  }, (err, results) => {
    if (err) return next(err);
    if (!results.item) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.render('item/item_form', {
      title: 'Update Item',
      category_list: results.categories,
      item: results.item,
      categories: res.locals.categories,
    });
  });
};

// Display item update form on POST
exports.item_update_post = [
  // Validate and sanitize values
  body('name', 'Name must be specified.').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be specified.').trim().isLength({ min: 1 }).escape(),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Price must be specified.')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be above 0.'),
  body('quantity')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Quantity must be specified.')
    .isInt({ min: 0 })
    .withMessage('Quantity cannot be below 0.'),

  (req, res, next) => {
    const errors = validationResult(req);

    const data = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
      _id: req.params.id,
    };

    // Add image field if there is an image
    if (req.file) {
      data.image = {
        name: req.file.filename,
        data: fs.readFileSync(path.join(__dirname, `../images/${req.file.filename}`)),
        contentType: req.file.mimetype,
      };
      // Delete the image from the disk after using it
      fs.unlink(path.join(__dirname, `../images/${req.file.filename}`), (err) => {
        if (err) throw err;
      });
    }

    const item = new Item(data);

    if (!errors.isEmpty()) {
      // There are errors. Render the form with values / errors.
      Category.find().exec((err, result) => {
        if (err) return next(err);
        res.render('item/item_form', {
          title: 'Update Item',
          category_list: result,
          item,
          errors: errors.array(),
          categories: res.locals.categories,
        });
      });
      return;
    }

    Item.findByIdAndUpdate(req.params.id, item, {}, (err) => {
      if (err) return next(err);
      res.redirect(item.url);
    });
  },
];

// Display item delete form on GET
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) return next(err);
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.render('item/item_delete', {
      title: 'Delete Item',
      name: item.name,
      categories: res.locals.categories,
    });
  });
};

// Display item delete form on POST
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) return next(err);
    res.redirect('/catalog/items');
  });
};
