export const hasPermissions = (
  userPermissions,
  routePermissions,
  allPermissionsMandatory
) => {
  if (allPermissionsMandatory) {
    // Check if all required permissions are present in the user's permissions
    return routePermissions.every((permission) =>
      userPermissions.includes(permission)
    );
  } else {
    // Check if at least one required permission is present in the user's permissions
    return routePermissions.some((permission) =>
      userPermissions.includes(permission)
    );
  }
};
