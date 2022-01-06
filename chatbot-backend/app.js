require("dotenv").config();
var nodeMailer = require("nodemailer");
const express = require("express");
const app = express();
app.use(express.json());
const adminRouter = require("./firebase/addAdminPriviledge");

app.use("/admin/", adminRouter);

app.post("/mailer", (req, res) => {
  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailDetails = {
    from: "appfirebaseuser@gmail.com",
    to: "sneha.sardar@indusnet.co.in",
    subject: "Test mail",
    text: "hello...user wants to chat with a person :)",
  };
  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log("ERROR:", err);
    } else {
      console.log("Email sent successfully");
    }
  });
});

app.listen(4000, () => {
  console.log("App Server Run");
});

// to: 'sneha.sardar@indusnet.co.in, dhruv.arora@indusnet.co.in',
