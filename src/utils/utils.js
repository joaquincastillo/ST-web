function isRole(session, role) {
  var found = false;
  for(var i = 0; i < session.me.roles.length; i++) {
      if (session.me.roles[i].role == role) {
          found = true;
          break;
      }
  }
  return found
}

export default isRole;
