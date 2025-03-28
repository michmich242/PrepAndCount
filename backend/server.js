require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Successfully connected to MongoDB.");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});





// Import the User model
const User = require('./Models/User');

// LOGIN route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({email });

    if(!user){
      return res.status(400).json({message : "User not found"});
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if(!isPassValid){
      return res.status(400).json({message : "Invalid password"});
    }


    if (user) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ message: "Invalid Login" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }


});






app.post('/register', async (req, res) => {
  console.log(req.body);
  const {username, email, password} = req.body;

  try{

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
      return res.status(400).json({message: "Invalid email format"});
    }


    const existingUser = await User.findOne({ email });


    if(existingUser){
      return res.status(400).json({message : "Email already exists"});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    await newUser.save();

    res.status(201).json({message: "Registeration Successful!"});
  }
  catch(error){
    console.error(error);
  }



})






// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
