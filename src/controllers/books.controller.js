const book_dao = require('../daos/book.dao');
const user_dao = require('../daos/user.dao');
const mail_service = require('../utils/mailer');
const purchase_history_dao = require('../daos/purchase_history.dao');

const books_controller = {
  add_books: async (req, res) => {
    try {
      let valid_books;
      let invalid_books;
      const books = req.body;
      const user = req.user_authorization;
      if (user.user_role.toLowerCase() !== 'admin') {
        res.status(403).send({ "message": "UnAuthorized user" });
      } else {
        books.forEach(async (book) => {
          if (books.length == 1) {
            if (book.price < 100 || book.price > 1000) {
              return res.status(400).send({ "message": `Unable to add book : ${book.title}, Price Range can't be less than 100 and greater than 1000` });
            }
            const payload = create_book_save_payload(book, user);
            await book_dao.insert_record(payload);
            return res.status(200).send({ message: "Book successfully added" });
          } else {
            if (book.price < 100 || book.price > 1000) {
              if (!invalid_books) {
                invalid_books = book.title;
              } else {
                invalid_books = invalid_books + ',' + book.title
              }
            } else {
              if (!valid_books) {
                valid_books = book.title;
              } else {
                valid_books = invalid_books + ',' + book.title
              }
              const payload = create_book_save_payload(book, user);
              await book_dao.insert_record(payload);
            }
          }
        });
        let message;
        if (valid_books && invalid_books) {
          message = `Books are successfully added : '${valid_books}', Books are not successfully added due to price range { price < 100 or price > 1000 }: ${invalid_books}`;
        } else {
          if (valid_books) {
            message = `All Books are successfully added`;
          } else {
            message = `All Books are not successfully added due to price range {price < 100 or price > 1000}`;
          }
        }
        return res.status(200).send({ message: message });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Sever Error" });
    }
  },
  get_books_list: async (req, res) => {
    try {
      const books_list = await book_dao.get_all_docs(payload);
      if (!books_list.length) {
        return res.status(202).send({ message: "Not Content" })
      } else {
        return res.status(200).send({ message: "Success", result: books_list });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Sever Error" });
    }
  },
  update_book: async (req, res) => {
    try {
      const book_update_payload = req.body;
      const result = await book_dao.update(book_update_payload.id, book_update_payload);
      res.status(200).send({ message: "Successfully Updated" });
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Sever Error" });
    }
  },
  delete_book: async (req, res) => {
    try {
      console.log('delete');
      const book_update_payload = req.body;
      await book_dao.delete(book_update_payload.id, { is_deleted: true });
      res.status(200).send({ message: "Successfully deleted" });
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Sever Error" });
    }
  },
  purchase_book: async (req, res) => {
    try {
      console.log('purchase book');
      const user = req.user_authorization;
      let purchased_books = req.body.purchased_book_info;
      const logged_in_user = await user_dao.get_doc_by_cond({ email: user.email }, "_id email firstName lastName");
      const book_ids = purchased_books.map(item => { return item.book_id });
      const book_details = await book_dao.get_docs_by_cond({ book_id: { $in: book_ids } }, 'authors title book_id sell_count');
      const purchase_history_ids = await purchase_history_dao.get_all_docs({}, 'purchase_id');
      const prev_increment_value = (!purchase_history_ids.length) ? 0 :
        parseInt(purchase_history_ids[purchase_history_ids.length - 1].purchase_id.split('-')[2]);
      const create_payload = purchase_history_payload(purchased_books, logged_in_user, book_details, prev_increment_value, req.body.total_bill_discount);
      console.log('create_payload',create_payload);
      await purchase_history_dao.insert_record(create_payload);
      send_mail(create_payload, logged_in_user);
      res.status(200).send({ message: "Your request for book purchased has finalized" });
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Sever Error" });
    }
  }
}

function purchase_history_payload(purchased_books, logged_in_user, book_details, prev_increment_value, total_bill_discount) {
  console.log('create purchase_history_payload');
  let payload = {};
  payload["sale_info"] = [];
  payload["book_id"] = [];
  payload["created"] = { "by": logged_in_user.email };
  payload["modified"] = { "by": logged_in_user.email };
  payload["purchase_id"] = `${new Date().getDate()}-${new Date().getMonth()}-${++prev_increment_value}`;
  payload["total_bill_without_discount"] = 0;
  payload["total_bill_with_discount"] = 0;
  payload["user_id"] = logged_in_user._id;
  purchased_books.map(async (book) => {
    const index = book_details.findIndex((obj) => { return book.book_id === obj.book_id });
    payload["book_id"].push(book.book_id);
    const total_price = book.price * book.quantity;
    const discout_price =total_price - total_price * (book.discount/100);
    payload["total_bill_without_discount"] = payload["total_bill_without_discount"] + total_price;
    payload["total_bill_with_discount"] = payload["total_bill_with_discount"] + discout_price;
    payload.sale_info.push({
      unit_price: book.price,
      title: book_details[index].title,
      authors: book_details[index].authors,
      book_id: book.book_id,
      quantity: book.quantity,
      discount: book.discount,
      total_price_without_discount: total_price,
      total_price_with_discount: discout_price
    });
  });
  payload["total_bill_discount"] = parseFloat((((payload["total_bill_without_discount"] - payload["total_bill_with_discount"])/payload["total_bill_without_discount"])*100).toFixed(2));
  payload["total_bill_with_discount"] = payload["total_bill_without_discount"] - payload["total_bill_without_discount"] * (total_bill_discount/100);
  return payload;
}

function create_book_save_payload(book, user) {
  book["sell_count"] = 0;
  book['book_id'] = new Date().getTime();
  book["created"] = { "by": user.email };
  book["modified"] = { "by": user.email };
  return book;
}

async function send_mail(payload, logged_in_user) {
  try{
    console.log('send_mail');
    await mail_service.createConnection();
    const requests = await mail_service.create_request_for_purchase_notification_to_author(payload.book_id, logged_in_user);
    requests.forEach(async(request) => {
      await mail_service.sendMail("fg34", request);
      const update = await book_dao.update(request.book_id, {sell_count : ++ request['sell_count']});
      console.log('update result',update);
    });
  }catch(e){
    console.log('error while sending mail', e);
  }
}

module.exports = books_controller;