const express= require("express");
const app = express();
const cors = require('cors')
//const http = require('http');
//const server = http.createServer(app);
//const PORT = 5000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const PORT = process.env.PORT|| 8000;

dotenv.config();
app.use(express.json());
app.use(cors())
app.use("/images",express.static(path.join(__dirname,"/images")))

mongoose.connect(process.env.MONGO_URL,
 {
 useNewUrlParser: true, 
 useUnifiedTopology: true,
 useCreateIndex:true,
 useFindAndModify:false
}).then(console.log("connected database")
).catch(err=>console.log(err));


//take the image and store it here
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    }, filename(req,file,cb){
        cb(null,req.body.name);//filename will be name provides
    }
});

const upload = multer({storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("image uploaded");
})

app.get('/',(req,res)=>{
  res.send('this is my server');
})

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

//if(process.env.NODE_ENV=="production"){
  //  app.use(express.static("client/build"));
    //const path = require("path");
    //app.get("*",(req,res)=>{
      //  res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    //})

    //app.get("/", (req, res) => {
      //  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
      //});
      //}


app.listen(PORT,()=>{
    console.log("connection done");
});
