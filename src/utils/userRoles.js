function hasRole(roles, role) {
  var found = false;
  for(var i = 0; i < roles.length; i++) {
      if (roles[i].role == role) {
          found = true;
          break;
      }
  }
  return found
}

export default hasRole;
