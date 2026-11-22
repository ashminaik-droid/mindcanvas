# MindCanvas – Visual Mood & Reflection Journal 🎨✨

**College Mini Project | Experiment 14 – Mobile Application Development**

> **"Feel it. Write it. Remember it."**  
> MindCanvas is a cross-platform mobile reflection journal developed with React Native and Expo. It provides a peaceful, pastel-themed digital space where users can track daily emotional headspaces, write meaningful thoughts, receive daily inspiration via the ZenQuotes API, and synchronize reflections securely with Google Cloud Firestore.

---

## 📋 Table of Contents
1. [Project Overview & Objectives](#project-overview--objectives)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Color Palette & Design Language](#color-palette--design-language)
5. [Application Architecture & Folder Structure](#application-architecture--folder-structure)
6. [Firebase & Cloud Firestore Setup](#firebase--cloud-firestore-setup)
7. [External API Integration: ZenQuotes API](#external-api-integration-zenquotes-api)
8. [Installation & Execution Guide](#installation--execution-guide)
9. [Screen-by-Screen Walkthrough](#screen-by-screen-walkthrough)
10. [Testing & Quality Verification](#testing--quality-verification)
11. [Project Rules Compliance Summary](#project-rules-compliance-summary)

---

## 1. Project Overview & Objectives

In modern fast-paced student life, emotional well-being and daily mindfulness are often neglected. Traditional note apps lack emotional context, whereas complex mental health tools can feel overwhelming.

**MindCanvas** bridges this gap as a lightweight, beginner-friendly visual journal. Designed following modern human-centered principles:
- **Emotional Self-Awareness**: Five curated pastel mood states (Happy, Calm, Loved, Anxious, Sad) make check-ins effortless.
- **Mindful Writing**: Clean markdown-friendly reflection space for capturing thoughts, gratitudes, and daily milestones.
- **Inspiration on Demand**: Live connection to the ZenQuotes API delivers motivational wisdom.
- **Longitudinal Tracking**: Interactive monthly calendar with emoji markers and live analytical insight charts.
- **Real-Time Cloud Persistence**: Secure Firebase Authentication and Cloud Firestore ensure user data is never lost across sessions.

---

## 2. Key Features

- 🔐 **Firebase Authentication**:
  - Secure Email/Password registration and login.
  - Client-side input validation (email regex, min-6-char password, confirm password match).
  - Password visibility toggle (eye icon).
  - Friendly error messages for invalid credentials, weak passwords, and network issues.
  - Persistent login session via `@react-native-async-storage/async-storage`.

- 🌸 **Soft Pastel Theme**:
  - Soothing color palette with Cream (`#FFF9F3`), Lavender (`#B9A5E8`), Soft Pink (`#F5C6D6`), Warm Peach (`#FFD6B0`), and Charcoal text (`#44404A`).
  - Soft card elevations, rounded corners (14–22px), and clear typography.

- 😊 **Visual Mood Selection**:
  - Five distinct pastel mood states:
    1. **Happy** 😊 (`#FFF3B0` – Soft Yellow)
    2. **Calm** 😌 (`#E2D4F0` – Pastel Lavender)
    3. **Loved** 🥰 (`#F5C6D6` – Soft Pink)
    4. **Anxious** 😰 (`#FFD6B0` – Warm Peach)
    5. **Sad** 😢 (`#C5D3E8` – Gentle Blue)

- 📝 **Cloud Firestore Journal CRUD**:
  - **Create**: Write title and reflection linked to selected mood and date.
  - **Read**: Real-time snapshot subscription updates entries instantly.
  - **Update**: Edit existing reflections with prefilled data and mood tags.
  - **Delete**: Remove reflections with confirmation dialogs (native `Alert` and web confirmation).

- 💬 **ZenQuotes API & Favourites System**:
  - Daily motivational quote fetched from `https://zenquotes.io/api/today`.
  - On-demand quote refresh from `https://zenquotes.io/api/random`.
  - Real-time Firestore bookmarking in `users/{userId}/favouriteQuotes/{quoteId}`.
  - Dedicated **Saved Quotes Screen** (`app/favourites.js`) with quote count badge and remove functionality.
  - Safe network proxy fallback to prevent web CORS issues.

- 📅 **Interactive Mood Calendar**:
  - Monthly calendar grid with month navigation (previous / next month).
  - Day cells highlighted with entry colors and mood emojis.
  - Tap any date to view all reflections logged on that specific day.
  - Quick button to write an entry for the selected date.

- 📊 **Dynamic Insights & Analytics**:
  - Computed on-the-fly from the user's actual Cloud Firestore data.
  - Total entries logged and 7-day weekly activity counter.
  - Most frequent mood percentage and emoji badge.
  - Animated pastel progress bars showing full mood distribution breakdown.

- 👤 **User Profile & Preferences**:
  - Display name initials avatar badge and email address.
  - Cloud connection status badges (Pastel Theme, Cloud Firestore Synced, ZenQuotes Live).
  - Direct shortcut to Saved Quotes.
  - Sign-out button with confirmation modal.

---

## 3. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | **React Native** with **Expo SDK 54+** | Universal cross-platform app framework |
| **Language** | **JavaScript (ES6+)** | Pure JS (.js files) – No TypeScript |
| **Routing & Navigation** | **Expo Router** | File-based navigation with Stack and Bottom Tabs |
| **UI Library** | **React Native Paper** | Material Design 3 pastel theme adaptation |
| **Icons** | **Expo Vector Icons** (`@expo/vector-icons`) | Ionicons icon set |
| **Authentication** | **Firebase Auth** (JS SDK v11.x) | Email & Password authentication |
| **Database** | **Google Cloud Firestore** | NoSQL real-time document database |
| **Storage & Persistence**| **AsyncStorage** | Mobile auth state persistence |
| **External API** | **ZenQuotes API** | REST API for daily and random quotes |

---

## 4. Color Palette & Design Language

MindCanvas adopts a carefully balanced pastel palette to inspire tranquility:

```javascript
// constants/Colors.js
export const Colors = {
  background: '#FFF9F3',    // Warm Cream background
  card: '#FFFFFF',          // Clean White card surface
  primary: '#B9A5E8',       // Soothing Lavender
  secondary: '#F5C6D6',     // Gentle Rose Pink
  accent: '#FFD6B0',        // Warm Peach
  text: '#44404A',          // Charcoal (soft readable dark)
  textSecondary: '#7D7987', // Muted Grey text
  border: '#EFE7DE',        // Light border separator
};
```

---

## 5. Application Architecture & Folder Structure

MindCanvas adheres strictly to Expo Router file-based conventions:

```
mindcanvas/
├── app/                           # Expo Router screens
│   ├── _layout.js                 # Root Stack layout, Theme & Auth route protection
│   ├── index.js                   # Welcome / Landing Screen
│   ├── favourites.js              # Saved Quotes Bookmarks Screen
│   ├── (auth)/                    # Authentication route group
│   │   ├── _layout.js             # Auth group stack layout
│   │   ├── login.js               # Sign In screen
│   │   └── register.js            # Account registration screen
│   ├── (tabs)/                    # Main bottom navigation tabs
│   │   ├── _layout.js             # Bottom tab bar configuration
│   │   ├── home.js                # Home dashboard (quotes, quick check-in, recent list)
│   │   ├── calendar.js            # Mood calendar grid & date preview
│   │   ├── insights.js            # Real-time mood statistics & progress bars
│   │   └── profile.js             # Account overview & sign out
│   └── journal/                   # Reflection creation & editing
│       ├── _layout.js             # Journal stack layout
│       ├── mood.js                # 5-card mood selector screen
│       └── editor.js              # Title & reflection writing editor (Create & Edit)
├── assets/
│   └── images/                    # Custom pastel application icons
│       ├── app-icon.png           # 512x512 Master App Icon
│       ├── icon.png               # Default Expo App Icon
│       ├── splash-icon.png        # Minimalist splash screen emblem
│       └── android-icon-foreground.png # Android adaptive foreground
├── components/                    # Reusable pastel UI components
│   ├── CustomButton.js            # Styled React Native Paper button
│   ├── CustomCard.js              # Elevation card with pastel border
│   ├── JournalCard.js             # Entry card with mood badge, excerpt, Edit & Delete
│   ├── MoodCard.js                # Selectable mood tile with check indicator
│   └── QuoteCard.js               # ZenQuotes display with Refresh & Favorite toggle
├── constants/
│   ├── Colors.js                  # Master pastel color tokens
│   └── Moods.js                   # 5 Mood definitions (id, label, emoji, color)
├── context/
│   └── AuthContext.js             # Global React Context for Firebase user & session
├── firebase/
│   └── firebaseConfig.js          # Firebase app, auth & Firestore initialization
├── services/
│   ├── auth.js                    # Auth methods (login, register, logout, error mapping)
│   ├── journal.js                 # Firestore CRUD operations & real-time subscriptions
│   └── quotes.js                  # ZenQuotes API fetching & favourite quotes Firestore service
├── scripts/
│   ├── generate-assets.py         # Pure Python asset generator (app icon & splash)
│   └── test-features.js           # Automated 44-test verification suite
├── app.json                       # Expo project configuration
└── package.json                   # Project dependencies and run scripts
```

---

## 6. Firebase & Cloud Firestore Setup

MindCanvas utilizes the **Firebase JavaScript SDK (v11.x)**.

### Firestore Data Model
Each authenticated user has their data isolated under their Firebase User ID (`userId`):

```
users/ (collection)
  └── {userId}/ (document)
        ├── entries/ (subcollection)
        │     └── {entryId} (document)
        │           ├── title: string
        │           ├── reflection: string
        │           ├── mood: string ("Happy" | "Calm" | "Loved" | "Anxious" | "Sad")
        │           ├── emoji: string ("😊" | "😌" | "🥰" | "😰" | "😢")
        │           ├── moodColor: string (hex)
        │           ├── date: string ("YYYY-MM-DD")
        │           ├── createdAt: Timestamp
        │           └── updatedAt: Timestamp
        │
        └── favouriteQuotes/ (subcollection)
              └── {quoteId} (document)
                    ├── text: string
                    ├── author: string
                    └── savedAt: Timestamp
```

### Recommended Security Rules
In the Firebase Console -> Firestore Database -> Rules, apply:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/entries/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /users/{userId}/favouriteQuotes/{quoteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 7. External API Integration: ZenQuotes API

The app connects to **ZenQuotes.io** for inspiring daily reflections:
- **Daily Quote**: `https://zenquotes.io/api/today` (returns quote of the day).
- **Random Quote**: `https://zenquotes.io/api/random` (triggered when the user taps the refresh icon).
- **Format**:
  ```json
  [
    {
      "q": "The journey of a thousand miles begins with one step.",
      "a": "Lao Tzu",
      "h": "..."
    }
  ]
  ```
- **Fallback Resilience**: When offline or in restricted web environments, the app gracefully falls back to curated mindfulness quotes and incorporates an allorigins CORS proxy fallback.

---

## 8. Installation & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/go) app installed on your Android or iOS device (optional for mobile testing).

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Firebase
Verify `firebase/firebaseConfig.js` contains your Firebase project configuration credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Run the Application
Start the Expo development server:
```bash
npx expo start
```

- **Run on Android**: Press `a` in the terminal or scan the terminal QR code with the Expo Go app.
- **Run on iOS**: Press `i` in the terminal or scan the QR code with the iOS Camera app.
- **Run on Web Browser**: Press `w` in the terminal.

---

## 9. Screen-by-Screen Walkthrough

1. **Splash / Welcome Screen (`/`)**:
   - Displays MindCanvas badge and tagline.
   - Shows "Sign In" and "Create Account" buttons for guests.
   - If already logged in, presents a "Go to Home Journal" shortcut.

2. **Login Screen (`/(auth)/login`)**:
   - Clean email and password inputs with password visibility toggle.
   - Clear banner alerts for incorrect credentials.

3. **Register Screen (`/(auth)/register`)**:
   - Full Name, Email, Password, and Confirm Password fields.
   - Creates a user in Firebase Auth and updates the user profile with the display name.

4. **Home Screen (`/(tabs)/home`)**:
   - Personalized header: *"Hello, [Name] 🌸"* with today's formatted date.
   - Favourites shortcut button with live counter badge.
   - **Daily Mood Check-in**: 5 quick mood pills to jump straight into journaling.
   - **Daily Reflection Quote Card**: Displays ZenQuotes quote with refresh and heart bookmark button.
   - **Recent Reflections**: Live Firestore list with mood pills, excerpts, edit, and delete actions.

5. **Mood Selector Screen (`/journal/mood`)**:
   - 5 large interactive pastel cards.
   - Shows checkmark on the active selection and a preview banner before proceeding.

6. **Journal Editor Screen (`/journal/editor`)**:
   - Displays selected mood chip with a "Change" shortcut.
   - Inputs for Reflection Title and multiline thoughts.
   - Dual-purpose: Handles both **new entries** and **editing existing entries**.
   - Sync confirmation note highlighting Firestore security.

7. **Mood Calendar (`/(tabs)/calendar`)**:
   - Interactive monthly grid with month forward/back navigation.
   - Colored day indicators with mood emojis.
   - Selecting a date reveals the reflections logged on that day or an "Add Entry" button.

8. **Insights & Analytics (`/(tabs)/insights`)**:
   - Real-time calculations: Total entries, 7-day entries, and top mood percentage.
   - Distribution progress bars for all 5 moods.
   - Automated reflection summary.

9. **Profile Screen (`/(tabs)/profile`)**:
   - User avatar initials badge, full name, and registered email.
   - Account overview showing Firebase Auth and app version.
   - Status indicators (Pastel Theme Active, Cloud Firestore Synced, ZenQuotes Live).
   - Sign Out button with confirmation prompt.

10. **Saved Quotes Screen (`/favourites`)**:
    - Dedicated screen for bookmarked ZenQuotes quotes.
    - Remove button with confirmation to manage bookmarks.

---

## 10. Testing & Quality Verification

MindCanvas includes automated and system health checks:

### 1. Automated Feature Verification Suite
Run the comprehensive test suite covering all 6 development phases:
```bash
node scripts/test-features.js
```
**Results**:
```
====================================================
Results: 44 / 44 tests passed (0 failed)
====================================================
🎉 ALL PHASE 1 - 6 COMPREHENSIVE TESTS PASSED!
```

### 2. Expo Doctor Health Check
Verify dependency compatibility and Expo configuration:
```bash
npx expo-doctor
```
**Results**:
```
Running 20 checks on your project...
20/20 checks passed. No issues detected!
```

### 3. Cross-Platform Bundle Verification
Tested using Metro bundler for Web, iOS, and Android:
- ✅ Web: Bundled 1077 modules with 0 errors.
- ✅ iOS: Bundled 1417 modules with 0 errors.
- ✅ Android: Bundled 1583 modules with 0 errors.

---

## 11. Project Rules Compliance Summary

| Rule | Requirement | MindCanvas Implementation | Status |
| :---: | :--- | :--- | :---: |
| 1 | **JavaScript Only** | 100% pure `.js` / `.jsx`. No TypeScript files. | ✅ Compliant |
| 2 | **React Native with Expo** | Developed using Expo SDK 54+ and Metro bundler. | ✅ Compliant |
| 3 | **Expo Router** | File-based routing with root Stack and Bottom Tabs layout. | ✅ Compliant |
| 4 | **Firebase JS SDK** | Firebase JS SDK v11.x with AsyncStorage persistence. | ✅ Compliant |
| 5 | **React Native Paper** | Material 3 pastel theme adaptation. | ✅ Compliant |
| 6 | **ZenQuotes API** | REST API for daily and random inspirational quotes. | ✅ Compliant |
| 7 | **Beginner-Friendly** | Clean modular architecture with services, context, and components. | ✅ Compliant |
| 8 | **Soft Pastel Theme** | Palette with Lavender, Pink, Peach, Cream, and Charcoal text. | ✅ Compliant |
| 9 | **Simple Architecture** | Lightweight dependencies without redundant libraries. | ✅ Compliant |

---

*MindCanvas was developed for college practical evaluation and demonstration of mobile application engineering principles.*
