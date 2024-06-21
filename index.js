const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoute = require("./route/userRoute");
dotenv.config({path:".env"});
const app = express();
const URL = process.env.URL;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
mongoose.connect(URL)
    .then(() => {
        console.log("DB Connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.log("Error connecting to MongoDB:", error);
    });
app.use("/api/users", userRoute);
