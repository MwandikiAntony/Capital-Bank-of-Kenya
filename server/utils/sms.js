const AfricasTalking = require("africastalking")({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

const sms = AfricasTalking.SMS;

exports.sendSmsOtp = async (phone, otp) => {
  try {
    await sms.send({
      to: phone,
      message: `Your Capital Bank OTP is ${otp}. Do not share.`,
    });

    console.log("✅ SMS sent");
  } catch (err) {
    console.error("SMS error:", err);
  }
};
