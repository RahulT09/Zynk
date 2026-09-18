# Zynk Meet
    
Zynk Meet is a full-stack real-time video conferencing application that enables users to create and join meetings, communicate through live video and audio streams, and exchange messages through an integrated chat system.
  
## Features

- User Authentication
- Secure Login and Logout
- Create and Join Meeting Rooms
- Real-Time Video Communication  
- Real-Time Audio Communication
- Integrated Meeting Chat
- Unique Meeting Code Access
- Responsive User Interface
- Peer-to-Peer Communication using WebRTC
- Real-Time Signaling with Socket.IO

---

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Material UI
- CSS3
- Axios

### Backend

- Node.js
- Express.js
- Socket.IO

### Database

- MongoDB
- Mongoose

### Real-Time Communication

- WebRTC
- Socket.IO

### Deployment

- Render

---

## Project Structure

```text
Zynk-Meet
│
├── client
│   ├── public
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── context
│   │   ├── routes
│   │   └── assets
│   └── package.json
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/zynk-meet.git
cd zynk-meet
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Update the values according to your environment.

---

## Running the Application

### Start Backend

```bash
cd server
npm start
```

### Start Frontend

```bash
cd client
npm start
```

Application URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

---

## Application Flow

### Authentication

- Register a new account
- Login using valid credentials
- Access protected routes
- Logout securely

### Meeting System

- Create meeting rooms
- Join meetings using meeting codes
- Connect participants in real time
- Manage meeting sessions

### Video Conferencing

- Peer-to-peer video streaming
- Real-time audio communication
- Dynamic participant rendering
- Live connection management

### Chat System

- Send messages instantly
- Receive messages in real time
- Communicate alongside video sessions

---

## Deployment

The application is deployed on Render.

### Frontend

```bash
npm run build
```

Deploy the generated build folder as a static site.

### Backend

Deploy the Express server as a Render Web Service and configure all required environment variables.

---

## Future Enhancements

- Screen Sharing
- Meeting Recording
- Virtual Backgrounds
- Waiting Rooms
- Meeting Scheduling
- Notifications
- Participant Controls
- End-to-End Encryption

---

## Security

- JWT Authentication
- Protected API Routes
- Environment Variable Configuration
- Secure Socket Communication

---

## Contributing

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---


