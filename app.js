
const path = require('path');
const express = require('express');
const bodyPraser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shoproutes = require('./routes/shop');

const rootDir = require('./util/path');
const errorController = require('./controllers/error');

const mongoose = require('mongoose');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs'); //view engine setting
app.set('views', 'views');   //views folder location

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(bodyPraser.urlencoded({extended: false}));

//middleware
app.use((req, res, next) => {
    User.findById("6082916007bff97048e0e401")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

//admin ===> root path for all admin routes
app.use('/admin', adminRoutes);

app.use(shoproutes);

app.use(errorController.get404);


/*app.listen(3000, () => {
    console.log("Server is running on port 3000");
});*/


const mongoDBUrl = 'mongodb://localhost:27017/shop';
mongoose.connect(mongoDBUrl,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(result =>{
        User.findOne()
        .then(user =>{
            if(!user){
                const user = new User({
                    name: 'Venkatram',
                    email: 'venkat@venkat.com',
                    cart:{
                        items: []
                    }
                });
                user.save();
            }
        });
        
        const server = app.listen(3000, () => {
            const port = server.address().port;
            console.log("Server is running on port ", port);
            console.log("you can access the server at http://localhost:%s", port);
        });    
})
.catch(err => {
    console.log(err);
})