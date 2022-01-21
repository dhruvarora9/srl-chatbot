require("dotenv").config();
var nodeMailer = require("nodemailer");
const express = require("express");
let cors = require("cors");
const app = express();
const axios = require("axios");

app.use(express.json());
app.use(cors());
const adminRouter = require("./firebase/addAdminPriviledge");

app.use("/api/admin/", adminRouter);
const userList = "sneha.sardar@indusnet.co.in,dhruv.arora@indusnet.co.in";
// let arr = [
//   { message: "Hi", sender: "user@gmail.com" },
//   { message: "hello", sender: "customersupport1@gmail.com" },
//   { message: "How are you?", sender: "user@gmail.com" },
//   { message: "doing good..!!", sender: "customersupport1@gmail.com" }, 
// ];

//REQUEST TO CS TO JOIN CHAT
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

//CHAT DISCONNECTED MAIL TO CS & ADMIN
app.post("/api/mailfordisconnecting", (req, res) => {
  let adminEmail = "appfirebaseuser@gmail.com";
  let { messages, roomId, sender, senderEmail } = req.body;
  
  let endedPerson ;
  let withPerson ;
  if(sender === "cs"){
    endedPerson = "customer support";
    withPerson = "user";
  }else if (sender === "user"){
    endedPerson = "user";
    withPerson = "customer support";
  }
  console.log('endedPerson',endedPerson)

  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  let content = "";
  messages.forEach((item) => {
    content +=
      "<div><p>Message: " +
      item.message +
      "</p><p>Sender: " +
      item.sender +
      "</p><span>----------------</span></div>";
  });

  let mailDetails = {
    from: "appfirebaseuser@gmail.com",
    to: "sneha.sardar@indusnet.co.in",
    cc: adminEmail,
    subject: `room-${roomId} closed`,
    html: `
    <p >Hi, </p>
    <p >The ${endedPerson} - ${senderEmail} has ended the chat with the ${withPerson}. the roomId of 
    the chat is - ${roomId}. Here is your <b>Chat History :</b> </p>
    <div style="border: 1px solid black; border-radius: 12px; margin: 10px; weight: 300px;  height: 250px; padding: 20px; background-color: white;  overflow: auto;">
        ${content}
    </div>
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

//CS LEAVE THE CHAT 
app.post("/api/csleavechat", (req, res) => {
  let { roomId, userName, csEmail } = req.body;
  const csList = ["sneha.sardar@indusnet.co.in", "dhruv.arora@indusnet.co.in"];
  const result =  [];
  csList.forEach((elmt) => {
    if(elmt !== csEmail){
      result.push(elmt);
    }
  })
  // console.log('result',result);

  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailDetails = {
    from: "appfirebaseuser@gmail.com",
    to: result,
    cc : "appfirebaseuser@gmail.com",
    subject: "Request to other cs join the Chat with user",
    html: `
    <p >Hi, </p>
    <p >${csEmail}, has been leave from  the Chat. 
    ${userName} is waiting for another cs to join. Click here </p>
    <p > http://localhost:3000/livechatcs/${roomId} </p>
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

//SEARCH ENGINE
app.post("/api/searchdata", async (req, res, next) => {
  let { query } = req.body;
  console.log( 'in server', query)
  try {
    const response = await axios
      .get("https://www.googleapis.com/customsearch/v1", {
        params: {
          key: process.env.React_App_Google_Search_Api_Key,
          cx: process.env.React_App_Search_Engine_Id,
          q: query,
        },
      })
      .then((response) => {
        response.data.items.length = 5;
        res.send(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    next(err);
  }
});


app.listen(4000, () => {
  console.log("App Server Run");
});

// to: 'sneha.sardar@indusnet.co.in, dhruv.arora@indusnet.co.in',
