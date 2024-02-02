const book_dao = require('../daos/book.dao');

const books_controller = {
  add_books: async (req, res) => {
    try{
      const user = req.user_authorization;
      const body = req.body;
      if(user.user_role.toLowerCase() !== 'admin'){
        res.status(403).send({"message": "UnAuthorized user"});
      }else{
        console.log("body", body);
        if(body.price < 100 && body.price > 100){
          return res.status(400).send({"message": "Price Range can't be less than 100 and greater than 1000"});
        }else{
          body["sell_count"] = 0;
          body['book_id'] = new Date().getTime();
          body["created"] = { "by" : user.email };
          body["modified"] = { "by" : user.email };
          const saved_doc = await book_dao.insert_record(body);
          console.log('saved_doc',saved_doc);
        }
      }  
    }catch(e){
      console.log(e);
      res.status(500).send({"message": "Internal Sever Error"});
    }
    
  }
}

module.exports = books_controller;