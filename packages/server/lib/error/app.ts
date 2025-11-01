enum AppErrorKind {
    Internal = 'internal',
    Validation = 'validation',
    NotFound = 'not_found',
    Unauthorized = 'unauthorized',
    Unprocessable = 'unprocessable',
    BadRequest = 'bad_request',
    Conflict = 'conflict',
}

type AppErrorOptions = {
    code?: string
    cause?: unknown
}

export class AppError extends Error {
    private kind: AppErrorKind
    private code?: string

    constructor(
        message: string,
        kind = AppErrorKind.Internal,
        opts?: AppErrorOptions
    ) {
        super(message, { cause: opts?.cause })
        this.kind = kind
        this.code = opts?.code

        Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
        Error.captureStackTrace(this)
    }

    getKind() {
        return this.kind
    }

    getCode() {
        return this.code
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code,
        }
    }

    toObject() {
        return {
            message: this.message,
            code: this.code,
            kind: this.kind,
            stack: this.stack,
        }
    }

    static Internal(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.Internal, opts)
    }
    static Validation(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.Validation, opts)
    }
    static NotFound(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.NotFound, opts)
    }
    static Unauthorized(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.Unauthorized, opts)
    }
    static Unprocessable(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.Unprocessable, opts)
    }
    static BadRequest(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.BadRequest, opts)
    }
    static Conflict(message: string, opts?: AppErrorOptions) {
        return new AppError(message, AppErrorKind.Conflict, opts)
    }
}

export const AppErrorKindToStatusCode: Record<AppErrorKind, number> = {
    [AppErrorKind.Internal]: 500,
    [AppErrorKind.Validation]: 400,
    [AppErrorKind.NotFound]: 404,
    [AppErrorKind.Unauthorized]: 401,
    [AppErrorKind.Unprocessable]: 422,
    [AppErrorKind.BadRequest]: 400,
    [AppErrorKind.Conflict]: 409,
}
