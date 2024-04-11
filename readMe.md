# User Registration API

This API provides endpoints for user registration, email verification, and OTP (One Time Password) generation.

## Routes

### GET /

- **Purpose**: Retrieve all user details.
- **Description**: This route returns a list of all users registered in the system.
- **Method**: GET
- **Path**: `/v1/api/signup`
- **Response**: Returns an array of user objects containing user details.

### POST /signup

- **Purpose**: User registration.
- **Description**: Registers a new user in the system.
- **Method**: POST
- **Path**: `/v1/api/signup`
- **Request Body**:
  - `firstName`: First name of the user.
  - `lastName`: Last name of the user.
  - `email`: Email address of the user.
  - `location`: Location of the user.
  - `userName`: Username chosen by the user.
  - `password`: Password chosen by the user.
  - `repassword`: Confirmation of the password chosen by the user.
- **Response**: 
  - `201 Created`: If the user registration is successful.
  - `400 Bad Request`: If the provided email already exists or if the passwords do not match.
  - `500 Internal Server Error`: If there is an internal server error.

### POST /signup/send-otp

- **Purpose**: Send OTP for email verification.
- **Description**: Sends an OTP (One Time Password) to the user's email address for email verification.
- **Method**: POST
- **Path**: `/v1/api/signup/send-otp`
- **Request Body**:
  - `email`: Email address of the user.
- **Response**:
  - `200 OK`: If the OTP is successfully sent to the user's email.
  - `404 Not Found`: If the user does not exist with the provided email.
  - `500 Internal Server Error`: If there is an internal server error.

### POST /signup/verify

- **Purpose**: Verify user email with OTP.
- **Description**: Verifies the user's email address using the OTP provided.
- **Method**: POST
- **Path**: `/signup/verify`
- **Request Body**:
  - `email`: Email address of the user.
  - `otp`: One Time Password (OTP) sent to the user's email.
- **Response**:
  - `200 OK`: If the email is successfully verified.
  - `400 Bad Request`: If the OTP is invalid.
  - `500 Internal Server Error`: If there is an internal server error.

------

# User Authentication API

This API provides endpoints for user authentication, including user sign-in and token generation.

## Routes

### POST /

- **Purpose**: User authentication (Sign-in).
- **Description**: Authenticates the user by checking the provided email and password against the stored credentials.
- **Method**: POST
- **Path**: `/v1/api/signin`
- **Request Body**:
  - `email`: Email address of the user.
  - `password`: Password provided by the user.
- **Response**:
  - `200 OK`: If the user is authenticated successfully. Returns a JWT token in the response body.
  - `401 Unauthorized`: If the provided email or password is incorrect.
  - `500 Internal Server Error`: If there is an internal server error.


-------

# User Authentication and Password Reset API

This API provides endpoints for user authentication and password reset functionality.

## Routes

### POST /forgot-password

- **Purpose**: Request Password Reset.
- **Description**: Sends an OTP (One Time Password) to the user's email address for password reset.
- **Method**: POST
- **Path**: `/v1/api/reset/forgot-password`
- **Request Body**:
  - `email`: Email address of the user.
- **Response**:
  - `200 OK`: If the OTP is successfully sent to the user's email for password reset.
  - `404 Not Found`: If the user does not exist with the provided email.
  - `500 Internal Server Error`: If there is an internal server error.

### POST /verify-otp

- **Purpose**: Verify OTP for Password Reset.
- **Description**: Verifies the OTP (One Time Password) provided by the user for password reset.
- **Method**: POST
- **Path**: `/v1/api/reset/verify-otp`
- **Request Body**:
  - `email`: Email address of the user.
  - `otp`: One Time Password (OTP) sent to the user's email.
- **Response**:
  - `200 OK`: If the OTP is successfully verified.
  - `400 Bad Request`: If the OTP is invalid.
  - `500 Internal Server Error`: If there is an internal server error.

### POST /reset-password

- **Purpose**: Reset Password.
- **Description**: Resets the user's password using the OTP (One Time Password) verified and provided by the user.
- **Method**: POST
- **Path**: `/v1/api/reset/reset-password`
- **Request Body**:
  - `email`: Email address of the user.
  - `newPassword`: New password chosen by the user.
- **Response**:
  - `200 OK`: If the password is successfully reset.
  - `500 Internal Server Error`: If there is an internal server error.

### POST /reset-pass

- **Purpose**: Reset Password (with OTP).
- **Description**: Resets the user's password using the OTP (One Time Password) and email provided by the user.
- **Method**: POST
- **Path**: `/v1/api/reset/reset-pass`
- **Request Body**:
  - `email`: Email address of the user.
  - `otp`: One Time Password (OTP) sent to the user's email.
  - `newPassword`: New password chosen by the user.
- **Response**:
  - `200 OK`: If the password is successfully reset.
  - `400 Bad Request`: If the OTP is invalid.
  - `500 Internal Server Error`: If there is an internal server error.

------

# validateUser Middleware

The `validateUser` middleware is used to validate user input during user registration.

```javascript
const { validateUser } = require('./middleware/validateUser');

// Example route handler
app.post('/register', validateUser, (req, res) => {
  // Process user registration
});
```

--------

# Mongoose Models

## OTP Model

The OTP (One Time Password) model is used to store temporary OTPs generated for password reset functionality.

### Schema

The OTP schema consists of the following fields:

- `email`: The email address associated with the OTP.
- `otp`: The One Time Password generated for password reset.
- `createdAt`: The timestamp indicating when the OTP was created. The OTP expires after 10 minutes (600 seconds).

## SignUp Model
The SignUp model is used to store user registration data.

### Schema
The SignUp schema consists of the following fields:

- `firstName`: The first name of the user.
- `lastName`: The last name of the user.
- `email`: The email address of the user.
- `location`: The location of the user.
- `userName`: The username chosen by the user.
- `password`: The password chosen by the user.
- `verified`: A boolean flag indicating whether the user's email address is verified or not.
- `createdAt` and updatedAt: Timestamps indicating when the user data was created and last updated.

----
