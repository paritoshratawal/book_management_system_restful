const fs = require('node:fs/promises');
const role_model = require('../schema/role.schema');

const role_dao = {
  insert_records: async () => {
    const file_path = __dirname + '/../static_files/roles.json';
    const records = JSON.parse(await fs.readFile(file_path, 'utf8'));
    for (let record of records) {
      const save_doc = new role_model(record);
      save_doc['created']['by'] = 'admin';
      save_doc['modified']['by'] = 'admin';
      const result = await save_doc.save();
      console.log(result);
    }

    console.log('insert_records');
  },
  get_all_doc: async () => {
    const result = await role_model.find().exec();
    return result;
  },
  get_doc_by_cond: async(cond) => {
    const result = await role_model.findOne(cond).exec();
    return result;
  }

}

module.exports = role_dao;