require("dotenv").config();
var nodeMailer = require('nodemailer');
const express = require('express')
const app = express();



app.post('/mailer',(req,res)=>
  {
  
      let mailTransporter = nodeMailer.createTransport({
          service: 'gmail',
          auth: {
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
          }
      });
        
      let mailDetails = {
          from:'appfirebaseuser@gmail.com',
          to: 'sneha.sardar@indusnet.co.in',
          subject: 'Test mail',
          text: 'hello...user wants to chat with a person :)'
      };
      mailTransporter.sendMail(mailDetails, function(err, data) {
          if(err) {
              console.log("ERROR:",err);
          } else {
              console.log('Email sent successfully');
          }
      });
  })  

// var transport = nodeMailer.createTransport({
//     // host:'smtp.gmail',
//     // port:587,
//     // secure:false,
//     // requireTLS: true,
//     service: 'gmail',
//     auth:{
//         user:process.env.EMAIL,
//         pass:process.env.PASSWORD
//     }
// });

//   app.post('/sendmail',(req, res) => {
   
//     var mailOptions={
//           from:'appfirebaseuser@gmail.com',
//           to: 'sneha.sardar@indusnet.co.in',
//           subject: 'test node mail',
//           text: 'hello...user wants to chat with a person :)'
//       }

//     //call the built in `sendMail` function and return different responses upon success and failure
//     return transport.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(500).send({
//           data: {
//             status: 500,
//             message: error.toString(),
//           },
//         });
//       }

//       return res.status(200).send({
//         data: {
//           status: 200,
//           message: 'sent',
//         },
//       });
//     });
//   })

  app.listen(4000, () => {
    console.log("App Server Run");
  });
  


// var mailOptions={
//     from:'appfirebaseuser@gmail.com',
//     to: 'sneha.sardar@indusnet.co.in',
//     subject: 'test node mail',
//     text: 'hello...user wants to chat with a person :)'
// }
// app.post('/sendmail',function(req,res){
//     // res.send("this is about page");
   
//    transport.sendMail(mailOptions, function(error, info) {
//             if(error) {
//                 console.log(error);

//             }else {
//                 console.warn('email hass been sent', info.response)
//            }
//         })  
//     );
// }).listen(5000);


// to: 'sneha.sardar@indusnet.co.in, dhruv.arora@indusnet.co.in',