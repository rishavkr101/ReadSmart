const mongoose = require("mongoose");

const studentDetailSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      required: true
    },
    Serial: [
      { serial:{
        type:String
      },
        completed: {
          type: Boolean,
          default: false
        },
       
        
      }
    ]
  },
 
);

const StudentDetail = mongoose.model("StudentDetail", studentDetailSchema);
module.exports = StudentDetail;
