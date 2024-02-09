const purchase_history_model = require('../schema/purchase_history.schema');

const purchase_history_dao = {
  insert_record: async (record) => {
    return await purchase_history_model.insertMany(record);
  },
  get_all_docs: async (cond, project) => {
    return await purchase_history_model.find(cond, project).exec();
  },
  get_doc_by_cond: async (cond) => {
    return await purchase_history_model.findOne(cond).exec();
  },
  update: async (id, update_payload) => {
    const doc = await purchase_history_model.findOne({ purchase_id: id }).exec();
    const payload = Object.assign(doc, update_payload);
    return await payload.save();
  },
  delete: async (id) => {
    const doc = await purchase_history_model.findOne({ book_id: id }).exec();
    doc['is_deleted'] = true;
    const deleted_doc = new purchase_history_model(doc);
    return await deleted_doc.save();
  },
  get_aggregate_data: async(cond) => {
    return await purchase_history_model.aggregate(cond).exec();
  }
}

module.exports = purchase_history_dao;