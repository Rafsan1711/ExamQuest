# ExamQuest

ExamQuest is a modern, real-time syllabus tracker and exam preparation dashboard. It helps students organize their study materials, track progress across different subjects and chapters, visualize their performance with interactive analytics, and compete with peers on a live leaderboard.

![ExamQuest Screenshot](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop)

## Features

- **Syllabus Management:** Add, edit, and delete subjects and chapters.
- **Progress Tracking:** Track completion of MCQs, A&B questions, and C&D questions.
- **Interactive Analytics:** Visualize your progress with D3.js powered charts (Donut, Pie, Bar, Heatmap).
- **Live Leaderboard:** Compete with other students in real-time.
- **Authentication:** Secure Google Sign-In via Firebase Auth.
- **Real-time Sync:** All data is synced instantly across devices using Firebase Realtime Database.

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Data Visualization:** D3.js (v7)
- **Icons:** Lucide React
- **Backend & Database:** Firebase (Auth, Realtime Database)
- **Deployment:** Vercel

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd examquest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=your_database_url
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** and add the **Google** sign-in provider.
3. Enable **Realtime Database**.
4. Set the following Security Rules in the Realtime Database console:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "leaderboard": {
      ".read": "auth !== null",
      "$uid": { ".write": "$uid === auth.uid" }
    }
  }
}
```

5. Register a web app in your Firebase project settings to get the configuration keys for your `.env` file.

## Vercel Deployment

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. In the Vercel project settings, add all the environment variables from your `.env` file.
4. The included `vercel.json` file will automatically handle routing for the React SPA and set secure HTTP headers.
5. Click **Deploy**.
