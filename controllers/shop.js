
const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
    
    Product.find()
        .then(products => {
        console.log(products);
        res.render('shop/product-list', //view location
        {prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    });    
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log("param id: ", prodId);
    Product.findById(prodId)
        .then(product => {
        //console.log("Product for above id:\n ", product);
        res.render('shop/product-details', 
            {pageTitle: product.title, path:'/products', product: product});
    });
}


exports.getIndex = (req, res, next) => {
    
    Product.find()
        .then(products => {
        console.log(products);
        res.render('shop/index', //view location
        {prods: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    });    
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log("PRODUCTS: ", user.cart.items);
            const products = [];
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: user.cart.items
            })
               
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }); 
    
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        }).then(result => {
            console.log(result);
            res.redirect('/cart');
        });
    
}

exports.getCheckout = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {            
            const products = user.cart.items;
            let total = 0;
            products.forEach(p => {
                total += p.quantity * p.productId.price;
            })
            res.render('shop/checkout', {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                totalSum: total
            })
               
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        }); 
}

exports.postOrder = (req, res, next) =>{
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i =>{
                return {
                    quantity: i.quantity,
                    product: {...i.productId._doc}
                }
            });
            const order = new Order({
                user:{
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() =>{
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
        .then(orders =>{
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.log(err));
    
}

