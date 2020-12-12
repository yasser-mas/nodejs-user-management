import {
  Document,
  Schema,
  Model,
  model,
  DocumentQuery,
  Query,
  HookNextFunction
} from 'mongoose';
import { IPermissionsDocument } from './permissions-model';
import { MongoError } from 'mongodb';

export interface IGroupsDocumnet extends Document {
  name: string;
  deleted: boolean;
  permissions: IPermissionsDocument[];
}

export interface GroupQueryModel {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
}

export interface IGroupsModel extends Model<IGroupsDocumnet> {
  getAllGroups(
    query: GroupQueryModel
  ): DocumentQuery<IGroupsDocumnet[], IGroupsDocumnet, {}>;
  addGroup(group: any): Promise<IGroupsDocumnet>;
  countGroups(query: GroupQueryModel): Query<number>;
  updateGroup(
    group: IGroupsDocumnet
  ): DocumentQuery<IGroupsDocumnet[], IGroupsDocumnet, {}>;
  getGroupById(
    _id: string
  ): DocumentQuery<IGroupsDocumnet | null, IGroupsDocumnet, {}>;
  getGroupByName(
    name: string
  ): DocumentQuery<IGroupsDocumnet | null, IGroupsDocumnet, {}>;
  softDelete(
    _id: string
  ): DocumentQuery<IGroupsDocumnet | null, IGroupsDocumnet, {}>;
}

export let GroupsSchema: Schema = new Schema(
  {
    name: { type: String, unique: true },
    deleted: { type: Boolean, default: false },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
  },
  { timestamps: true, collation: { locale: 'en_US', strength: 2 } }
);

function duplicatesErrorHandller(
  error: MongoError,
  doc: IGroupsDocumnet,
  next: HookNextFunction
) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Duplicate Group Name'));
  } else {
    next(error);
  }
}

GroupsSchema.post('save', duplicatesErrorHandller);

GroupsSchema.post('updateOne', duplicatesErrorHandller);

GroupsSchema.statics.addGroup = function(group: any): Promise<IGroupsDocumnet> {
  return new GroupsModel(group).save();
};

GroupsSchema.statics.updateGroup = function(
  group: IGroupsDocumnet
): DocumentQuery<IGroupsDocumnet | null, IGroupsDocumnet , {}> {
  return (<IGroupsModel> this).findOneAndUpdate(
    { _id: group._id, deleted: false },
    group
  );
};

GroupsSchema.statics.softDelete = function(
  _id: string
): DocumentQuery<IGroupsDocumnet[], IGroupsDocumnet, {}> {
  return (<IGroupsModel> this).updateOne(
    { _id, deleted: false },
    { deleted: true }
  );
};

GroupsSchema.statics.getAllGroups = function(
  query: GroupQueryModel
): DocumentQuery<IGroupsDocumnet[], IGroupsDocumnet, {}> {
  return (<IGroupsModel> this)
    .find({ deleted: false })
    .skip(Number(query.offset))
    .limit(Number(query.limit))
    .sort({
      [query.sortBy]: query.sortOrder
    })
    .populate({ path: 'permissions' });
};

GroupsSchema.statics.countGroups = function(
  query: GroupQueryModel
): Query<number> {
  return (<IGroupsModel> this).find({ deleted: false }).countDocuments();
};

GroupsSchema.statics.getGroupById = function(
  _id: string
): DocumentQuery<IGroupsDocumnet | null, IGroupsDocumnet, {}> {
  return (<IGroupsModel> this)
    .findOne({ _id, deleted: false })
    .populate({ path: 'permissions' });
};

GroupsSchema.statics.getGroupByName = function(
  name: string
): DocumentQuery<IGroupsDocumnet | null, IGroupsDocumnet, {}> {
  return (<IGroupsModel> this).findOne({ name, deleted: false });
};

export const GroupsModel: IGroupsModel = model<IGroupsDocumnet, IGroupsModel>(
  'Group',
  GroupsSchema
);
