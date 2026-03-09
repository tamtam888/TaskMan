# TaskMan 🕹️

**TaskMan** is a retro-inspired task management app built with **React**
that turns productivity into a game.
Created as part of a full-stack software engineering program using CI/CD, Docker, testing, and Git best practices.

---

## ✨ Features (v0100)

- ✅ Add, complete, and delete tasks
- ✅ Prioritize tasks: **High | Normal | Low**
- ✅ Filter by category: **All / Shopping / Mission / Other / ✅ Completed!!**
- ✅ Organize tasks into separate lists by category
- ✅ Track score and level based on task completion
- ✅ Toggle between **Game Mode** and **Classic Mode**
- ✅ **Google Sign-In** for per-user authentication
- ✅ Each user’s tasks, score, and level are saved locally
- ✅ Mobile-responsive retro pixel UI
- ✅ **Edit existing tasks (inline)**
- ✅ **Due dates with overdue detection**
- ✅ **Participants** on each task (optional; unique list per task)
- ✅ **Sound effects** for key actions
- ✅ **Tests** (Jest + React Testing Library) pass in CI

---

## 🧠 Planned (v0101)

- Deadline-near notifications (e.g., T-24h / T-1h)
- User **Timeline** to visualize progress (creation → deadline) with color changes; overdue may **blink**
- Points/level logic updated to reflect “near deadline” status
- Per-participant **calendar sync** (events spanning from creation date → deadline)
- Notifications & simple collaboration flows

---

## ️🛠 Tech Stack

- **Frontend**: React (Functional Components + Hooks)  
- **Auth**: Google OAuth2 (via `@react-oauth/google`)  
- **Styling**: Custom CSS (Retro-inspired + Responsive)  
- **Testing**: React Testing Library  
- **CI/CD**: GitHub Actions  
- **Containerization**: Docker & DockerHub  
- **Dev Tools**: ESLint, Prettier, Husky, Lightning  

- **Frontend**: React (Functional Components + Hooks)
- **Auth**: Google OAuth2 (`@react-oauth/google`)
- **Styling**: Custom CSS (retro-inspired, responsive)
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions (CI & CD)
- **Containerization**: Docker & DockerHub
- **Dev Tools**: ESLint, Prettier


---

## 📦 Getting Started

```bash
git clone https://github.com/tamtam888/TaskMan-Yellow-user.git
cd TaskMan-Yellow-user
npm install
npm start
https://taskman-yellow-user.vercel.app
