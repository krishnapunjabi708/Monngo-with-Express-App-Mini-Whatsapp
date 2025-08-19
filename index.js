// index.js (replace your current file)
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
require("dotenv").config();

const Chat = require("./models/chat"); // <-- fixed path (was ../models/chat.js)

const app = express();

// Middleware & view setup
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Robust DB connect (re-uses connection in serverless env)
async function connectDB() {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 1) {
    // already connected
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in env variables");
  }
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB connected");
}

// Routes
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

app.get("/chats", async (req, res, next) => {
  try {
    await connectDB();
    let chats = await Chat.find();
    res.render("index", { chats }); // render('index') is fine
  } catch (err) {
    next(err);
  }
});

app.get("/chats/new", (req, res) => {
  res.render("new");
});

app.post("/chats", async (req, res, next) => {
  try {
    await connectDB();
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from,
      to,
      msg,
      created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

app.get("/chats/:id/edit", async (req, res, next) => {
  try {
    await connectDB();
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit", { chat });
  } catch (err) {
    next(err);
  }
});

app.put("/chats/:id", async (req, res, next) => {
  try {
    await connectDB();
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

app.delete("/chats/:id", async (req, res, next) => {
  try {
    await connectDB();
    let { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
  } catch (err) {
    next(err);
  }
});

// export app for serverless (Vercel)
module.exports = app;
