import { IPermissionsModel, IPermissionsDocument } from './permissions-model';
import { IGroupsDocumnet } from './groups-model';
import {
  Document,
  Schema,
  Model,
  model,
  ModelUpdateOptions,
  Query,
  DocumentQuery,
  Types,
  Error,
  HookNextFunction
} from 'mongoose';
import { MongoError, ObjectID } from 'mongodb';

export interface IUserDocument extends Document {
  email: string;
  username: string;
  password?: string;
  displayName?: string;
  type?: string;
  deleted?: boolean;
  isActive?: boolean;
  isSuperUser?: boolean;
  groups: IGroupsDocumnet[];
  resetPassword?: { token: string; expires: Date } | {} ;
  refreshToken?: string;
  getAllPermissions(): IPermissionsDocument[];
  updateUser(): DocumentQuery<IUserDocument[], IUserDocument, {}>;
}

export interface UserQueryModel {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
}

export interface IUserModel extends Model<IUserDocument> {
  addUser(user: IUserDocument): Promise<IUserDocument>;
  updateUser(user: any): DocumentQuery<IUserDocument[], IUserDocument, {}>;
  changePassword(user: any): DocumentQuery<IUserDocument[], IUserDocument, {}>;
  getAllUsers(
    query: UserQueryModel
  ): DocumentQuery<IUserDocument[], IUserDocument, {}>;
  countUsers(query: UserQueryModel): Query<number>;
  getUserById(
    _id: string
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  getUserByUsername(
    username: string
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  softDelete(
    _id: string
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  // findUserByAuth( body:any ): DocumentQuery<IUserDocument | null, IUserDocument, {}> ;
  addSession(
    body: any,
    token: string
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  logout(token: string): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  generateResetPasswordToken(
    userName: string
  ): DocumentQuery<IUserDocument[], IUserDocument, {}>;
  changePasswordByToken(
    token: string,
    newPassword: string
  ): DocumentQuery<IUserDocument[], IUserDocument, {}>;
  getUserByToken(
    body: any
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  resetPasswordTokenExists(
    body: any
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
  getUserRefreshToken(
    body: any
  ): DocumentQuery<IUserDocument | null, IUserDocument, {}>;
}

export let UserSchema: Schema = new Schema(
  {
    email: String,
    username: { type: String, unique: true },
    password: String,
    displayName: String,
    type: String,
    deleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isSuperUser: { type: Boolean, default: false },
    resetPassword: { token: String, expires: Date },
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
    refreshToken: String
  },
  { timestamps: true, collation: { locale: 'en_US', strength: 2 } }
);

UserSchema.methods.getAllPermissions = function(): IPermissionsDocument[] {
  let permissions: IPermissionsDocument[] = [];
  (<IGroupsDocumnet[]> this.groups).forEach(group => {
    permissions.push(...group.permissions);
  });
  return permissions;
};

function duplicatesErrorHandller(
  error: MongoError,
  doc: IGroupsDocumnet,
  next: HookNextFunction
) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Duplicate Username'));
  } else {
    next(error);
  }
}

UserSchema.set('toJSON', {
  transform(doc: any, ret: any, opt: any) {
    delete ret.password;
    return ret;
  }
});

UserSchema.post('save', duplicatesErrorHandller);

UserSchema.statics.updateUser = function(
  user: IUserDocument
): DocumentQuery<IUserDocument | null, IUserDocument, {}>  {
  return (<IUserModel> this).findOneAndUpdate({ _id: user._id, deleted: false }, user,
    { new: false })
    .select('-refreshToken');
};

UserSchema.statics.addUser = function(user: any): Promise<IUserDocument> {
  return new UserModel(user).save();
};

UserSchema.statics.changePassword = function(
  user: any
): DocumentQuery<IUserDocument[], IUserDocument, {}> {
  return (<IUserModel> this).updateOne(
    { _id: user._id, deleted: false },
    { password: user.newPassword, refreshToken: '' }
  );
};

UserSchema.statics.changePasswordByToken = function(
  token: string,
  newPassword: string
): DocumentQuery<IUserDocument[], IUserDocument, {}> {
  console.log({ token, newPassword });
  return (<IUserModel> this).updateOne(
    {
      'resetPassword.token': token,
      'resetPassword.expires': { $gt: new Date() },
      deleted: false
    },
    { password: newPassword, refreshToken: '', resetPassword: {} }
  );
};

UserSchema.statics.generateResetPasswordToken = function(
  username: string
): DocumentQuery<IUserDocument[], IUserDocument, {}> {
  const token = new ObjectID();
  const expiryDate = new Date(
    new Date().getTime() + Number(process.env.RESET_PASSWORD_EXP_TIME)
  );

  return (<IUserModel> this).updateOne(
    { username, deleted: false },
    { resetPassword: { token, expires: expiryDate } }
  );
};

UserSchema.statics.softDelete = function(
  _id: string
): DocumentQuery<IUserDocument[], IUserDocument, {}> {
  return (<IUserModel> this).updateOne(
    { _id, deleted: false },
    { deleted: true }
  );
};

UserSchema.statics.getAllUsers = function(
  query: UserQueryModel
): DocumentQuery<IUserDocument[], IUserDocument, {}> {
  return (<IUserModel> this)
    .find({ deleted: false })
    .select('-refreshToken')
    .skip(Number(query.offset))
    .limit(Number(query.limit))
    .sort({
      [query.sortBy]: query.sortOrder
    })
    .populate({ path: 'groups', match: { deleted: { $ne: true } } });
};

UserSchema.statics.countUsers = function(query: UserQueryModel): Query<number> {
  return (<IUserModel> this).find({ deleted: false }).countDocuments();
};

UserSchema.statics.getUserById = function(
  _id: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return (<IUserModel> this).findOne({ _id, deleted: false }).select('-refreshToken').populate({
    path: 'groups',
    match: { deleted: { $ne: true } },
    populate: { path: 'permissions' }
  });
};

UserSchema.statics.getUserByUsername = function(
  username: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return (<IUserModel> this).findOne({ username, deleted: false }).populate({
    path: 'groups',
    match: { deleted: { $ne: true } },
    populate: { path: 'permissions' }
  });
};

/*
UserSchema.statics.findUserByAuth =  function( user : any): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return  (<IUserModel>this).findOne({username: user.username , deleted: false} ) ;
};
 */

UserSchema.statics.addSession = function(
  user: any,
  token: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {

  return (<IUserModel> this).findOneAndUpdate(
    { _id: user._id, deleted: false },
    { refreshToken : token },
    { new: true }
  );
};

UserSchema.statics.logout = function(
  _id: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return (<IUserModel> this).updateOne(
    { _id },
    { refreshToken: ''  }
  );
};

UserSchema.statics.getUserByToken = function(
  token: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return (<IUserModel> this)
    .findOne({
      refreshToken:token,
      deleted: false
    })
    .select('-refreshToken')
    .populate({ path: 'groups', populate: { path: 'permissions' } });
};


UserSchema.statics.resetPasswordTokenExists = function(
  token: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return (<IUserModel> this)
    .findOne({
      'resetPassword.token': token,
      deleted: false
    });
};



UserSchema.statics.getUserRefreshToken = function(
  _id: string
): DocumentQuery<IUserDocument | null, IUserDocument, {}> {
  return (<IUserModel> this)
    .findOne({
      _id ,
      deleted: false
    }, 'refreshToken -_id');
};


export const UserModel: IUserModel = model<IUserDocument, IUserModel>(
  'User',
  UserSchema
);
