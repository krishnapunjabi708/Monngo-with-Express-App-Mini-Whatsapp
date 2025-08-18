const express = require("express");
const app = express();
const path=require("path");
const mongoose=require("mongoose");
require("dotenv").config(); 
const uri = process.env.MONGO_URI;
const methodOverride=require("method-override");

const Chat=require("./models/chat.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public"))); //to connect the styleheet to ejs
app.use(express.urlencoded({ extended:true }));
app.use(methodOverride("_method"));
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

// Edit Route
app.get("/chats/:id/edit",async (req,res)=>{
  let {id}=req.params;
  let chat=await Chat.findById(id);
res.render("edit.ejs",{ chat });
});

// Update route
app.put("/chats/:id",async (req,res)=>{
let {id}=req.params;
let {msg:newMsg}=req.body;
let updateChat=await Chat.findByIdAndUpdate(id,{msg : newMsg},{runValidators:true,new:true});
console.log(updateChat);
res.redirect("/chats");
});

// DELETE or Destroy the Route
app.delete("/chats/:id",async (req,res)=>{
let { id }=req.params;
let deletedChat=await Chat.findByIdAndDelete(id);
console.log(deletedChat);
res.redirect("/chats");
});


    main()
      .then(() => {
        console.log("Connection successful!");
      })
      .catch((err) => console.log(err));

    async function main() {
      await mongoose.connect(uri);
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


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});