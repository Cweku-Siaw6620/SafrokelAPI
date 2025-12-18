const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require("bcrypt");


const port = process.env.PORT || 3000;

//importing the models
const User = require('./models/userModel');
const Savings = require('./models/savingsModel')

const app = express();

//middleware
app.use(cors())
app.use(express.json());

//saving users accounts

app.post("/users", async (req, res) => {
  try {
    const { fullName, phoneNumber, password, amount} = req.body;

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
      amount
    });

    const result = await user.save();
    res.status(201).json({ message: "User registered successfully", user: result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// login endpoint
app.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: "Phone number does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
      },
    });
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

//Savings endpoints will go here
app.post('/savings', async(req,res) =>{
  const {userId,amount} = req.body;
  try {
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({error: "User not found"})
    }

    const savings = new Savings({
      owner: userId,
      amount,
    });
    await savings.save();
    res.status(201).json({ message: "Saving added successfully", savings });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({message: error.message});
  }
})

//fetching savings by user
app.get('/savings/:userId', async (req, res) => {
  try {
    const savings = await Savings.find({ owner: req.params.userId }).sort({ date: -1 });
    res.status(200).json(savings);
  } catch (error) {
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


