import { Document, Schema, Model, model, DocumentQuery } from 'mongoose';

export interface IPermissionsDocument extends Document {
  name: string;
  path: string;
  method: string;
  isDefault: boolean;
}

export interface IPermissionsModel extends Model<IPermissionsDocument> {
  getAllPermissions(): DocumentQuery<
    IPermissionsDocument[],
    IPermissionsDocument,
    {}
  >;
}

export let PermissionsSchema: Schema = new Schema({
  name: String,
  path: String,
  method: String,
  isDefault: Boolean
});

PermissionsSchema.statics.getAllPermissions = function(): DocumentQuery<
  IPermissionsDocument[],
  IPermissionsDocument,
  {}
> {
  return (<IPermissionsModel>this).find();
};

export const PermissionsModel: IPermissionsModel = model<
  IPermissionsDocument,
  IPermissionsModel
>('Permission', PermissionsSchema);
