require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");

const isAuthenticated = require("./middleware/isAuthenticated");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:8080/", "https://wabi-sabi-design.onrender.com"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

require("./helpers/init_mongodb")();
require("./helpers/init_aws")();

app.use((req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token === undefined) req.isLoggedIn = false;
    if (jwt.verify(token, process.env.JWT_SECRET)) req.isLoggedIn = true;
  } catch (err) {
    req.isLoggedIn = false;
  } finally {
    next();
  }
});

app.use("/api/public", require("./routes/public"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", isAuthenticated, require("./routes/admin"));

app.use(express.static(__dirname + "/public"));

app.get(/.*/, (req, res) => {
  console.log("s-a ajuns aici");
  res.sendFile(__dirname + "/public/");
});

// app.get(/.*/, (req, res) => {
//     console.log('da')
//     res.sendFile(__dirname + '/public/index.html')
// })

// app.use((req, res, next) => {
//     console.log('aici')

//     const error = new Error('Not found')
//     error.code = 'NOT_FOUND'

//     next(error)
// })

// app.use((err, req, res, next) => {
//     console.log('next')

//     if (err.code === 'LIMIT_FILE_TYPES') {
//         return res.status(400).json({ error: 'Only images are allowed' })
//     }

//     if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).json({ error: `Image is too large. Max size is ${process.env.MAX_SIZE / 1000000} Mb` })
//     }

//     if (err.code === 'NOT_FOUND') {
//         return res.status(404).json({ error: 'Not found' })
//     }

//     return res.status(500).json({ error: 'Server error' })
// })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
