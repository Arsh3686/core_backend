export class CentralizedError extends Error {
    statusCode?: number
    details?: any
    typeOfError?: string

    constructor(message: string, statusCode: number, typeOfError: string, details: any, cause: any) {
        super(message, { cause: cause }); // For Error Class message method
        this.details = process.env.NODE_ENV === 'DEV' ? details : 'Something went wrong';
        this.statusCode = statusCode || 404; // by default 404
        this.typeOfError = typeOfError; // DatabaseError ,ValidationError, AuthError, ExternalApi Error
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name; // 
    }
}