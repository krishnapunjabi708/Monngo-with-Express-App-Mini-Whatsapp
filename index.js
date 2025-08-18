const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
require("dotenv").config();


const Chat = require("./models/chat.js");

const app = express();

// Middleware
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB connection (cached for serverless)
let isConnected;
async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables!");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

app.get("/chats", async (req, res) => {
  await connectDB();
  let chats = await Chat.find();
  res.render("index.ejs", { chats });
});

app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
  await connectDB();
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from,
    to,
    msg,
    created_at: new Date(),
  });
  await newChat.save();
  console.log("Chat was Saved");
  res.redirect("/chats");
});

app.get("/chats/:id/edit", async (req, res) => {
  await connectDB();
  let { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", { chat });
});

app.put("/chats/:id", async (req, res) => {
  await connectDB();
  let { id } = req.params;
  let { msg: newMsg } = req.body;
  let updateChat = await Chat.findByIdAndUpdate(
    id,
    { msg: newMsg },
    { runValidators: true, new: true }
  );
  console.log(updateChat);
  res.redirect("/chats");
});

app.delete("/chats/:id", async (req, res) => {
  await connectDB();
  let { id } = req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  console.log(deletedChat);
  res.redirect("/chats");
});

// 👇 Export Express app as Vercel handler
module.exports = (req, res) => {
  return app(req, res);
};

