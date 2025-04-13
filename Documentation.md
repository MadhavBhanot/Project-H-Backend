# Social Media Platform API Documentation

## 📌 Overview

This is the backend API documentation for a comprehensive social media platform. The API provides endpoints for user authentication, profile management, posts, comments, job postings, and AWS integrations.

---

## 🔗 Base URL

```
http://localhost:5001/api
```

## Contents

- **[Authentication](#🔒-authentication)**
- **[User Endpoints](#👤-user-endpoints)**
- **[Post Endpoints](#📝-post-endpoints)**
- **[Comment Endpoints](#💬-comment-endpoints)**
- **[Job Endpoints](#💼-job-endpoints)**
- **[AWS Endpoints](#☁️-aws-endpoints)**

---

## 🔒 Authentication

All protected endpoints require authentication using Clerk. Authentication is handled via JWT bearer tokens.

**Example:**

```
Authorization: Bearer <your_jwt_token>
```

---

## 🚪 Authentication Endpoints

### POST `/auth/login`

**Description:** User login with email and password.

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**

- `200`: Successful login
- `401`: Unauthorized

---

### POST `/auth/google`

**Description:** Google OAuth login.

**Request Body:**

```json
{
  "token": "string"
}
```

**Responses:**

- `200`: Successful Google login
- `400`: Invalid token

---

### POST `/auth/github`

**Description:** GitHub OAuth login.

**Request Body:**

```json
{
  "token": "string"
}
```

**Responses:**

- `200`: Successful GitHub login
- `400`: Invalid token

---

## 👤 User Endpoints

### GET `/users/{id}`

**Description:** Get user by ID.

**Parameters:**

- `id` (path): User ID

**Responses:**

- `200`: User details retrieved successfully
- `404`: User not found

---

### DELETE `/users/{id}`

**Description:** Delete user.

**Parameters:**

- `id` (path): User ID

**Responses:**

- `200`: User deleted successfully
- `404`: User not found

---

### PATCH `/users/{id}`

**Description:** Update user profile.

**Parameters:**

- `id` (path): User ID

**Request Body:**

```json
{
  "username": "string",
  "profilePicture": "string"
}
```

**Responses:**

- `200`: Profile updated successfully
- `400`: Invalid update data

---

### POST `/users/follow/{id}`

**Description:** Follow or unfollow a user.

**Parameters:**

- `id` (path): User ID to follow/unfollow

**Responses:**

- `200`: Follow/unfollow action successful
- `404`: User not found

---

### GET `/users/followers/{id}`

**Description:** Get user's followers list.

**Parameters:**

- `id` (path): User ID

**Responses:**

- `200`: Followers list retrieved successfully
- `404`: User not found

---

### GET `/users/following/{id}`

**Description:** Get user's following list.

**Parameters:**

- `id` (path): User ID

**Responses:**

- `200`: Following list retrieved successfully
- `404`: User not found

---

### GET `/users/discover/{id}`

**Description:** Discover new people.

**Parameters:**

- `id` (path): User ID

**Responses:**

- `200`: Discovered people retrieved successfully

---

### POST `/users/toggleBlock/{id}`

**Description:** Block or unblock a user.

**Parameters:**

- `id` (path): User ID to block/unblock

**Responses:**

- `200`: Block/Unblock action successful
- `404`: User not found
- `500`: Internal Server Error

---

### GET `/users/suggested`

**Description:** Get suggested users.

**Responses:**

- `200`: Users fetched successfully
- `500`: Internal Server Error

---

## 📝 Post Endpoints

### POST `/posts/create`

**Description:** Create a new post.

**Request Body:**

```
multipart/form-data
```

**Form Fields:**

- `image`: File (binary)
- `content`: Post content (string)

**Responses:**

- `201`: Post created successfully
- `400`: Bad request

---

### GET `/posts/all`

**Description:** Get all posts.

**Responses:**

- `200`: List of all posts

---

### GET `/posts/user/{userId}`

**Description:** Get posts for a specific user.

**Parameters:**

- `userId` (path): User ID

**Responses:**

- `200`: List of posts for the user

---

### GET `/posts/{id}`

**Description:** Get a specific post by ID.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: Post details

---

### DELETE `/posts/{id}`

**Description:** Delete a post by ID.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: Post deleted successfully
- `403`: Unauthorized

---

### PATCH `/posts/{id}`

**Description:** Update a post by ID.

**Parameters:**

- `id` (path): Post ID

**Request Body:**

```json
{
  "content": "string"
}
```

**Responses:**

- `200`: Post updated successfully
- `403`: Unauthorized

---

### GET `/posts/search`

**Description:** Search posts by category.

**Parameters:**

- `category` (query): Category to search for

**Responses:**

- `200`: List of matching posts

---

### POST `/posts/like/{id}`

**Description:** Like or unlike a post.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: Post like status updated

---

### GET `/posts/like/{id}`

**Description:** Get all likes for a post.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: List of users who liked the post

---

### POST `/posts/save/{id}`

**Description:** Save or unsave a post.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: Post saved/unsaved

---

### GET `/posts/comment/{id}`

**Description:** Get all comments for a post.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: List of comments

---

### POST `/posts/comment/{id}`

**Description:** Add a comment to a post.

**Parameters:**

- `id` (path): Post ID

**Request Body:**

```json
{
  "comment": "string"
}
```

**Responses:**

- `201`: Comment added successfully

---

### GET `/posts/feed/home/{id}`

**Description:** Get Home Feed.

**Parameters:**

- `id` (path): User ID
- `page` (query): Page number
- `limit` (query): Number of items per page

**Responses:**

- `200`: Home feed returned successfully

---

### GET `/posts/feed/explore/{id}`

**Description:** Get Explore Feed.

**Parameters:**

- `id` (path): User ID
- `page` (query): Page number
- `limit` (query): Number of items per page

**Responses:**

- `200`: Explore feed returned successfully

---

### PATCH `/posts/view/{id}`

**Description:** Increase the view count of a post.

**Parameters:**

- `id` (path): Post ID

**Responses:**

- `200`: Views updated successfully
- `404`: Post not found
- `500`: Internal Server Error

---

## 💬 Comment Endpoints

### GET `/comments/{id}`

**Description:** Get comment by ID.

**Parameters:**

- `id` (path): Comment ID

**Responses:**

- `200`: Comment retrieved successfully
- `404`: Comment not found

---

### PATCH `/comments/{id}`

**Description:** Update a comment.

**Parameters:**

- `id` (path): Comment ID

**Request Body:**

```json
{
  "content": "string"
}
```

**Responses:**

- `200`: Comment updated successfully
- `404`: Comment not found

---

### DELETE `/comments/{id}`

**Description:** Delete a comment.

**Parameters:**

- `id` (path): Comment ID

**Responses:**

- `200`: Comment deleted successfully
- `404`: Comment not found

---

### POST `/comments/{id}/reply`

**Description:** Reply to a comment.

**Parameters:**

- `id` (path): Comment ID

**Request Body:**

```json
{
  "content": "string"
}
```

**Responses:**

- `201`: Reply added successfully
- `404`: Parent comment not found

---

### POST `/comments/{id}/replies`

**Description:** Get all replies for a comment.

**Parameters:**

- `id` (path): Comment ID

**Request Body:**

```json
{
  "content": "string"
}
```

**Responses:**

- `200`: Comment Replies Retrieved Successfully
- `404`: Comment not found

---

## 💼 Job Endpoints

### POST `/jobs/create-job`

**Description:** Create a new job posting.

**Request Body:**

```
multipart/form-data
```

**Form Fields:**

- `imageURL`: File (binary)
- `title`: Job title (string)
- `description`: Job description (string)

**Responses:**

- `201`: Job created successfully
- `400`: Invalid job data

---

### GET `/jobs/{id}`

**Description:** Get job by ID.

**Parameters:**

- `id` (path): Job ID

**Responses:**

- `200`: Job retrieved successfully
- `404`: Job not found

---

### DELETE `/jobs/{id}`

**Description:** Delete a job posting.

**Parameters:**

- `id` (path): Job ID

**Responses:**

- `200`: Job deleted successfully
- `404`: Job not found

---

### PATCH `/jobs/{id}`

**Description:** Update a job posting.

**Parameters:**

- `id` (path): Job ID

**Request Body:**

```json
{
  "title": "string",
  "description": "string"
}
```

**Responses:**

- `200`: Job updated successfully
- `404`: Job not found

---

### POST `/jobs/{id}/apply`

**Description:** Apply for a job.

**Parameters:**

- `id` (path): Job ID

**Request Body:**

```json
{
  "resumeURL": "string",
  "coverLetter": "string"
}
```

**Responses:**

- `200`: Job application submitted successfully
- `404`: Job not found

---

### GET `/jobs/applicants/{id}`

**Description:** Get all applicants for a job.

**Parameters:**

- `id` (path): Job ID

**Responses:**

- `200`: List of applicants retrieved successfully
- `404`: Job not found

---

### PATCH `/jobs/toggleSave/{id}`

**Description:** Toggle job save status.

**Parameters:**

- `id` (path): Job ID

**Responses:**

- `200`: Job save status toggled successfully
- `404`: Job not found

---

## ☁️ AWS Endpoints

### GET `/aws/get-signed-url`

**Description:** Get the pre-signed URL for media upload.

**Responses:**

- `200`: Successfully generated URL
- `500`: Internal Server Error

---

## 🔐 Security

All endpoints are secured using Clerk authentication. A valid JWT token must be provided in the Authorization header for all protected endpoints.

```
Authorization: Bearer <your_jwt_token>
```
