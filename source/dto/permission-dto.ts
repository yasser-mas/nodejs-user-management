import { Expose } from 'class-transformer';

export class PermissionDto{
    @Expose({ name: 'name' })
    private _name: string;
    @Expose({ name: 'path' })
    private _path: string;
    @Expose({ name: 'method' })
    private _method: string;
    @Expose({ name: 'isDefault' })
    private _isDefault: boolean;
    
    
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
     * Getter path
     * @return {string}
     */
	public get path(): string {
		return this._path;
	}

    /**
     * Getter method
     * @return {string}
     */
	public get method(): string {
		return this._method;
	}

    /**
     * Getter isDefault
     * @return {boolean}
     */
	public get isDefault(): boolean {
		return this._isDefault;
	}

    /**
     * Setter name
     * @param {string} value
     */
	public set name(value: string) {
		this._name = value;
	}

    /**
     * Setter path
     * @param {string} value
     */
	public set path(value: string) {
		this._path = value;
	}

    /**
     * Setter method
     * @param {string} value
     */
	public set method(value: string) {
		this._method = value;
	}

    /**
     * Setter isDefault
     * @param {boolean} value
     */
	public set isDefault(value: boolean) {
		this._isDefault = value;
	}
    
}