const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(email) {
                const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
                return emailRegex.test(email);
            },
            message: "Email format is invalid",
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                return password.length >= 8;
            },
            message: "Password length must be at least 8 characters",
        },
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(confirmPassword) {
                return confirmPassword === this.password;
            },
            message: "Passwords do not match",
        },
    },
}, { timestamps: true });

userSchema.pre("save", async function(next){
    const user=this;
    if(!user.isModified("password"))return next();
    try{

        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(user.password,salt);
        user.password=hashPassword;
    }
    catch(error){
        console.log(error);
    }
});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.confirmPassword=undefined;
    }
    next();
})


const User = mongoose.model("User", userSchema);

module.exports = User;
