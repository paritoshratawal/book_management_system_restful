const role_dao = require('../daos/role.dao');
const user_dao = require('../daos/user.dao');
const hash_handler = require('../utils/hash_handler');

const user_conroller = {
  registration: async (req, res) => {
    try {
      console.log('Body', req.body);
      const existing_user = await user_dao.get_doc_by_cond({ email: req.body.email }, "");
      console.log('existing_user', existing_user);
      if (existing_user) {
        return res.status(409).send({ "message": "User already Exists" });
      } else {
        const doc = await generate_user_save_model(req.body);
        console.log('doc', doc);
        const saved_doc = await user_dao.insert_record(doc);
        return res.status(200).send({ "message": "User Registered Successfully" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Server Error", e });
    }
  },
  login: async (req, res) => {
    try {
      console.log('')
      const user = await user_dao.get_doc_by_cond({ 
        "email": req.body.email, 
        "$or": [
          { "delete": { $exists: false } }, 
          { "delete": false }
        ]}, "");
      if (!user) {
        res.status(401).send({ "message": "Unauthorized" });
      } else {
        console.log('else');
        const is_compare = await hash_handler.password_compare(req.body.password, user.password);
        console.log('is_compare', is_compare);
        if (!is_compare) {
          res.status(401).send({ "message": "Unauthorized" });
        } else {
          const obj = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          }
          const role_doc = await role_dao.get_doc_by_cond({ _id: user.userRole });
          obj["user_role"] = role_doc.role;
          obj["access"] = role_doc.access;
          const token = await hash_handler.generate_token(obj)
          return res.status(200).send({ "message": "Successfully Login", "token": token, user_info: obj });
        }
      }
    } catch (e) {
      res.status(500).send({ "message": "Internal Server Error", e });
    }
  },
  delete_user: async (req, res) => {
    try {
      let counter = 0;
      const cond = { email: { $in: req.body.emails } };
      const users = await user_dao.get_docs_by_cond(cond, '_id');

      users.forEach(async (user) => {
        counter++;
        await user_dao.update({ _id: user._id }, { delete: true });
        console.log('user', user);
      });
      setInterval(() => {
        if (counter === users.length) {
          return res.status(200).send({ "message": "succefully deleted" });
        }
      }, 3)
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Server Error", e });
    }

  },
  get_users: async (req, res) => {
    try {
      const results = await user_dao.get_all_docs();
      return res.status(200).send({ "message": "success", "data": results });
    } catch (e) {
      console.log(e);
      res.status(500).send({ "message": "Internal Server Error", e });
    }
  }
}

const generate_user_save_model = async (body) => {
  console.log('generate_user_save_model');
  const role_doc = await role_dao.get_doc_by_cond({ role: body.role });
  return {
    "created": { "by": body.email },
    "modified": { "by": body.email },
    "email": body.email,
    "firstName": body.firstName,
    "lastName": body.lastName,
    "password": await hash_handler.generateHash(body.password),
    "userRole": role_doc._id
  }
}


module.exports = user_conroller;