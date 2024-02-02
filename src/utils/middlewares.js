const jwt = require('jsonwebtoken');
module.exports = {
  authentication: async(req, res, next) => {
    try{
      console.log('authenticated', req.headers.token);
      const token = req.headers.token;
      const decoded = await jwt.verify(token, 'paritosh_node_server');
      console.log('decode', decoded);
      req["user_authorization"] = decoded;
      next();
    }catch(e){
      console.log('e',e);
      res.status(401).send({"message": "Token expired"})
    }
  }
}