const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const braintreeRoutes = require('./routes/braintree');


const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8000;

//App
const app = express();
dotenv.config();

//database
mongoose.connect(process.env.DATABASE, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false});
mongoose.connection.on('error', () => {
    console.err.bind(console, 'Database Connection Error! Oops i can\'t reach the database');
});
mongoose.connection.once('open', () => {
    console.log('Connected to Database Successfully');
});

//app middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());



//use Routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);

// Start Server on specified port
app.listen(PORT, (err) => {
    if(err){
        throw new Error('Invalid Connection');
    }
    else{
        console.log(`Server Started .... and is listening on http://localhost:${PORT}`);
    }
});
