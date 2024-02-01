const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
	generateHash: async (password) => {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);
		return hash;
	},
	password_compare : async(password, hash_password) => {
    return bcrypt.compareSync(password, hash_password);
  },
	generate_token : async (json) => {
    console.log(json);
    const private_key = 'paritosh_node_server';
    return jwt.sign(json, private_key, { expiresIn: '120s' });
  }
}