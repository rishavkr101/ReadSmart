const User = require("../models/user_schema");


const registerUser = async(req, res)=>{
    try {
        const {email, password, role} = req.body;
        const user = await User.create({
            email,
            password,
            role
        })
        res.status(201).json({
            status:true,
            message:"User created"
        })
        
    } catch (error) {
        // console.log(error);
        res.status(401).json({
            status:false,
            messgae:"something went wrong"
        })
    }
}


module.exports = {registerUser}