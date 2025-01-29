const express = require("express");
const jwt = require("jsonwebtoken");

// import express from "express";
// import jwt from "jsonwebtoken";

const JWT_SECRET="piyush123";

const app=express();
app.use(express.json());

const users=[];
//middleware
function logger(req,res,next){
    console.log(req.method +" request came");
    next();
}
//localhost:3000
app.get("/",function(req,res){
    res.sendFile(__dirname + "/public/index.html")
})
app.post("/signup",logger,function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    users.push({
        username:username,
        password:password
    })


    res.json({
        message:"You are signed in"
    })

})

app.post("/signin",logger,function(req,res){
    const username=req.body.username;
    const password=req.body.password;

    let foundUser=null;

    for(let i=0;i<users.length;i++){
        if(users[i].username===username && users[i].password===password){
            foundUser=users[i];
        }
    }

    if(!foundUser){
        res.json({
            message:"Credentials Incorrect"
        })
        return
    }
    else{
        const token=jwt.sign({
            username:foundUser.username
        },JWT_SECRET);
        res.header("jwt",token);

        res.header("random","piyush");

        res.json({
            token:token
        })
    }
})
//middleware
function auth(req,res,next){
    const token=req.headers.token;
    const decodeData=jwt.verify(token,JWT_SECRET);

    if(decodeData.username){
        req.username=decodeData.username;
        next();
    }
    else{
        res.json({
            message:"You are not logged in"
        })
    }
}

app.get("/me",logger,auth,function(req,res){
    
    // const token=req.headers.token;
    // const decodeData=jwt.verify(token,JWT_SECRET);

    let foundUser=null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === req.username) {
            foundUser = users[i];
        }
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    })
    
})

app.listen(3000);

