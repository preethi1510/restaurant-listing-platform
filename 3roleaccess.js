const roleAccess = {
  BusinessOwner: ['create', 'read', 'update'],
  User: ['read'],
  Admin: ['create', 'read', 'update', 'delete'],
};

const checkRoleAccess = (role, action) => {
  return roleAccess[role].includes(action);
};