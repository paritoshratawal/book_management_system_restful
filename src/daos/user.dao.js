const user_model = require('../schema/user.schema');

const user_dao = {
  insert_record: async (record) => {
    const save_doc = new user_model(record);
    return await save_doc.save();
  },
  get_all_docs: async () => {
    return await user_model.find().exec();
  },
  get_doc_by_cond: async (cond, project) => {
    return await user_model.findOne(cond, project).exec();
  },
  get_docs_by_cond: async (cond, project) => {
    return await user_model.find(cond, project).exec();
  },
  update: async (cond, update_payload) => {
    const doc = await user_model.findOne(cond).exec();
    const payload = Object.assign(doc, update_payload);
    return await payload.save();
  },
}

module.exports = user_dao;