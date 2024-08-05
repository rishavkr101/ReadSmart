const PdfSchema = require("../models/pdfSchema");

const getFiles = async (req, res) => {
    try {
        const data = await PdfSchema.find({}).sort({ serial: 1 });

        res.status(200).json({status: "ok", data: data});
    } catch (error) {
        res.status(500).send({status: "error", message: error.message});
    }
}
const patchPdf = async(req, res)=>{
    try {
        const {id} = req.query
        if(!id){
            res.status(300).json({
                sucess:false,
                message:"Invalid id"
            })
        }
        const pdfExist = await PdfSchema.findById(id)
        pdfExist.isQuiz = true;
        await pdfExist.save()
        res.status(200).json({
            success : "true",
            message:"Modified"
        })
    } catch (error) {
        // console.log(error);
        res.status(500).josn({
            sucess:false,
            message:"Internal Server Error"
        })
    }
}
module.exports = { getFiles, patchPdf };
