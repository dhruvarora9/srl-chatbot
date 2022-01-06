const admin = require("./index");
const express = require("express");
const router = express.Router();

async function grantAdminRole(email) {
  const user = await admin.auth().getUserByEmail(email);
  if (user.customClaims && user.customClaims.admin === true) {
    return;
  }
  return admin.auth().setCustomUserClaims(user.uid, {
    admin: true,
  });
}

async function checkAdminAccess(adminEmail) {
  const adminUser = await admin.auth().getUserByEmail(adminEmail);
  if (!adminUser.customClaims || adminUser.customClaims.admin !== true) {
    return {
      success: false,
      message:
        "Request not authorized. User must be a admin to fullfill the request",
    };
  }
  return {
    success: true,
    message: "Admin authorized successfully",
  };
}

router.route("/grantadminpriv/").post((req, res) => {
  const { email, adminEmail } = req.body;
  checkAdminAccess(adminEmail)
    .then((statusResponse) => {
      if (statusResponse.success) {
        grantAdminRole(email)
          .then((response) => {
            res.json({
              message: "admin role added for the user successfully",
              data: response,
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: "Failed to add admin privileges to the user",
              error,
            });
          });
      } else {
        res.status(500).json({
          message: statusResponse.message,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Failed to check for admin privilege of the sender",
        error,
      });
    });
});

module.exports = router;
