const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config(); // Load environment variables from .env file

const Chat = require("./models/chat.js");
const port = process.env.PORT || 8080;

// Set up the MongoDB connection URI using the environment variable
const uri = process.env.MONGO_URI;

// Set up server and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Connect to MongoDB Atlas and start the server
async function main() {
  try {
    // Connect to the database using the URI from environment variables
    await mongoose.connect(uri);
    console.log("Connection to MongoDB Atlas successful!");

    // Start the server ONLY AFTER a successful database connection
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Call the main function to connect to the database and start the server
main();

// Index Route
app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  res.render("index.ejs", {
    chats
  });
});

// New Route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// Create Route
app.post("/chats", (req, res) => {
  let {
    from,
    to,
    msg
  } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });
  newChat
    .save()
    .then((res) => {
      console.log("Chat was Saved");
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/chats");
});

// Edit Route
app.get("/chats/:id/edit", async (req, res) => {
  let {
    id
  } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit.ejs", {
    chat
  });
});

// Update route
app.put("/chats/:id", async (req, res) => {
  let {
    id
  } = req.params;
  let {
    msg: newMsg
  } = req.body;
  let updateChat = await Chat.findByIdAndUpdate(
    id, {
      msg: newMsg
    }, {
      runValidators: true,
      new: true
    }
  );
  console.log(updateChat);
  res.redirect("/chats");
});

// DELETE or Destroy the Route
app.delete("/chats/:id", async (req, res) => {
  let {
    id
  } = req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  console.log(deletedChat);
  res.redirect("/chats");
});

app.get("/", (req, res) => {
  res.send("Server is working");
});
