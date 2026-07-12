import { Permission } from '@deenruv/admin-types';
import { describe, expect, it } from 'vitest';

import {
  getSelectedAssignablePermissions,
  normalizeRoleCode,
  SHOP_MANAGER_ROLE_PERMISSIONS,
  validateAdminProvisionForm,
  type AdminProvisionValidationMessages,
} from './Provision.logic';

const messages: AdminProvisionValidationMessages = {
  firstNameRequired: 'first name required',
  lastNameRequired: 'last name required',
  emailRequired: 'email required',
  emailInvalid: 'email invalid',
  passwordRequired: 'password required',
  roleCodeRequired: 'role code required',
  channelsRequired: 'channels required',
  permissionsRequired: 'permissions required',
};

const validForm = {
  firstName: 'Anna',
  lastName: 'Kowalska',
  emailAddress: 'anna@example.com',
  password: 'secret',
  roleCode: 'shop-manager',
  channelIds: ['1'],
  permissions: SHOP_MANAGER_ROLE_PERMISSIONS,
  reuseExistingRole: false,
};

describe('admin provisioning logic', () => {
  it('normalizes role codes for backend-safe role lookup and creation', () => {
    expect(normalizeRoleCode(' Shop Manager ')).toBe('shop-manager');
    expect(normalizeRoleCode('B2B   Manager')).toBe('b2b-manager');
  });

  it('defines the shop-manager preset without admin/settings/system permissions', () => {
    expect(SHOP_MANAGER_ROLE_PERMISSIONS).toEqual([
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
    ]);
    expect(SHOP_MANAGER_ROLE_PERMISSIONS).not.toEqual(
      expect.arrayContaining([
        Permission.ReadAdministrator,
        Permission.CreateAdministrator,
        Permission.ReadSettings,
        Permission.UpdateGlobalSettings,
        Permission.ReadSystem,
        Permission.DeleteOrder,
      ]),
    );
  });

  it('filters selected permissions to assignable permissions before submission', () => {
    expect(
      getSelectedAssignablePermissions(
        [Permission.ReadOrder, Permission.SuperAdmin, Permission.UpdateOrder],
        new Set([Permission.ReadOrder, Permission.UpdateOrder]),
      ),
    ).toEqual([Permission.ReadOrder, Permission.UpdateOrder]);
  });

  it('accepts a complete new-role provisioning form', () => {
    const result = validateAdminProvisionForm(validForm, messages);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.normalizedRoleCode).toBe('shop-manager');
    expect(result.selectedAssignablePermissions).toBe(SHOP_MANAGER_ROLE_PERMISSIONS);
  });

  it('requires account, role, channels and permissions when creating a new role', () => {
    const result = validateAdminProvisionForm(
      {
        firstName: '',
        lastName: '',
        emailAddress: 'not-an-email',
        password: '',
        roleCode: '   ',
        channelIds: [],
        permissions: [],
        reuseExistingRole: false,
      },
      messages,
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      firstName: messages.firstNameRequired,
      lastName: messages.lastNameRequired,
      emailAddress: messages.emailInvalid,
      password: messages.passwordRequired,
      roleCode: messages.roleCodeRequired,
      channelIds: messages.channelsRequired,
      permissions: messages.permissionsRequired,
    });
  });

  it('ignores channel and permission validation when reusing an existing role', () => {
    const result = validateAdminProvisionForm(
      {
        ...validForm,
        channelIds: [],
        permissions: [],
        reuseExistingRole: true,
      },
      messages,
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('fails new-role validation when selected permissions are not assignable', () => {
    const result = validateAdminProvisionForm(
      {
        ...validForm,
        permissions: [Permission.SuperAdmin],
      },
      messages,
      new Set([Permission.ReadOrder]),
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ permissions: messages.permissionsRequired });
    expect(result.selectedAssignablePermissions).toEqual([]);
  });
});
