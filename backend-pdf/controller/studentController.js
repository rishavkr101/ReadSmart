const PdfSchema = require("../models/pdfSchema");
const StudentDetail = require("../models/studentDetailSchema");
const { Quiz } = require("../teacherquiz");

const notCompleted = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }

  try {
    // Find student details
    const details = await StudentDetail.findOne({ student: id });

    // If no details are found, create a new record for the student
    if (!details) {
      await StudentDetail.create({ student: id });
    }

    // Get all PDFs
    const allPdfs = await PdfSchema.find({});

    // If no details or serial records are found, return all PDFs
    if (!details || details.Serial.length === 0) {
      return res.status(200).json({
        success: true,
        data: allPdfs,
      });
    }

    // Extract serials of completed PDFs
    const completedSerials = details.Serial
      .filter(serial => serial.completed)
      .map(serial => serial.serial);

    console.log('Completed Serial Numbers:', completedSerials);

    // Find PDFs not listed in the completed serials
    const validPdfToShow = allPdfs.filter(pdf => !completedSerials.includes(pdf.serial.toString()));
    console.log('Valid PDFs to Show:', validPdfToShow);
    res.status(200).json({
      success: true,
      data: validPdfToShow,
    });
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




const addDetails = async (req, res) => {
    try {
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid id"
        });
      }
  
      const detailsExists = await StudentDetail.findOne({ student: id });
  
      if (detailsExists) {
        return res.status(409).json({
          success: false,
          message: "Already exists"
        });
      }
  
      const newDetail = await StudentDetail.create({ student: id });
  
      res.status(201).json({
        success: true,
        data: newDetail
      });
    } catch (error) {
      console.error('Error adding details:', error);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  };

  const completeQuiz = async (req, res) => {
    try {
      const { id } = req.params;
      const { serial } = req.body;
  
      if (!id) {
        return res.status(409).json({
          success: false,
          message: "Invalid id",
        });
      }
  
      // Find the student details document
      const studentDetail = await StudentDetail.findOne({ student: id });
  
      if (!studentDetail) {
        return res.status(404).json({
          success: false,
          message: "Student details not found",
        });
      }
  
      // Find the index of the pdf in the Serial array
      const pdfIndex = studentDetail.Serial.findIndex((el) => el.serial === serial);
  
      if (pdfIndex !== -1) {
        // If pdf is found, update its status to completed
        studentDetail.Serial[pdfIndex].completed = true;
      } else {
        // If pdf is not found, add it to the Serial array
        studentDetail.Serial.push({
            serial:serial,
          completed: true,
          
        });
      }
  
      // Save the updated student details
      await studentDetail.save();
  
      res.status(200).json({
        success: true,
        message: "Quiz status updated successfully",
      });
    } catch (error) {
      console.error('Error completing quiz:', error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
  
  const getAllPdf = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid id",
        });
      }
  
      // Retrieve all PDFs with details
      const allPdfWithDetails = await PdfSchema.find({});
  
      // Retrieve student details
      const studentDetails = await StudentDetail.findOne({ student: id });
  
      // Extract the serial numbers of completed quizzes
      const completedSerials = studentDetails
        ? studentDetails.Serial.filter(record => record.completed).map(record => Number(record.serial))
        : [];
  
      // Add completion status to each PDF
      const allPdfWithStatus = allPdfWithDetails.map(pdf => ({
        ...pdf.toObject(),
        canAccess: completedSerials.includes(Number(pdf.serial)),
      }));
  
      res.status(200).json({
        success: true,
        data: allPdfWithStatus,
      });
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
  
  
  

 
  
module.exports = {notCompleted, addDetails, completeQuiz, getAllPdf}