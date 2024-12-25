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

### ✅ Auth Routes

- [x] `POST /auth/register` - Register a new user.
- [x] `POST /auth/login` - Authenticate and log in a user.
- [x] `POST /auth/verify-otp` - Otp Verification.
- [x] `POST /auth/resent-otp` - Resent Otp

#### User Routes

- [x] `GET /users/:id` - Get user details by ID.
- [ ] `PATCH /users/:id` - Update user profile.
- [x] `DELETE /users/:id` - Delete a user.
- [ ] `POST /users/:id/follow-unfollow` - Follow or Unfollow a user.
- [ ] `GET /users/:id/followers` - Get a user's followers list.
- [ ] `GET /users/:id/following` - Get a user's following list.

#### Post Routes

- [ ] `POST /posts` - Create a new post.
- [x] `GET /posts` - Get all posts.
- [x] `GET /posts/:id` - Get a post by ID.
- [ ] `PATCH /posts/:id` - Update a post.
- [ ] `DELETE /posts/:id` - Delete a post.
- [ ] `POST /posts/:id/like-unlike` - Like or Unlike a post.
- [ ] `POST /posts/:id/comment` - Add a comment to a post.
- [ ] `GET /posts/:id/comments` - Get all comments for a post.

#### ✅ Job Routes

- [x] `POST /jobs` - Create a new job posting.
- [x] `GET /jobs` - Get all job postings.
- [x] `GET /jobs/:id` - Get a job by ID.
- [x] `PATCH /jobs/:id` - Update a job posting.
- [x] `DELETE /jobs/:id` - Delete a job posting.
- [x] `POST /jobs/:id/apply` - Apply for a job.
- [x] `GET /jobs/:id/applicants` - Get a list of applicants for a job.

#### Comment Routes

- [ ] `GET /comments/:id` - Get a comment by ID.
- [ ] `PATCH /comments/:id` - Update a comment.
- [ ] `DELETE /comments/:id` - Delete a comment.
- [ ] `POST /comments/:id/reply` - Reply to a comment.
- [ ] `GET /comments/:id/replies` - Get all replies for a comment.

---

### 3. Test Routes

- [ ] Test all the routes using **Postman** or similar API testing tools.

---

## Schema Diagram:

<img src="./Project-H-Backend.png" style="border-radius: 8px;"></img>

## User Flow:

<img src="./User-Flow.png" style="border-radius: 8px;"></img>
