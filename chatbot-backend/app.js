require("dotenv").config();
var nodeMailer = require("nodemailer");
const express = require("express");
let cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const adminRouter = require("./firebase/addAdminPriviledge");

app.use("/api/admin/", adminRouter);
const userList = "sneha.sardar@indusnet.co.in,dhruv.arora@indusnet.co.in";

app.post("/api/mailer", (req, res) => {
  let { roomId, user } = req.body;
  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailDetails = {
    from: "appfirebaseuser@gmail.com",
    to: userList,
    subject: "Request to join the live chat with user",
    text: `Hi,
    The user has requested to connect with you, click here 
    http://localhost:3000/livechatcs/${roomId}
      `,
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      res.status(500).json({
        message: "Message failed",
      });
    } else {
      res.json({
        message: "Message sent successfully",
      });
    }
  });
});

app.listen(4000, () => {
  console.log("App Server Run");
});

// to: 'sneha.sardar@indusnet.co.in, dhruv.arora@indusnet.co.in',
