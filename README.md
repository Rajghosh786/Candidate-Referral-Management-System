# Candidate Referral Management System

A full-stack MERN application to manage employee referrals, allowing users to register, login, refer candidates, upload resumes, and track referral metrics.

---
# Candidate Referral Management System
- **Deployed Link:** https://refeer-me.netlify.app/
## Features Implemented

- **User Authentication:** Register and login with JWT-based authentication.
- **Candidate Referral:** Authenticated users can refer candidates by providing details and uploading resumes (PDF only, up to 3MB).
- **Resume Upload:** Resumes are uploaded to Cloudinary for secure storage.
- **Dashboard:** View all referred candidates, search by job title or status, and update candidate status (pending, reviewed, hired).
- **Metrics:** View referral statistics (total referred, pending, reviewed, hired).
- **Responsive UI:** Built with React and Tailwind CSS for a modern, responsive interface.
- **API Security:** Protected routes using JWT tokens.
- **Error Handling:** User-friendly error messages for missing fields, invalid credentials, and upload issues.

---

## Technology Stack

- **Frontend:** React, React Router, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken, bcrypt)
- **File Uploads:** Multer, Cloudinary
- **Other:** dotenv for environment variables

---

## Steps to Run the Project Locally

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Cloudinary account (for resume uploads)

### 1. Clone the Repository

```sh
git clone <repository-url>
cd Candidate-Referral-Management-System
```

### 2. Setup Backend

```sh
cd server
npm install
```

- Create a `.env` file in the `server` directory (already present in your codebase):

  ```
  PORT=1305
  MONGO_URI=mongodb://127.0.0.1:27017/candidate_referral_management_system
  JWT_TOKEN=your_jwt_secret
  CLOUD_NAME=your_cloudinary_cloud_name
  API_KEY=your_cloudinary_api_key
  API_SECRET=your_cloudinary_api_secret
  ```

- Start the backend server:

  ```sh
  npm start
  ```

### 3. Setup Frontend

```sh
cd ../client
npm install
```

- Create a `.env` file in the `client` directory (already present):

  ```
  VITE_API_URL=http://localhost:1305
  ```

- Start the frontend development server:

  ```sh
  npm run dev
  ```

- Open [http://localhost:5173](http://localhost:5173) in your browser.

---
### 3. Setup Cloudinary

- after creating new account on Cloudinary by default, free/new accounts are blocked from directly delivering PDF files, resulting in an "untrusted" error when trying to view them inline
- Log into Cloudinary Console

- Go to Settings → Security

- Locate "PDF and ZIP files delivery" section

- Enable the option (toggle on)

- Save your changes and accept any prompts

## Assumptions & Limitations

- **User Roles:** Only "user" and "admin" roles are supported, but admin features are not implemented yet.
- **No Email Verification:** Registration does not send verification emails.
- **No Password Reset:** There is no password reset functionality.
- **No Pagination:** Candidate dashboard does not paginate results.
- **No Rate Limiting:** APIs are not rate-limited.
- **Cloudinary Credentials:** You must provide your own Cloudinary credentials in the backend `.env` file.

---

## API Documentation

### Authentication

#### Register

- **POST** `/user/register`
- **Body:**  
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "yourpassword"
  }
  ```
- **Response:**  
  `201 Created`  
  `{ "msg": "user created successfully" }`

#### Login

- **POST** `/user/login`
- **Body:**  
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**  
  `200 OK`  
  `{ "msg": "Login successful", "token": "...", "firstName": "...", ... }`

---

### Candidate Referral

#### Refer a Candidate

- **POST** `/candidate`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "jobTitle": "Frontend Developer",
    "resume": "<cloudinary_resume_url>"
  }
  ```
- **Response:**  
  `201 Created`  
  `{ "msg": "Candidate referred successfully", "candidate": { ... } }`

#### Upload Resume

- **POST** `/candidate/upload-resume`
- **Form Data:**  
  `resume` (file, PDF only, max 3MB)
- **Response:**  
  `200 OK`  
  `{ "url": "<cloudinary_resume_url>" }`

#### Get All Candidates

- **GET** `/candidate`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  `200 OK`  
  `{ "msg": "Candidate list fetched successfully", "data": [ ... ] }`

#### Update Candidate Status

- **PATCH** `/candidate/:id/status`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Body:**  
  ```json
  { "status": "reviewed" }
  ```
- **Response:**  
  `200 OK`  
  `{ "msg": "Status updated successfully", "data": { ... } }`

---

### Referral Metrics

#### Get Referral Metrics

- **GET** `/user/all-referral`
- **Headers:**  
  `Authorization: Bearer <token>`
- **Response:**  
  `200 OK`  
  ```json
  {
    "totalReferred": 5,
    "pending": 2,
    "reviewed": 2,
    "hired": 1
  }
  ```

---

## Postman Collection

You can import the following endpoints into Postman for testing:

- `POST /user/register`
- `POST /user/login`
- `POST /candidate/upload-resume`
- `POST /candidate`
- `GET /candidate`
- `PATCH /candidate/:id/status`
- `GET /user/all-referral`

**Note:** For protected routes, set the `Authorization` header as `Bearer <your_token>`.

---

## License

This project is for educational purposes.