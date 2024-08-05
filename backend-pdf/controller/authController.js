const User = require("../models/user_schema");

const loginUser = async(req, res)=>{
    
    try {
        const { email, password } = req.body;
        if(!password || !email){
            return res.json({
                status:false,
                message:"All fields are mandatory."
            })
        }
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(400).json({ status: false, message: "User not found" });
        }


        if (password !== user.password) {
            return res.status(400).json({ status: false, message: "Invalid email or password" });
        }

      res.status(200).json({
        status:true,
        message:"Login success",
        data: user
      })
    } catch (error) {
        // console.log(error);
        res.status(500).json({ status: "error", message: "Something went wrong" });
    }
}

module.exports = { loginUser };
