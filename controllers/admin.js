
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => { 
    res.render('admin/edit-product', //view location for rendering page
        {pageTitle: 'Add Product', 
            path: '/admin/add-product', //for adding prod and edit prod
            editing: false
    });
}


exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title:title, 
        price:price, 
        description:description, 
        imageUrl:imageUrl,
        userId: req.user//will come as request object
    });
    product
        .save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
    console.log(product);
    //res.redirect('/');
}

exports.getEditProduct = (req, res, next) => { 
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if(!product){
                return res.redirect('/');
            }
            res.render('admin/edit-product', //view location for rendering page
                {pageTitle: 'Edit Product', 
                    path: '/admin/eidt-product',
                    editing: editMode,   //for edit mode page will be opened in edit mode
                    product: product
                });
    });
    
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            return product.save();
        }).then(result => {
            console.log(result);
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
}


exports.getProducts = (req, res, next) => {
    Product.find()
        //.select('title price -_id')
        //.populate('userId')
        .then(products => {
        console.log("Products: ");
        console.log(products);
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }) ;   
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log("Product is deleted...");
            res.redirect('/admin/products');
        });
}