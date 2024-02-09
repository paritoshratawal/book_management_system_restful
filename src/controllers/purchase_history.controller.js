const book_dao = require('../daos/book.dao');
const purchase_history_dao = require('../daos/purchase_history.dao');

const purchase_history_controller = {
  get_purchase_history_data: async (req, res) => {
    try {
      const project = "purchase_id discount sale_info total_bill_without_discount total_bill_with_discount purchase_date";
      const purchase_histories = await purchase_history_dao.get_all_docs(project);
      return res.status(200).send({"result": purchase_histories});
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Sever Error" });
    }
  }
}

module.exports = purchase_history_controller;