const express = require("express");
const app = express();
const path=require("path");
const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); //to connect the styleheet to ejs
app.use(express.urlencoded({ extended:true }));
main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));


// Index Route
app.get("/chats",async (req,res)=>{
let chats=await Chat.find();

res.render("index.ejs",{ chats });


});

// New Route
app.get("/chats/new",(req,res)=>{
res.render("new.ejs");
});

// Create Route
app.post("/chats",(req,res)=>{
let {from,to,msg}=req.body;
let newChat=new Chat({
  from:from,
  to:to,
  msg:msg,
  created_at:new Date()
});
newChat.
      save().
      then((res)=>{
         console.log("Chat was Saved");
        }).catch((err)=>{
          consol.log(err);
        });

res.redirect("/chats");
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Whatsapp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// let chat1=new Chat({
//   from:"neha",
//   to:"priya",
//   msg:"send me your exam ",
//   created_at:new Date()
// })
// chat1.save().then(res=>{
//   console.log(res);
// })

app.get("/",(req,res)=>{
res.send("Server is working")
});


app.listen(8080, () => {
  console.log("Server is Running on Server 8080");
});
