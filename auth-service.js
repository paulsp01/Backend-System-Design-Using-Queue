const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const users=[];

app.post('/register',async(req,res)=>{
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered');
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username }, "your_jwt_secret");
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});


app.listen(3000, () =>
  console.log("Authentication service running on port 3000")
);