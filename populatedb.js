#! /usr/bin/env node

console.log('This script populates some items and category to my database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const mongoose = require('mongoose');
const Item = require('./models/item');
const Category = require('./models/category');

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const items = [];
const categories = [];

function itemCreate(name, description, category, price, quantity, cb) {
  itemdetail = {
    name, description, category, price, quantity,
  };

  const item = new Item(itemdetail);

  item.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Item: ${item}`);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  categorydetail = { name, description };
  const category = new Category(categorydetail);

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Category: ${category}`);
    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.parallel([
    function (callback) {
      categoryCreate('Bakery', 'Freshly baked goods for your whole family to enjoy! Feel free to browse through our breads, cookies, cakes, pastries and delicious pies.', callback);
    },

    function (callback) {
      categoryCreate('Dairy', 'Come taste our delicious milk, produced by our own free-range cows. Or maybe will you let yourself be tempted by our yogurts and cheeses?', callback);
    },

    function (callback) {
      categoryCreate('Drinks', "Can you feel the summer heat? Keep yourself hydrated with our large variety of water, juices and delicious soft drinks. Don't worry, we won't tell your dentist.", callback);
    },

    function (callback) {
      categoryCreate('Household', 'Keep your household in order with our cleaners, which eliminate 100% of bacteria. Side effects might cause a desintegration of wooden surfaces, but it is a secret.', callback);
    },

    function (callback) {
      categoryCreate('Meat', 'Pork, beef, sausages, we have it all. Come fill your cart in our appetizing deli section!', callback);
    },

    function (callback) {
      categoryCreate('Other', 'If you could not find your happiness in our other aisles, come visit our last department to find random goodies to spice up your shopping trip!', callback);
    },

    function (callback) {
      categoryCreate('Personal Care', 'Keep your breath fresh and skin clear with our personal care products. Buy the whole set to receive 10 charisma points.', callback);
    },

    function (callback) {
      categoryCreate('Produce', 'Fresh vegetables and fruit, perfect for a healthy lifestyle.', callback);
    },

    function (callback) {
      categoryCreate('Seafood', 'Make your cat jealous by savoring our delicious fish right in front of them! We guarantee its freshness and high quality.', callback);
    },

    function (callback) {
      categoryCreate('Snacks', 'Who could resist eating our wonderful pack of chips during their afternoon break? With only 90% of air, they have the best value of all potato chips bags in the market. If you are in the mood for sweet snacks, we also offer ice cream or chocolate.', callback);
    },
  ], cb);
}

function createItems(cb) {
  async.parallel([

    // Category 0 - Bakery
    function(callback) {
      itemCreate('Bread', 'A simple, crusty baguette. A piece of French perfection everyone loves.', categories[0], 10, 25, callback);
    },

    function(callback) {
      itemCreate('Apple Pie', 'One of the most popular pies in the world, made with love by Granny every morning.', categories[0], 35, 10, callback);
    },

    function(callback) {
      itemCreate('Cookies', 'A famous, delicious snack. Might contain either decadant chocolate chips, or... raisins. Will you take a chance?', categories[0], 20, 25, callback);
    },

    function(callback) {
      itemCreate('Cheesecake', 'An irresistible dessert with a creamy filling and buttery biscuit base.', categories[0], 45, 5, callback);
    },

    function(callback) {
      itemCreate('Donut', 'Delicious and indulgent, taste our homemade glazed donuts. Available with different kind of fillings, ask the shopkeeper for more informations.', categories[0], 30, 40, callback);
    },

    function(callback) {
      itemCreate('Chocolate Cake', 'There is no need to introduce our signature chocolate cake. Decadant, it contains 5 layers of pure chocolate goodness, be it in a sponge cake or in a smooth ganache.', categories[0], 115, 15, callback);
    },

    // Category 1 - Dairy

    function(callback) {
      itemCreate('Milk', 'Fresh milk from our locally raised cow. All children love drinking this with some cereals in the morning.', categories[1], 25, 50, callback);
    },

    function(callback) {
      itemCreate('Yogurt', 'Plain but satisfying yogurt.', categories[1], 25, 50, callback);
    },

    function(callback) {
      itemCreate('Eggs', 'A staple ingredient any household must have. Laid by our free-range chickens every morning.', categories[1], 80, 15, callback);
    },

    function(callback) {
      itemCreate('Cheese', 'An excellent snack, that will go wonderfully well with our baguette and wine.', categories[1], 175, 10, callback);
    },

    // Category 2 - Drinks
    function(callback) {
      itemCreate('Water', 'A bottle of the simplest drink in the world.', categories[2], 5, 50, callback);
    },

    function(callback) {
      itemCreate('Soft Drink', 'A sweet drink that will keep you energized all day. Contains 90% sugar, and 10% mystery. What gives it its blue color? I am afraid I cannot reveal this company secret.', categories[2], 50, 50, callback);
    },

    function(callback) {
      itemCreate('Orange Juice', 'Freshly squeezed every morning by our farmers, made with 99% oranges and 1% sun.', categories[2], 75, 25, callback);
    },

    function(callback) {
      itemCreate('Grape Juice', 'A drink so sour a drop will be enough to wake you up.', categories[2], 95, 25, callback);
    },

    function(callback) {
      itemCreate('Red Wine', 'Strong wine. Will make your night pass by in a flash.', categories[2], 225, 25, callback);
    },

    function(callback) {
      itemCreate('White Wine', 'Weaker wine. Will still make your night pass by in a flash.', categories[2], 225, 25, callback);
    },

    // Category 3 - Household
    function(callback) {
      itemCreate('Detergent', 'Will destroy 100% of bacteria in your house. Has a 0.1% chance of also destroying your surface, but this is a detail.', categories[3], 80, 10, callback);
    },

    function(callback) {
      itemCreate('Dish Soap', 'A simple, but effective dish soap to keep your dishes clean.', categories[3], 50, 25, callback);
    },

    function(callback) {
      itemCreate('Sponge', 'Sometimes, you really need help scrubbing the grease out of your plates.', categories[3], 50, 50, callback);
    },

    function(callback) {
      itemCreate('Cleaning Gloves', 'A must-wear when doing housechores. Our products are so effective they might clean your skin away, after all...', categories[3], 120, 35, callback);
    },

    function(callback) {
      itemCreate('Cleaning Brush', 'A trusted tool to be able to reach any corner that needs to be cleaned.', categories[3], 135, 50, callback);
    },

    function(callback) {
      itemCreate('Light Bulb', 'Let there be light.', categories[3], 50, 50, callback);
    },

    function(callback) {
      itemCreate('Kitchen Knives', 'Our extra sharp knives will cut through... any type of meat. If anybody ask, they were made for cooking purposes, of course.', categories[3], 225, 10, callback);
    },

    // Category 4 - Meat
    function(callback) {
      itemCreate('Beef', "Just your regular piece of beef. Or is it beef? I don't remember so well", categories[4], 150, 10, callback);
    },

    function(callback) {
      itemCreate('Pork', 'A regular piece of pork. Delicious fried, baked, or barbecued.', categories[4], 135, 60, callback);
    },

    function(callback) {
      itemCreate('Bacon', 'Salt-cured belly pork. Its flavor is enhanced by 100% when accompanied by scrambled eggs.', categories[4], 135, 60, callback);
    },

    function(callback) {
      itemCreate('Roasted Chicken', 'Just buy it, we know you cannot resist its appetizing smell. Accompany it with potatoes for a delicious dinner.', categories[4], 220, 10, callback);
    },

    // Category 5 - Personal Care
    function(callback) {
      itemCreate('Soap', 'A common soap. To be used before attending any popular convention.', categories[5], 175, 60, callback);
    },

    function(callback) {
      itemCreate('Toothbrush', 'A cleaning brush, but tiny.', categories[5], 125, 25, callback);
    },

    function(callback) {
      itemCreate('Toothpaste', 'A legendary artifact that will stop people from running away from you anytime you open your mouth. Maybe.', categories[5], 150, 15, callback);
    },

    function(callback) {
      itemCreate('Toilet Paper', 'An item that need not be described.', categories[5], 80, 10, callback);
    },

    function(callback) {
      itemCreate('Shampoo', 'Our high-quality shampoo will make your hair silky smooth and instagramable.', categories[5], 80, 10, callback);
    },

    // Category 6 - Produce
    function(callback) {
      itemCreate('Bell Pepper', 'Tender, warm-season crop relative of the tomato. Available in yellow, green and red.', categories[6], 50, 10, callback);
    },

    function(callback) {
      itemCreate('Strawberry', 'Succulent and flavorful, this summer fruit is enjoyed by the whole family. Perfect with whipped cream.', categories[6], 60, 75, callback);
    },

    function(callback) {
      itemCreate('Apple', 'A common and nutritious round fruit. Available in many varieties.', categories[6], 20, 75, callback);
    },

    function(callback) {
      itemCreate('Watermelon', 'Watermelons are 92% water, making them a perfect sweet refresher for hot summer months. Although they might seem huge, we guarantee that they will vanish before you realize it.', categories[6], 210, 75, callback);
    },

    function(callback) {
      itemCreate('Potato', 'One of the most popular vegetables in the world, they can be cooked in many ways. Fried, baked, or mashed - any way of cooking them results in a delicious dish!', categories[6], 5, 95, callback);
    },

    // Category 7 - Seafood
    function(callback) {
      itemCreate('Salmon', 'Fresh and rich in protein, our salmon makes the perfect meal. It is easy to prepare and healthy: what is there not to love about it?', categories[7], 180, 75, callback);
    },

    function(callback) {
      itemCreate('Fish', 'If you do not know what fish to cook for dinner tonight, why not try buying our fish assortiment? It contains several types of fillet: salmon, tuna, sea bream, sea bass, and others...', categories[7], 575, 75, callback);
    },

    // Category 8 - Snacks
    function(callback) {
      itemCreate('Chips', 'Containing only 99% of air, our chips bag has the best value in the whole market.', categories[8], 25, 5, callback);
    },

    function(callback) {
      itemCreate('Milk Chocolate', "Thanks to its recipe made with creamy milky filling, our chocolate satifies children's desire for something tasty while reassuring mothers at the same time", categories[8], 40, 80, callback);
    },

    function(callback) {
      itemCreate('Ice Cream', 'Something we cannot live without during hot summer months. Many flavors are available.', categories[8], 575, 10, callback);
    },

    // Category 9 - Others
    function(callback) {
      itemCreate('Glue Stick', 'Use it on your significant other so that they can never leave you.', categories[9], 999, 50, callback);
    },

    function(callback) {
      itemCreate('Rubber Duck', 'A simple toy to keep you company in the bathtub', categories[9], 50, 50, callback);
    },

    function(callback) {
      itemCreate('Erase', 'Will erase all your mistakes if you scrub hard enough.', categories[9], 800, 10, callback);
    },

    function(callback) {
      itemCreate('Paper Bag', 'If none of our personal care products managed to raise your charisma stat, equiping the Paper Bag accessory might prevent children from running away from you screaming.', categories[9], 999, 1, callback);
    },
  ], cb);
}

async.series([
  createCategories,
  createItems,
],
// Optional callback
(err, results) => {
  if (err) {
    console.log(`FINAL ERR: ${err}`);
  } else {
    console.log(`Items: ${items}`);
  }
  // All done, disconnect from database
  mongoose.connection.close();
});
