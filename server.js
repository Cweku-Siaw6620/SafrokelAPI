const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.env.PORT || 3000;

//importing the models
const User = require('./models/userModel');

const app = express();

//middleware
app.use(cors())
app.use(express.json());

//saving users accounts

app.post("/users", async (req, res) => {
  try {
    const { fullName, phoneNumber, password } = req.body;

    // check required fields
    if (!fullName || !phoneNumber || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "User with this phone number already exists" });
    }

    // create new user
    const user = new User({
      fullName,
      phoneNumber,
      password,
    });

    const result = await user.save();
    res.status(201).json({ message: "User registered successfully", user: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

  
//fetching user accounts
app.get('/users' , async(req,res) =>{
    try {
         const users = await User.find({});
         res.status(200).json(users);
    } catch (error) {
         console.log(error.message);
         res.status(500).json({message: error.message});
    }
 })
 
//deleting user account
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);  // Find the product by ID and delete it

        if (!user) {
            return res.status(404).json({ message: `No user found with ID ${id}` });
        }

        res.status(200).json({ message: `User with ID ${id} has been deleted` });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});


mongoose.connect('mongodb+srv://kelvinashong02_db_user:safrokelVentures@safrokelventures.p2obcx2.mongodb.net/?retryWrites=true&w=majority&appName=SafrokelVentures')
.then(()=>{
    console.log("connected to Safrokel mongodb");
    app.listen(port, ()=>{
        console.log('Safrokel API is running on port ' + port);
    })
}).catch(()=>{
    console.log(error);
})


