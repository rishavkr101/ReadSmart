const express = require("express")
const app = express();
const mongoose = require("mongoose"); 
const bodyParser = require('body-parser')
const teacherRoutes = require("./routes/teacherRoutes")
const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const studentRoutes = require("./routes/studentRoutes")
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
const cors = require("cors");
app.use(cors());
app.use("/files",express.static("files"))
const teacherQuiz = require("./teacherquiz")

const mongoUrl =  "mongodb+srv://rishav123:fawbs2IxeI7TFhBs@cluster0.68ubmsw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUrl)
.then(() => {
    console.log("connected to database");
}).catch((e) => {
    console.log(e)
});



const multer = require("multer")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "./files");
    },
    filename: function (req,file,cb){
        const uniqueSuffix = Date.now();
        cb (null, uniqueSuffix + file.originalname);
    }
});



const PdfSchema = require("./models/pdfSchema")
const upload = multer({storage: storage});
app.use("/admin",adminRoutes )
app.use("/teacher",  teacherRoutes)
app.use("/student",  studentRoutes)
app.use('/auth', authRoutes)
app.use('/quiz',teacherQuiz)


app.post("/upload-files",upload.single("file"),async(req,res)=>{

   console.log(req.file);
   const {title, serial} = req.body;

   const fileName = req.file.filename
   try {
    await PdfSchema.create({title: title,serial:serial, pdf: fileName});
    res.send({status: "ok"});
   } catch (error) {
    res.json({status: error})
   }
});


app.get("/",async(req,res) => {
    res.send("rishav!!");
});






app.listen(8000,()=>{
    console.log("server started")
})








