const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req,res)=>{
    try{
      const salt = await bcrypt.genSalt(10);
      const hashedpass= await bcrypt.hash(req.body.password,salt);
      const newUser = User({
          username: req.body.username,
          email : req.body.email,
          password: hashedpass,
      });

      const user = await newUser.save();
      res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(400).json("Wrong credentials!");
  
      const validated = await bcrypt.compare(req.body.password, user.password);
      !validated && res.status(400).json("Wrong credentials!");
  
      const { password, ...others } = user._doc; //prevents password from displaying when using post
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;