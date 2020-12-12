import { Expose } from 'class-transformer';
import { GroupDto } from './group-dto';

export class UserDto{

    @Expose({ name: 'email' })
    private _email: string;

    @Expose({ name: 'username' })
    private _username: string;

    @Expose({ name: 'password' })
    private _password: string;

    @Expose({ name: 'displayName' })
    private _displayName: string;

    @Expose({ name: 'type' })
    private _type: string;

    @Expose({ name: 'deleted' })
    private _deleted: boolean;

    @Expose({ name: 'isActive' })
    private _isActive: boolean;

    @Expose({ name: 'isSuperUser' })
    private _isSuperUser: boolean;

    @Expose({ name: 'groups' })
    private _groups: GroupDto[];

    @Expose({ name: 'resetPassword' })
    private _resetPassword: { token: string; expires: Date } | {} ;

    @Expose({ name: 'activeSessions' })
    private _activeSessions: [{ token: string; expires: Date }] | [];
  
    constructor(){

    }

    /**
     * Getter email
     * @return {string}
     */
	public get email(): string {
		return this._email;
	}

    /**
     * Getter username
     * @return {string}
     */
	public get username(): string {
		return this._username;
	}

    /**
     * Getter password
     * @return {string}
     */
	public get password(): string {
		return this._password;
	}

    /**
     * Getter displayName
     * @return {string}
     */
	public get displayName(): string {
		return this._displayName;
	}

    /**
     * Getter type
     * @return {string}
     */
	public get type(): string {
		return this._type;
	}

    /**
     * Getter deleted
     * @return {boolean}
     */
	public get deleted(): boolean {
		return this._deleted;
	}

    /**
     * Getter isActive
     * @return {boolean}
     */
	public get isActive(): boolean {
		return this._isActive;
	}

    /**
     * Getter isSuperUser
     * @return {boolean}
     */
	public get isSuperUser(): boolean {
		return this._isSuperUser;
	}

    /**
     * Getter groups
     * @return {GroupDto[]}
     */
	public get groups(): GroupDto[] {
		return this._groups;
	}

    /**
     * Setter email
     * @param {string} value
     */
	public set email(value: string) {
		this._email = value;
	}

    /**
     * Setter username
     * @param {string} value
     */
	public set username(value: string) {
		this._username = value;
	}

    /**
     * Setter password
     * @param {string} value
     */
	public set password(value: string) {
		this._password = value;
	}

    /**
     * Setter displayName
     * @param {string} value
     */
	public set displayName(value: string) {
		this._displayName = value;
	}

    /**
     * Setter type
     * @param {string} value
     */
	public set type(value: string) {
		this._type = value;
	}

    /**
     * Setter deleted
     * @param {boolean} value
     */
	public set deleted(value: boolean) {
		this._deleted = value;
	}

    /**
     * Setter isActive
     * @param {boolean} value
     */
	public set isActive(value: boolean) {
		this._isActive = value;
	}

    /**
     * Setter isSuperUser
     * @param {boolean} value
     */
	public set isSuperUser(value: boolean) {
		this._isSuperUser = value;
	}

    /**
     * Setter groups
     * @param {GroupDto[]} value
     */
	public set groups(value: GroupDto[]) {
		this._groups = value;
	}
    
}