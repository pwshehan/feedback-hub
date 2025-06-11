# Feedback Hub

Feedback Hub is a web application designed to collect and manage user feedback efficiently. This project leverages Next.js for the frontend and backend, and uses MongoDB as its database.

## Getting Started

To run Feedback Hub using Docker, use the following command:
````bash
docker run -p 3001:3000 --env=MONGODB_URI="" --env=NEXTAUTH_URL="" --env=NEXTAUTH_SECRET="" --env=ADMIN_EMAIL="" --env=ADMIN_PASSWORD="" --name="" -d pwshehan/feedback-hub
```