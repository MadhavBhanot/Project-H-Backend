# **Project H Backend**

A powerful backend system designed to handle user authentication, social interactions, job postings, and more with seamless integrations like Clerk and Ngrok. Built using **Node.js**, **Express.js** and **MongoDB**, this backend ensures scalability, reliability, and security.

---

## **🌟 Features**

- User Authentication (OAuth, OTP, Forgot Password)
- Post Creation, Likes, and Comments
- Job Postings and Applications
- Webhook Integration with Clerk
- Secure API with Webhook Signature Verification

---

## **⚙️ Prerequisites**

Ensure the following are installed on your system:

- **Node.js** (v14+)
- **MongoDB** (Local or MongoDB Atlas)
- **Ngrok** (For webhook testing)

---

## **🚀 Getting Started**

Follow these steps to set up and run the project:

### **1. Clone the Repository**

```bash
git clone https://github.com/SHIVAM-KUMAR-59/Project-H-Backend.git
cd Project-H-Backend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Set Environment Variables**

Create a .env file in the root directory and add the following:

```bash
CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
SIGNING_SECRET=whsec_1234567890abcdef
```

### **4. Run the Application**

```bash
node index.js
```

---

# 📜 API Routes

## Auth Routes

| Method | Endpoint                | Description     |
| ------ | ----------------------- | --------------- |
| POST   | `/auth/register`        | Register a user |
| POST   | `/auth/login`           | User login      |
| POST   | `/auth/verify-otp`      | Verify OTP      |
| POST   | `/auth/resent-otp`      | Resend OTP      |
| POST   | `/auth/forgot-password` | Forgot Password |
| POST   | `/auth/reset-password`  | Reset Password  |
| POST   | `/auth/google`          | Google OAuth    |
| POST   | `/auth/github`          | GitHub OAuth    |

---

## User Routes

| Method | Endpoint                     | Description            |
| ------ | ---------------------------- | ---------------------- |
| GET    | `/users/:id`                 | Get user details by ID |
| PATCH  | `/users/:id`                 | Update user profile    |
| DELETE | `/users/:id`                 | Delete user            |
| POST   | `/users/:id/follow-unfollow` | Follow/Unfollow user   |
| GET    | `/users/:id/followers`       | Get followers          |
| GET    | `/users/:id/following`       | Get following          |

---

## Post Routes

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | `/posts`                 | Create a post       |
| GET    | `/posts`                 | Get all posts       |
| GET    | `/posts/:id`             | Get post by ID      |
| PATCH  | `/posts/:id`             | Update post         |
| DELETE | `/posts/:id`             | Delete post         |
| POST   | `/posts/:id/like-unlike` | Like/Unlike post    |
| POST   | `/posts/:id/comment`     | Add comment to post |
| GET    | `/posts/:id/comments`    | Get comments        |

---

## Job Routes

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| POST   | `/jobs`                | Create job post    |
| GET    | `/jobs`                | Get all job posts  |
| GET    | `/jobs/:id`            | Get job post by ID |
| PATCH  | `/jobs/:id`            | Update job post    |
| DELETE | `/jobs/:id`            | Delete job post    |
| POST   | `/jobs/:id/apply`      | Apply for job      |
| GET    | `/jobs/:id/applicants` | Get job applicants |

---

## Comment Routes

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| GET    | `/comments/:id`         | Get comment by ID |
| PATCH  | `/comments/:id`         | Update comment    |
| DELETE | `/comments/:id`         | Delete comment    |
| POST   | `/comments/:id/reply`   | Reply to comment  |
| GET    | `/comments/:id/replies` | Get replies       |

---

# 🛠️ Setting Up Ngrok

1. **Install Ngrok**  
   Download and install Ngrok from the [Ngrok Website](https://ngrok.com/download).

2. **Start Ngrok Tunnel**  
   Run the following command to start an Ngrok tunnel for your application:

```bash
ngrok http 5001
```

    Replace `5001` with the port number your application is running on.

3. **Copy the Generated URL**
   After running the command, Ngrok will generate a public URL (e.g., `https://example.ngrok-free.app`).
   Use this URL to configure webhooks.

# 📊 Schema Diagram

<img src="./Project-H-Backend.png" style="border-radius: 8px;"></img>

# 🔄 User Flow

<img src="./User-Flow.png" style="border-radius: 8px;"></img>

---

# 🧪 Testing

Use Postman or any API testing tool to test all the endpoints and ensure proper functionality.
