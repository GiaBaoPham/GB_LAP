const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routers/index");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const passport = require("passport");
const app = express();
const initializePassport = require("./config/passport.config");
const session = require("express-session");
const flash = require("express-flash");
require("dotenv/config");

// Kết nối MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "User_data",
  })
  .then(() => console.log("✅ Connected to Database"))
  .catch((e) => console.error("❌ Connection failed:", e));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      dbName: "Lapshop",
      collectionName: "session",
      ttl: 60 * 60 * 24 * 14,
      autoRemove: "native",
    }),
  })
);

// Cấu hình Passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Cấu hình đường dẫn tĩnh
const path = require("path");
const __rootDir = path.join(__dirname, "..");
const __viewsDir = path.join(__rootDir, "frontend", "views");
const __publicDir = path.join(__rootDir, "frontend", "public");

app.use(express.static(__publicDir));
console.log("Static files served from:", __publicDir);

// Cấu hình View Engine
app.set("views", __viewsDir);
app.set("view engine", "ejs");

// Cấu hình Routes
route(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
