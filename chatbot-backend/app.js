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
let arr = [
  { message: "Hi", sender: "user@gmail.com" },
  { message: "hello", sender: "customersupport1@gmail.com" },
];
//request ti cs to join chat
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

//chat disconnected mail to admin and cs
app.post("/api/mailfordisconnecting", (req, res) => {
  let adminEmail = "appfirebaseuser@gmail.com";
  let { roomId, userName, csEmail } = req.body;

  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  let content = "";
  arr.forEach((item) => {
    content +=
      "<div><p>Message: " +
      item.message +
      "</p><p>Sender: " +
      item.sender +
      "</p><span>----------------</span></div>";
  });

  let mailDetails = {
    from: "appfirebaseuser@gmail.com",
    to: csEmail,
    cc: adminEmail,
    // bcc: "dhruv.arora@indusnet.co.in",
    subject: "User disconnected the chat",
    html: `
    <p >Hi, </p>
    <p >The user ${userName} has been disconnected the chat </p>
    </br>
    <h4>Chat History</h4>
        ${content}
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

//SEARCH
app.post("/api/searchdata", async (req, res, next) => {
  let { query } = req.body;
  try {
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: process.env.React_App_Google_Search_Api_Key,
          cx: process.env.React_App_Search_Engine_Id,
          q: query,
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    next(err);
  }
});

app.listen(4000, () => {
  console.log("App Server Run");
});

// to: 'sneha.sardar@indusnet.co.in, dhruv.arora@indusnet.co.in',
