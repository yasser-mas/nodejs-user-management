import { Expose } from 'class-transformer';
import { PermissionDto } from './permission-dto';




export class GroupDto{
    @Expose({ name: 'name' })
    private _name: string;
    @Expose({ name: 'deleted' })
    private _deleted: boolean;
    @Expose({ name: 'permissions' })
    private _permissions: PermissionDto[];
  
    
    
    constructor(){
    }


    /**
     * Getter name
     * @return {string}
     */

	public get name(): string {
		return this._name;
	}

    /**
     * Getter deleted
     * @return {boolean}
     */
	public get deleted(): boolean {
		return this._deleted;
	}

    /**
     * Getter permissions
     * @return {PermissionDto[]}
     */
	public get permissions(): PermissionDto[] {
		return this._permissions;
	}

    /**
     * Setter name
     * @param {string} value
     */
	public set name(value: string) {
		this._name = value;
	}

    /**
     * Setter deleted
     * @param {boolean} value
     */
	public set deleted(value: boolean) {
		this._deleted = value;
	}

    /**
     * Setter permissions
     * @param {PermissionDto[]} value
     */
	public set permissions(value: PermissionDto[]) {
		this._permissions = value;
	}

}