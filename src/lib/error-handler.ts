// Shared error handling across domains

export interface ApiError {
  id: string;
  message: string;
  statusCode: number;
  feedback?: string;
  errors?: Record<string, string>;
  data?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public feedback?: string,
    public errors?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(error: any): ApiError {
    return new ApiError(
      error.statusCode || 500,
      error.message || 'Unknown error',
      error.feedback,
      error.errors
    );
  }

  static fromCognitoError(error: any): ApiError {
    switch (error.name) {
      case 'NotAuthorizedException':
        return new ApiError(401, 'Invalid or expired token');
      case 'UserNotConfirmedException':
        return new ApiError(400, 'User account not confirmed');
      case 'UserNotFoundException':
        return new ApiError(404, 'User not found');
      case 'TooManyRequestsException':
        return new ApiError(429, 'Too many requests. Please try again later');
      case 'UsernameExistsException':
        return new ApiError(409, 'User already exists');
      case 'InvalidParameterException':
        return new ApiError(400, 'Invalid parameter provided');
      case 'PasswordResetRequiredException':
        return new ApiError(400, 'Password reset required');
      default:
        return ApiError.fromResponse(error);
    }
  }
} 