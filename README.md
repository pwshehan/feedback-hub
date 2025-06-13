# Feedback Hub

Feedback Hub is a web application designed to collect and manage user feedback efficiently. This project leverages Next.js for the frontend and backend, and uses MongoDB as its database.

## Features

### Dashboard Features

- 📊 **Dashboard Overview**: Real-time statistics and metrics
- 📝 **Feedback Management**: View, filter, and manage reviews and reports
- 🔍 **Advanced Filtering**: Filter by type, read status, and account ID
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🌙 **Dark/Light Mode**: Theme switching support
- 🔐 **Secure Authentication**: Protected dashboard access

### API Features

- 🔌 **External API**: RESTful API for external applications
- 🔑 **JWT Authentication**: Secure token-based authentication
- 📊 **Statistics Endpoint**: Get comprehensive feedback statistics
- 🔍 **Advanced Querying**: Filter and paginate results
- 🌐 **CORS Support**: Cross-origin resource sharing enabled

## Getting Started

To run Feedback Hub using Docker, use the following command:

````bash
docker run -p 3001:3000 --env=MONGODB_URI="" --env=NEXTAUTH_URL="" --env=NEXTAUTH_SECRET="" --env=ADMIN_EMAIL="" --env=ADMIN_PASSWORD="" --name="" -d pwshehan/feedback-hub
```

## API Documentation

### Authentication

#### Login (Get Token)
```http
POST /api/auth/external/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-id",
      "email": "admin@example.com",
      "name": "Admin"
    },
    "expiresIn": "24h"
  }
}
```

#### Verify Token
```http
POST /api/auth/external/verify
Authorization: Bearer your-jwt-token
```

### Feedback Endpoints

#### Create Feedback (No Auth Required)
```http
POST /api/reviews/create
Content-Type: application/json

{
  "type": "REVIEW", // or "REPORT"
  "account_id": "user123",
  "username": "john_doe",
  "message": "Great service!",
  "rating": 5, // Required for REVIEW, optional for REPORT
  "metadata": {} // Optional additional data
}
```

#### Get Feedback (Auth Required)
```http
GET /api/reviews
Authorization: Bearer your-jwt-token

Query Parameters:
- type: REVIEW | REPORT
- isRead: true | false
- account_id: string
- page: number (default: 1)
- limit: number (default: 10, max: 100)
```

#### Get Statistics (Auth Required)
```http
GET /api/reviews/stats
Authorization: Bearer your-jwt-token

Query Parameters:
- account_id: string (optional, filter stats by account)
```

#### Mark as Read (Auth Required)
```http
PUT /api/reviews/{id}/mark-read
Authorization: Bearer your-jwt-token
```

### Example Usage

#### JavaScript/Node.js
```javascript
// Login and get token
const loginResponse = await fetch('/api/auth/external/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'your-password'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// Use token to fetch feedback
const feedbackResponse = await fetch('/api/reviews?type=REVIEW&page=1&limit=10', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const feedbackData = await feedbackResponse.json();
```

#### Python
```python
import requests

# Login
login_data = {
    "email": "admin@example.com",
    "password": "your-password"
}

response = requests.post('/api/auth/external/login', json=login_data)
token = response.json()['data']['token']

# Fetch feedback
headers = {'Authorization': f'Bearer {token}'}
feedback_response = requests.get('/api/reviews?type=REVIEW', headers=headers)
feedback_data = feedback_response.json()
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/feedback-system

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
```

## Docker Deployment

### Build and Run
```bash
# Build the image
docker build -t feedback-system .

# Run with environment file
docker run -p 3000:3000 --env-file .env feedback-system
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/feedback-system
      - NEXTAUTH_SECRET=your-secret-key
      - ADMIN_EMAIL=admin@example.com
      - ADMIN_PASSWORD=secure-password
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Response Format

All API responses follow this consistent format:

```json
{
  "success": true|false,
  "message": "Human readable message",
  "data": {}, // Response data (when successful)
  "error": "error-code", // Error code (when failed)
  "details": [] // Additional error details (when applicable)
}
```

## Security Features

- 🔐 JWT-based authentication for API access
- 🛡️ Input validation and sanitization
- 🚫 Rate limiting ready (implement as needed)
- 🔒 Secure password hashing with bcrypt
- 🌐 CORS configuration for cross-origin requests

## License

This project is licensed under the MIT License.
````
