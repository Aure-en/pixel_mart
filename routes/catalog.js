const express = require('express');

const router = express.Router();

const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

/// CATEGORY ROUTES

// Catalog home page (displays all the categories)
router.get('/', categoryController.category_list);

// GET request to create a category
router.get('/category/create', categoryController.category_create_get);

// POST request to create a category
router.post('/category/create', categoryController.category_create_post);

// GET request to update a category
router.get('/category/:id/update', categoryController.category_update_get);

// POST request to update a category
router.post('/category/:id/update', categoryController.category_update_post);

// GET request to delete a category
router.get('/category/:id/delete', categoryController.category_delete_get);

// POST request to delete a category
router.post('/category/:id/delete', categoryController.category_delete_post);

// GET request to see a category's details
router.get('/category/:id', categoryController.category_detail);

/// ITEM ROUTES

// GET request to create an item
router.get('/item/create', itemController.item_create_get);

// POST request to create an item
router.post('/item/create', itemController.item_create_post);

// GET request to update an item
router.get('/item/:id/update', itemController.item_update_get);

// POST request to update an item
router.post('/item/:id/update', itemController.item_update_post);

// GET request to delete an item
router.get('/item/:id/delete', itemController.item_delete_get);

// POST request to delete an item
router.get('/item/:id/delete', itemController.item_delete_post);

// GET request to see all items
router.get('/items', itemController.item_list);

// GET request to see an item's details
router.get('/item/:id', itemController.item_detail);

module.exports = router;
