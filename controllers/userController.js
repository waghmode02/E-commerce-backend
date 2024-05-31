const User = require("../Model/userModel.js");
const bcrypt = require("bcrypt");
const dotenv=require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const signup = async (req, res) => {
    try {
        const userData = new User(req.body);
        const { email } = userData;
        const existUser = await User.findOne({ email });
        
        if (existUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const savedUser = await userData.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(401).json({ message: "User not found" });
        }

        const checkPass = await bcrypt.compare(password, userExist.password);
        if (!checkPass) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const tokenExist = req.cookies.token;
        if (tokenExist) {
            return res.status(200).json({ message: "Already logged in" });
        }

        const token = jwt.sign({ userID: userExist._id }, process.env.SECRET_KEYS, { expiresIn: '1h' });
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json({ message: "Login successful..!" });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout=async (req,res)=>{
    try{
        const userExist=req.cookies.token;
        if(!userExist){
            return res.status(200).json({message:"Login required..!"});
        }
        res.clearCookie("token");
        res.status(200).json({message:"Logout Successfully.."});
    }
    catch(error){
        res.status(500).json({error:error})
    }
}

module.exports = { signup, login,logout };
