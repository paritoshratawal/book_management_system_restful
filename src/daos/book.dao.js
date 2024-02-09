const book_model = require('../schema/book.schema');

const book_dao = {
    insert_record : async (record) => {
      const save_doc = new book_model(record);
      return await save_doc.save();
    },
    get_all_docs: async (cond, project) => {
      return await book_model.find(cond, project).exec();
    },
    get_doc_by_cond: async (cond, project) => {
      return await book_model.findOne(cond, project).exec();
    },
    get_docs_by_cond: async (cond, project) => {
      return await book_model.find(cond, project).exec();
    },
    update: async (id, update_payload) => {
        const doc = await book_model.findOne({book_id: id}).exec();
        const payload = Object.assign(doc, update_payload);
        return await payload.save();
    },
    delete: async (id) => {
        const doc = await book_model.findOne({book_id: id}).exec();
        doc['is_deleted'] = true;
        const deleted_doc = new book_model(doc);
        return await deleted_doc.save();
    }
  }

module.exports = book_dao;