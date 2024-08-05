const mongoose = require("mongoose");

const pdfDetailsSchema = new mongoose.Schema(
  {
    pdf: String,
    serial:Number,
    title: String,
    isQuiz:{
        type:Boolean,
        default:false
    }
  },
  { collection: "PdfDetails" }
);

const PdfSchema = mongoose.model("PdfSchema", pdfDetailsSchema);
module.exports = PdfSchema;
