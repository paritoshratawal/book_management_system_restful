const jwt = require('jsonwebtoken');
module.exports = {
  authentication: async(req, res, next) => {
    try{
      if(!req.headers.token){
        return res.status(401).send({"message": "Authentication Failed"})
      }else{
        const token = req.headers.token;
        const decoded = await jwt.verify(token, 'paritosh_node_server');
        if(!decoded){
          return res.status(401).send({"message": "Authentication Failed"});
        }else{
          req["user_authorization"] = decoded;
          authorization(req, res, next);
        } 
      }
    }catch(e){
      console.log('e',e);
      return res.status(401).send({"message": "Token expired"})
    }
  }
}

function authorization(req, res, next) {
  console.log(req);
  console.log('originalUrl:', req.originalUrl);
  switch(req.user_authorization.user_role) {
    case 'admin': 
      console.log('admin role auth');
      if(req.originalUrl === '/user/add' || req.originalUrl === '/user/delete' || req.originalUrl === '/user/all'){
        next();
      }else{
        return res.status(401).send({message: "Unauthorized User"});
      }
      break;
    case 'author': 
      if(req.originalUrl === '/book/add' || req.originalUrl === '/book/update' || req.originalUrl === '/book/get' || req.originalUrl === '/book/delete'){
        next();
      }else{
        return res.status(401).send({message: "Unauthorized User"});
      }
      break;
    case 'retail_user':
      if(req.originalUrl === '/book/purchase'){
        next();
      }else{
        return res.status(401).send({message: "Unauthorized User"});
      }
      break;
    default: 
      break   
  }
}