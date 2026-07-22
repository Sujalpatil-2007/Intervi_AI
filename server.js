require("dotenv").config();
const express = require("express");
const app = require("./src/app");

app.use(express.json());

app.listen(3000,()=>{
    console.log("Server is runing on port 3000");
});