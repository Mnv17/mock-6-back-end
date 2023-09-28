const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const jsonServer = require('json-server');

const app = express();
const PORT = process.env.PORT || 8080;
const DB_URI = 'mongodb+srv://maanav:verma@cluster0.9ndexyx.mongodb.net/blogs?retryWrites=true&w=majority';

app.get("/",(req,res)=>{
    res.send("welcome to the app")
})

app.use(express.json());
app.use(cors());

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Use json-server to serve the db.json file under '/api' prefix
const jsonServerRouter = jsonServer.router('db.json');
app.use('/api', jsonServerRouter);

app.use('/api/auth', authRoutes);
app.use('/api', blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
