# TaskMan

**TaskMan** is a gamified task management app built with React. It turns everyday tasks into a retro-style productivity experience with scoring, levels, priorities, deadlines, categories, sound effects, and a responsive UI.

The project was created as part of a full-stack software engineering program and demonstrates practical frontend development, component-based architecture, testing, CI/CD, Docker, and Git best practices.

## Live Demo

https://taskman-yellow-user.vercel.app

## Repository

https://github.com/tamtam888/TaskMan

---

## Features

- Add, complete, edit, and delete tasks
- Prioritize tasks by level: High, Normal, Low
- Organize tasks by category: All, Shopping, Mission, Other, Completed
- Toggle between Game Mode and Classic Mode
- Track score and level based on completed tasks
- Google Sign-In for user authentication
- Save each user's tasks, score, and level locally
- Add due dates with overdue detection
- Add optional participants to each task
- Play sound effects for key actions
- Responsive retro pixel-style UI
- Unit tests with Jest and React Testing Library
- CI/CD workflow with GitHub Actions
- Dockerized production build served with Nginx

---

## Tech Stack

| Area | Technology |
|------|------------|
| Frontend | React, JavaScript, HTML5, CSS3 |
| Auth | Google OAuth2 with `@react-oauth/google` |
| Date Handling | date-fns, react-datepicker |
| Security | DOMPurify for user input sanitization |
| Testing | Jest, React Testing Library |
| CI/CD | GitHub Actions |
| Containerization | Docker, Nginx |
| Styling | Custom CSS, responsive retro UI |
| Tooling | ESLint, Prettier |

---

## Project Structure

```text
TaskMan/
  public/             Static assets
  src/                React source code
    components/       Reusable UI components
    tests/            Test files and test helpers
  .github/workflows/  CI/CD workflows
  Dockerfile          Production Docker build
  nginx.conf          Nginx configuration for Docker
  package.json        Scripts and dependencies
```

---

## Getting Started

```bash
git clone https://github.com/tamtam888/TaskMan.git
cd TaskMan
npm install
npm start
```

The app will run locally at:

```text
http://localhost:3000
```

---

## Available Scripts

```bash
npm start
```

Runs the app in development mode.

```bash
npm run build
```

Creates a production build in the `build` folder.

```bash
npm test
```

Runs the test suite with React Testing Library.

---

## Docker

Build the Docker image:

```bash
docker build -t taskman-app .
```

Run the container:

```bash
docker run -p 8080:80 taskman-app
```

Open:

```text
http://localhost:8080
```

---

## CI/CD

The repository includes GitHub Actions workflows for:

- Installing dependencies
- Running tests
- Building the React app
- Uploading the build artifact
- Building a Docker image
- Optional deployment integration through configured secrets

---

## Product Focus

TaskMan was designed to make task management feel more engaging by combining simple productivity flows with game-like feedback. The goal was not only to build a working task app, but also to practice clean component structure, accessible UI controls, user input handling, automated checks, and deployment-oriented project setup.

---

## Planned Improvements

- Deadline-near notifications
- Visual timeline for task progress from creation date to deadline
- Calendar sync for tasks with participants
- Improved collaboration flows
- More advanced scoring logic based on deadline status

---

## What This Project Demonstrates

- React component architecture
- State handling with functional components and hooks
- Form validation and input sanitization
- Authentication integration with Google OAuth
- Responsive UI implementation
- Testing with Jest and React Testing Library
- CI/CD setup with GitHub Actions
- Docker-based production deployment

---

## License

This project is for portfolio and learning purposes.
