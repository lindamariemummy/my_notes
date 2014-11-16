//checks to make sure input has no spaces and is at least 8 charaxters long
module.exports = function(password) {
  if (password.length < 8 || password.search(' ') != -1) {
    return false;
  }
  //console.log(password);
  return true;
};
