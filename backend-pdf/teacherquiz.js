const express = require("express");
const { default: mongoose } = require("mongoose");
const PdfSchema = require("./models/pdfSchema");
const router = express.Router()
// Quiz schema and model
const quizSchema = new mongoose.Schema({
  title: String,
  serial:Number,
  pdf:String,
  questions: [{
    questionText: String,
    options: [String],
    correctAnswer: String,
    
  }],
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = {Quiz}

// Routes
router.post('/teacher-quiz/:id', async (req, res) => {
  try {
    
    const quiz = new Quiz(req.body);
    const {id} = req.params
    console.log("dadadad", id);
    const pdfExist  = await PdfSchema.findById(id);
    quiz.serial = pdfExist.serial
    quiz.pdf = id
    await quiz.save();  

    res.status(201).json({
      sucess:true,
      quiz : quiz,
      message:"Quiz created successfully"
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/get-quiz/:serial",async (req, res) => {
  const { serial } = req.params;

  if (!serial) {
    return res.status(400).json({
      success: false,
      message: "Invalid serial",
    });
  }

  try {
    // Use the 'findOne' method to get a single quiz based on the serial
    const quiz = await Quiz.find({serial:serial});

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router

