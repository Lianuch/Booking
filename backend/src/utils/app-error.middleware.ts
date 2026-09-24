export class AppError extends Error {
  statusCode: number;
  errors: string[];

constructor(statusCode: number, message: string, errors = []){
  super(message);
  this.statusCode = statusCode;
  this.errors = errors;
}

  static UnauthorizedError(){
    return new AppError(401, "User is not authorized");
  }
  static BadRequest(message: string, errors = []){
    return new AppError(400, message, errors);
  }
  static ForbiddenError(){
    return new AppError(403, "User is not allowed to perform this action");
  }

}