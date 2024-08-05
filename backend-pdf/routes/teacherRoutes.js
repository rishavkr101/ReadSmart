const express = require("express");
const {getFiles} = require("../controller/teacherController")
const {patchPdf} = require("../controller/teacherController")

const router= express.Router();


// app.get("/get-files",async(req,res) => {
//     try {
//         PdfSchema.find({}).then((data) => {
//             res.send({status: "ok", data: data});
//         });
//     } catch (error) {
        
//     }
// })

router.get("/get-files",getFiles )
router.patch("/patch-pdf", patchPdf)






module.exports = router;