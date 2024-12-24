# Project H Backend

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14+)
- **MongoDB** (locally or via a service like MongoDB Atlas)

---

## Getting Started

Follow these steps to set up the project:

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/SHIVAM-KUMAR-59/Project-H-Backend.git
```

### 2. Install Dependencies

Navigate into the project directory and install all required dependencies:

```bash
npm install
```

### 3. Run the Application

Start the application using the following command:

```bash
node index.js
```

## Tasks

### ✅ 1. Create Schemas

- [x] Design and implement Mongoose schema for **User**:

- [x] Design and implement Mongoose schema for **Post**:

- [x] Design and implement Mongoose schema for **Job**:

- [x] Design and implement Mongoose schema for **Comment**:

---

### 2. Create Routes

### Auth Routes

- [ ] `POST /auth/register` - Register a new user.
- [ ] `POST /auth/login` - Authenticate and log in a user.
- [ ] `POST /auth/verify-otp` - Otp Verification.
- [ ] `POST /auth/resent-otp` - Resent Otp

#### User Routes

- [ ] `GET /users/:id` - Get user details by ID.
- [ ] `PUT /users/:id` - Update user profile.
- [ ] `DELETE /users/:id` - Delete a user.
- [ ] `POST /users/:id/follow` - Follow another user.
- [ ] `POST /users/:id/unfollow` - Unfollow a user.
- [ ] `GET /users/:id/followers` - Get a user's followers list.
- [ ] `GET /users/:id/following` - Get a user's following list.

#### Post Routes

- [ ] `POST /posts` - Create a new post.
- [ ] `GET /posts` - Get all posts.
- [ ] `GET /posts/:id` - Get a post by ID.
- [ ] `PUT /posts/:id` - Update a post.
- [ ] `DELETE /posts/:id` - Delete a post.
- [ ] `POST /posts/:id/like` - Like a post.
- [ ] `POST /posts/:id/unlike` - Unlike a post.
- [ ] `POST /posts/:id/comment` - Add a comment to a post.
- [ ] `GET /posts/:id/comments` - Get all comments for a post.

#### Job Routes

- [ ] `POST /jobs` - Create a new job posting.
- [ ] `GET /jobs` - Get all job postings.
- [ ] `GET /jobs/:id` - Get a job by ID.
- [ ] `PUT /jobs/:id` - Update a job posting.
- [ ] `DELETE /jobs/:id` - Delete a job posting.
- [ ] `POST /jobs/:id/apply` - Apply for a job.
- [ ] `GET /jobs/:id/applicants` - Get a list of applicants for a job.

---

### 3. Test Routes

- [ ] Test all the routes using **Postman** or similar API testing tools.

---

## Schema Diagram:

<img src="./Project-H-Backend.png" style="border-radius: 8px;"></img>

## User Flow:

<img src="./User-Flow.png" style="border-radius: 8px;"></img>

## Authentication 
Added user registration functionality with enhanced password validation and OTP email verification.

- Implemented password validation ensuring at least one uppercase, one lowercase, one digit, one special character, and length between 8-20 characters.
- Integrated OTP generation and email functionality using **nodemailer** to verify user email addresses.
- Stored OTP temporarily for email verification.
- Applied **bcrypt** for password hashing.
- Return appropriate status codes and messages for successful registration or validation errors.
- Generate JWT Token using **jsonwebtoken** .
