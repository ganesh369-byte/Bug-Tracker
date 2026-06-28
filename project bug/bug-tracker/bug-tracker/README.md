# 🐞 Bug Tracker

A full-stack bug tracking system. Teams can create projects, log bugs against them,
assign bugs to members, track status/priority, and discuss bugs via comments.

## Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript (fetch API, no frameworks)
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

## Features

- User authentication (signup/login) with role-based access (admin, developer, reporter)
- Create and manage projects, add team members
- Create, update, delete bugs with priority (low/medium/high) and status
  (open/in-progress/resolved/closed)
- Assign bugs to specific users
- Comment thread on each bug
- Filter bugs by status and priority, per-project and across all projects
- Protected API routes via JWT middleware

## Project Structure

```
bug-tracker/
├── server/                 # Express backend
│   ├── config/db.js        # MongoDB connection
│   ├── models/              # Mongoose schemas (User, Project, Bug)
│   ├── controllers/         # Route logic
│   ├── routes/               # Express routers
│   ├── middleware/          # JWT auth + error handling
│   └── server.js             # App entry point
└── client/                 # Plain HTML/CSS/JS frontend
    ├── css/style.css
    ├── js/api.js            # Fetch wrapper + JWT handling
    ├── js/navbar.js
    └── pages/               # login, register, projects, project-detail, bugs, bug-detail
```

## Setup & Run Locally

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally, OR a free MongoDB Atlas cluster

### 2. Install dependencies
```bash
cd server
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` inside the `server` folder and fill in your values:
```bash
cp .env.example .env
```
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bugtracker
JWT_SECRET=replace_this_with_a_long_random_secret_string
```

If using MongoDB Atlas, your `MONGO_URI` will look like:
`mongodb+srv://<user>:<password>@<cluster-url>/bugtracker?retryWrites=true&w=majority`

### 4. Start the server
```bash
npm run dev    # uses nodemon, auto-restarts on changes
# or
npm start
```

The server runs on `http://localhost:5000` and also serves the frontend —
visit `http://localhost:5000` in your browser to use the app.

## API Endpoints

| Method | Endpoint                       | Description                  | Auth |
|--------|----------------------------------|-------------------------------|------|
| POST   | /api/auth/register              | Register a new user          | No   |
| POST   | /api/auth/login                 | Log in                       | No   |
| GET    | /api/auth/me                    | Get logged-in user           | Yes  |
| GET    | /api/auth/users                 | List all users                | Yes  |
| POST   | /api/projects                   | Create a project              | Yes  |
| GET    | /api/projects                   | List your projects            | Yes  |
| GET    | /api/projects/:id                | Get a single project          | Yes  |
| PUT    | /api/projects/:id                | Update a project              | Yes  |
| DELETE | /api/projects/:id                | Delete a project              | Yes  |
| POST   | /api/projects/:id/members         | Add a member to a project      | Yes  |
| POST   | /api/bugs                       | Create a bug                  | Yes  |
| GET    | /api/bugs                       | List bugs (filterable)        | Yes  |
| GET    | /api/bugs/:id                    | Get a single bug              | Yes  |
| PUT    | /api/bugs/:id                    | Update a bug                  | Yes  |
| DELETE | /api/bugs/:id                    | Delete a bug                  | Yes  |
| POST   | /api/bugs/:id/comments            | Add a comment to a bug         | Yes  |

`GET /api/bugs` supports query params: `?project=<id>&status=<status>&priority=<priority>&assignee=<id>`

## Possible Future Enhancements
- Dashboard with charts (bugs per status/priority)
- Email notifications when assigned a bug
- File/screenshot attachments on bugs
- Activity log per bug
- Pagination for large bug lists

## License
MIT
