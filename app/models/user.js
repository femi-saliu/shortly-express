var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var cipher = Promise.promisify(bcrypt.hash);

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(params){
    this.on('creating', this.hashPassword);
  },
  hashPassword: function(){
    return cipher(this.get('password'), null, null)
    .bind(this)
    .then(function(hash){
      this.set('password', hash);
    });
  },
  comparePassword: function(attempted, callback){
    bcrypt.compare(attempted, this.get('password'), function(error, isMatch){
      callback(isMatch);
    });
  }
});

module.exports = User;