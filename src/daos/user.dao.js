const user_model = require('../schema/user.schema');

const user_dao = {
  insert_record: async (record) => {
    const save_doc = new user_model(record);
    return await save_doc.save();
  },
  get_all_docs: async () => {
    return await user_model.find().exec();
  },
  get_doc_by_cond: async (cond) => {
    return await user_model.findOne(cond).exec();
  }
}

module.exports = user_dao;