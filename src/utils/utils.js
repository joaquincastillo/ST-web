function isRole(user, role) {
  var found = false;
  for(var i = 0; i < user.roles.length; i++) {
      if (user.roles[i].role == role) {
          found = true;
          break;
      }
  }
  return found
}

export default isRole;
