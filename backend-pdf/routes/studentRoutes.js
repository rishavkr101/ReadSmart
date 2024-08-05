const express = require("express")
const { notCompleted, addDetails, completeQuiz, getAllPdf } = require("../controller/studentController")


const router = express.Router()

router.get("/not-completed/:id", notCompleted)

router.get("/get-pdf-all/:id", getAllPdf)

router.post("/add-details", addDetails)

router.patch("/complete-quiz/:id", completeQuiz)






module.exports = router