import { CentralizedError } from "./CentralizedError";

// message: string, statusCode: number, typeOfError: string, details: any, cause: any

export class DatabaseError extends CentralizedError {
    constructor(message: string, cause: any, typeOfError?: string) {
        // if (details) details = { ...details, error_msg: cause.message, error_stack: cause.stack };
        super(message, 500, typeOfError || 'DataBaseError', cause, cause);
    }
}

export class ControllerError extends CentralizedError {
    constructor(message: string, cause: any, typeOfError?: string) {
        super(message, 404, typeOfError || 'ControllerError', cause, cause);
    }
}

export class ValidationError extends CentralizedError {
    constructor(message: string, cause: any, typeOfError?: string) {
        super(message, 400, typeOfError || 'ValidationError', cause, cause);
    }
}

export class ExternalApi extends CentralizedError {
    constructor(message: string, cause: any, typeOfError?: string) {
        super(message, 404, typeOfError || 'ExternalApi', cause, cause);
    }
}

export class AuthError extends CentralizedError {
    constructor(message: string, cause: any, typeOfError?: string) {
        super(message, 401, typeOfError || 'AuthError', cause, cause);
    }
}

export class EmailError extends CentralizedError {
    constructor(message: string, cause: any, typeOfError?: string) {
        super(message, 500, typeOfError || 'EmailError', cause, cause);
    }
}
