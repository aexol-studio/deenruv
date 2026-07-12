import { Permission } from '@deenruv/admin-types';

export const SHOP_MANAGER_ROLE_PERMISSIONS: Permission[] = [
  Permission.ReadOrder,
  Permission.UpdateOrder,
  Permission.ReadCustomer,
  Permission.UpdateCustomer,
  Permission.ReadProduct,
  Permission.ReadCatalog,
  Permission.ReadAsset,
  Permission.ReadCollection,
  Permission.ReadFacet,
  Permission.ReadPaymentMethod,
  Permission.ReadShippingMethod,
  Permission.ReadCountry,
  Permission.ReadStockLocation,
];

export type AdminProvisionFormErrorKey =
  | 'firstName'
  | 'lastName'
  | 'emailAddress'
  | 'password'
  | 'roleCode'
  | 'channelIds'
  | 'permissions';

export type AdminProvisionFormErrors = Partial<Record<AdminProvisionFormErrorKey, string>>;

export type AdminProvisionValidationMessages = {
  firstNameRequired: string;
  lastNameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  roleCodeRequired: string;
  channelsRequired: string;
  permissionsRequired: string;
};

export type AdminProvisionFormValues = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  roleCode: string;
  channelIds: string[];
  permissions: Permission[];
  reuseExistingRole: boolean;
};

export const normalizeRoleCode = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');

export const getSelectedAssignablePermissions = (
  permissions: Permission[],
  assignablePermissions?: ReadonlySet<Permission>,
) => {
  if (!assignablePermissions) return permissions;
  return permissions.filter((permission) => assignablePermissions.has(permission));
};

export const validateAdminProvisionForm = (
  values: AdminProvisionFormValues,
  messages: AdminProvisionValidationMessages,
  assignablePermissions?: ReadonlySet<Permission>,
) => {
  const errors: AdminProvisionFormErrors = {};
  const normalizedRoleCode = normalizeRoleCode(values.roleCode);
  const selectedAssignablePermissions = getSelectedAssignablePermissions(values.permissions, assignablePermissions);

  if (!values.firstName.trim()) errors.firstName = messages.firstNameRequired;
  if (!values.lastName.trim()) errors.lastName = messages.lastNameRequired;
  if (!values.emailAddress.trim()) errors.emailAddress = messages.emailRequired;
  if (values.emailAddress.trim() && !values.emailAddress.includes('@')) {
    errors.emailAddress = messages.emailInvalid;
  }
  if (!values.password.trim()) errors.password = messages.passwordRequired;
  if (!normalizedRoleCode) errors.roleCode = messages.roleCodeRequired;

  if (!values.reuseExistingRole) {
    if (!values.channelIds.length) errors.channelIds = messages.channelsRequired;
    if (!selectedAssignablePermissions.length) {
      errors.permissions = messages.permissionsRequired;
    }
  }

  return {
    errors,
    normalizedRoleCode,
    selectedAssignablePermissions,
    valid: Object.keys(errors).length === 0,
  };
};
