export interface ErrorObject {

    code: number | string;
    message: string;
}

export default class HTTPErrorResponse {

    public code = 500;
    public message = 'Error';
    public object: { errors?: ErrorObject[] } = {};
    constructor(errors: ErrorObject[]) {
        this.object.errors = errors;
    }
}
