import { IPermissionsDocument } from '../models/permissions-model';

export let PermissionsList = {
  permissions: [],

  getPermissionsList(): IPermissionsDocument[] {
    return this.permissions;
  },
  setPermissionsList(permissions: any) {
    this.permissions = permissions;
  }
};
