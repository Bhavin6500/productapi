// const express = require('express')
// const app  = express()
// require('dotenv/config')
// const PORT = process.env.PORT || 8000
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose')
// const morgan = require('morgan')
// const productsData = require('./productsData');

// //middleware
// // if we send the data without using the body parser than it will not understand the json data 
// // it take the data and send 200 status code but it will not display data in postman for checking purpose
// app.use(bodyParser.json())


// mongoose.connect(process.env.MONGO_URL)
// .then(()=>{
//     console.log("Database connection successful")
// }).catch((err)=>{console.log(err)})

// //morgan is useful to check the type of request , status code and response time
// app.use(morgan('tiny'))

// // app.get('/products',(req,res)=>{
// //     const products = {
// //         id:1,
// //         name:'iphone'
// //     }
// //     res.send(products)
// // })





// // app.get('/products',(req,res)=>{
// //     const newProduct = req.body;
// //     res.send(newProduct)
// //     console.log(newProduct)

// // })







// productsData.forEach(productData => {
//   const newProduct = new Product(productData);
//   newProduct.save()
//     .then((result) => {
//       console.log('Product saved:', result);
//     })
//     .catch((err) => {
//       console.error('Error saving product:', err);
//     });
// });




// // Define route to insert product data
// //app.post('/products', async (req, res) => {
//     // try {
//     //     // Ensure that req.body is an array
//     //     if (!Array.isArray(req.body)) {
//     //         return res.status(400).send('Request body must be an array');
            
//     //     }
//     //     console.log('Received request body:', req.body);

//     //     // Insert all products into MongoDB
//     //     await insertData(req.body, collectionName);
        
//     //     res.status(201).send('Products inserted successfully');
//     // } catch (error) {
//     //     console.error('Error inserting products:', error);
//     //     res.status(500).send('Error inserting products');
//     // }
// //});


// //for sending single data it works for testing purpose
// app.post('/products',(req,res)=>{
//     const newProduct = req.body;
//     res.send(newProduct)
//     console.log(newProduct)

// })


// app.listen(PORT,(req,res)=>{console.log(`port is running on ${PORT}`)})




// const express = require('express');
// const app = express();
// require('dotenv/config');
// const PORT = process.env.PORT || 8000;
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const morgan = require('morgan');
// const Product = require('./Product'); // Import the Product model


// app.use(bodyParser.json());

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => {
//         console.log("Database connection successful");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// app.use(morgan('tiny'));

// // Route for adding a single product
// app.post('/products', async (req, res) => {
//     try {
//         // Extract product data from request body
//         const productData = req.body;

//         // Create a new instance of Product model
//         const newProduct = new Product(productData);

//         // Save the product to the database
//         const savedProduct = await newProduct.save();

//         res.status(201).json(savedProduct); // Respond with saved product
//     } catch (error) {
//         console.error('Error saving product:', error);
//         res.status(500).send('Error saving product');
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
// // 


// MONGO_URLS = mongodb+srv://Bhavin:WFr29i0MJAFoWBhB@cluster0.xrfhcgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
















const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(express.json());

// MongoDB connection string
const MONGO_URL = process.env.MONGO_URL;

let db; // Database connection object

// Function to connect to MongoDB
async function connectToDatabase() {
    const client = new MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db();
}

// Connect to MongoDB when the application starts
connectToDatabase().then(() => {
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit the application if unable to connect to the database
});

// Endpoint to get all products
app.get('/api/products', async (req, res) => {
    try {
        // Fetch all products from the collection
        const products = await db.collection('products').find({}).toArray();

        // Send the products as JSON response
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to add a new product
app.post('/api/products', async (req, res) => {
    try {
        const productData = req.body;

        // Insert the new product into the collection
        const result = await db.collection('products').insertOne(productData);

        // Send the newly created product as JSON response
        res.json(result.ops[0]);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to update a product by ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProductData = req.body;

        // Update the product in the collection
        const result = await db.collection('products').updateOne({ _id: ObjectId(productId) }, { $set: updatedProductData });

        // Send success message as JSON response
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Delete the product from the collection
        const result = await db.collection('products').deleteOne({ _id: ObjectId(productId) });

        // Send success message as JSON response
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
