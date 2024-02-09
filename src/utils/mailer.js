const nodemailer = require('nodemailer');
const book_dao = require('../daos/book.dao');
const purchase_history_dao = require('../daos/purchase_history.dao');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let transporter;
const sendMail = async(requestId, options) => {
  return await transporter
    .sendMail({
      from: '"Paritosh Ratawal" <paritoshratawal@gmail.com>',
      to: options.to,
      // cc: options.cc,
      // bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      // html: options.html,
    })
    .then((info) => {
      // Logging.info(`${requestId} - Mail sent successfully!!`);
      // Logging.info(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
      // if (process.env.NODE_ENV === 'local') {
      //     Logging.info(`${requestId} - Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(
      //         info
      //     )}`);
      // }
      return info;
    });
}
const mail_service = {
  get_data_for_revenue_mail_to_author : async() => {
    console.log('send_revenue_mail_to_author');
    const project = 'sale_info purchase_date book_id purchase_id';
    const cond = { is_send_email_notification: false }
    const results = await purchase_history_dao.get_all_docs(cond, project);
    const book_details = await book_dao.get_all_docs({}, 'created sell_count book_id');
    return {book_details: book_details, results: results};
  },
  create_request_for_purchase_notification_to_author : async(book_ids, logged_in_user) => {
    let mail_requests = [];
    const cond = { book_id: {$in: book_ids} };
    const book_details = await book_dao.get_all_docs(cond, 'created sell_count book_id title');
    book_details.forEach((detail) => {
      const options = {
        sell_count: detail.sell_count,
        book_id: detail.book_id,
        to: detail.created.by,
        subject: `Book Sale Notification for ${detail.title}`,
        text: `Book ${detail.book_id} has been purchased by ${logged_in_user.firstName} ${logged_in_user.lastName}`
      };
      mail_requests.push(options);
    })
    return mail_requests;
  },
  //CREATE A CONNECTION FOR LIVE
  createConnection: async () => {
    const test_account = await nodemailer.createTestAccount();
    // console.log('test_account', test_account);
    const connection_obj = {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'janie.mohr32@ethereal.email', // generated ethereal user
        pass: 'FPHYgzpgbVUBVTFGpp' // generated ethereal password
      }
    };
    // console.log('connection_obj', connection_obj);
    transporter = await nodemailer.createTransport(connection_obj);
  },
  sendMail: sendMail

}


module.exports = mail_service;