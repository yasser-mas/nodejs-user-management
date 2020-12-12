import { IUserDocument } from '../models/users-model';
import { GroupDto } from './group-dto';
import { PermissionDto } from './permission-dto';
import { plainToClass } from 'class-transformer';

export class TokenPayload{

    _id: string ;
    username: string ;
    isSuperUser: boolean ;
    groups: GroupDto[] ;
    
    constructor(user : IUserDocument){
        this.username = user.username ;
        this.isSuperUser = (user.isSuperUser === true ) ;
        this._id = user.id ;
        this.groups = user.groups.map(g=>{
            let permissions: PermissionDto[]  = g.permissions.map(p=>{
                let permission:PermissionDto  = plainToClass(PermissionDto, {
                    name: p.name,
                    path: p.path,
                    method: p.method

                });

                return permission ; 
            });
            return plainToClass( GroupDto ,{
                name: g.name,
                permissions
            });
        })
    }

}