require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const role_dao = require('./daos/role.dao');
const mail_service = require('./utils/mailer');

const routers = require('./routers/router.main');
const purchase_history_dao = require('./daos/purchase_history.dao');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// const middlewares = require('./utils/middlewares');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const initiate_connection = async () => {
  try {
    await mongo_connection();
    // initiate_controller();
  } catch (e) {
    console.log('Error while initialize', e);
  }
}

const mongo_connection = async () => {
  try {
    const options = {
      // If not connected, return errors immediately rather than waiting for reconnect
      // bufferMaxEntries: 0,
      // connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      // poolSize: 10, // Maintain up to 10 socket connections
      // reconnectTries: 300,
      // reconnectInterval: 1000, // Reconnect every 500ms
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // useFindAndModify: false,  // deprecation warning
    };
    const dbConnectionString = 'mongodb://localhost:27017/book_management_system';
    await mongoose.connect(dbConnectionString, options);
  } catch (e) {
    console.log('Error while connecting to mongo', e);
  } finally {
    console.log('Mongo Connection Successful');
    listen();
  }
}

const listen = async () => {
  try {
    await app.listen(6060);
  } catch (e) {
    console.log('Error while listening', e);
  } finally {
    console.log(`⚡️[server]: Server is running at http://localhost:${6060}`);
    initiate_auto_notification_service();
    initiate_controller();
  }
}

const initiate_controller = async () => {
  const result = await role_dao.get_all_doc();
  if (result && !result.length) {
    role_dao.insert_records();
  }
  routers.array.forEach((route) => {
    app.use('/', route);
  })
}

const initiate_auto_notification_service = async () => {
  try{
    setTimeout(async() => {
      await mail_service.createConnection();
      const data = await mail_service.get_data_for_revenue_mail_to_author();
      if(data.results.length){
        data.results.forEach(result => {
          result.sale_info.forEach(async(info) => {
            const index = data.book_details.findIndex((book) => { return book.book_id === info.book_id });
            const options = {
              to: data.book_details[index]['created']['by'],
              subject: `Book Revenue Notification for book : ${info.title}`,
              text: `Book ${info.book_id} has generated monthly revenue of ${info.total_price_with_discount} for ${months[result.purchase_date.getMonth()]} month.`
            };
            await mail_service.sendMail('abc', options);
            await purchase_history_dao.update(result.purchase_id, {is_send_email_notification: true});
          });
        });
      }
      
      }, 12000);
  }catch(e){

  }
  
}



module.exports = initiate_connection;