// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require("nodemailer")

const sendEmail = async (options) => {
  //1-create transporter object to send email via gmail (you can use another way like ,"Mailgun", "mialtrap", sendGrid))
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
  //2-create mail options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
  }
  //3-send email
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info)
    }
  })
}
module.exports = sendEmail
