# 🏰 Lexicon Quest - A Magical STEM Learning Adventure

A modern React/TypeScript web application that provides an engaging, magical learning experience for children through interactive creature collection and educational adventures.

## ✨ Features

### 🔐 Authentication System
- **Email/Password Authentication** - Secure user registration and login
- **Google OAuth Integration** - One-click sign-in with Google accounts
- **Password Recovery** - Forgot password functionality with email reset
- **User Profile Management** - Store user data and preferences in Firestore

### 🎮 Interactive Learning Experience
- **Kowai Creatures Collection** - Discover and collect magical creatures
- **Creature Details Modal** - Learn about each Kowai with detailed information
- **User Statistics Dashboard** - Track learning progress with visual stats
- **Quest Integration** - Connect to external learning surveys via Tally forms

### 🎨 Modern UI/UX
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark Theme** - Beautiful dark mode with magical gradients
- **Smooth Animations** - Framer Motion powered transitions
- **Accessible Components** - Built with Radix UI primitives

### 📊 Analytics & Tracking
- **Mixpanel Integration** - Comprehensive user behavior tracking
- **Authentication Events** - Login, signup, logout tracking
- **User Engagement** - Quest interactions and feature usage
- **Error Monitoring** - Failed authentication attempts tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with full type coverage
- **Vite** - Fast build tool and development server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### Backend & Services
- **Firebase Authentication** - Secure user authentication
- **Firestore** - NoSQL database for user data storage
- **Firebase Analytics** - User behavior analytics
- **Mixpanel** - Advanced event tracking and user analytics

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Custom Components** - Tailored UI components for the learning experience

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lexiconquestforkids/website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Firebase configuration is already set up in `src/lib/firebase.ts`
   - Mixpanel token is configured in `src/lib/mixpanel.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── AppContent.tsx   # Main application router
│   ├── LoginPage.tsx    # Authentication interface
│   ├── ProfilePage.tsx  # Main user dashboard
│   ├── Header.tsx       # Navigation header
│   ├── KowaiCard.tsx    # Creature display cards
│   └── KowaiModal.tsx   # Creature detail modals
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── hooks/               # Custom React hooks
│   └── useAuthWithAnalytics.ts # Auth + analytics integration
├── lib/                 # Utility libraries
│   ├── firebase.ts      # Firebase configuration
│   └── mixpanel.ts      # Analytics configuration
└── App.tsx              # Root application component
```

## 🔧 Configuration

### Firebase Setup
The application uses Firebase for authentication and data storage:
- **Authentication**: Email/password and Google OAuth
- **Firestore**: User profiles and learning data
- **Analytics**: User behavior tracking

### Mixpanel Analytics
Comprehensive event tracking including:
- Authentication events (login, signup, logout)
- User engagement (quest interactions)
- Error tracking (failed attempts)

## 🎯 User Journey

1. **Landing** → User visits the application
2. **Authentication** → Login or signup with email/Google
3. **Dashboard** → View learning progress and Kowai collection
4. **Exploration** → Click on Kowai creatures to learn more
5. **Quest** → Begin learning adventure via external survey
6. **Progress** → Track learning statistics and achievements

## 🎨 Design System

### Color Palette
- **Primary**: Emerald/Green gradients for magical feel
- **Secondary**: Purple/Blue gradients for accents
- **Background**: Dark slate theme for modern look
- **Text**: High contrast white/gray for readability

### Typography
- **Headings**: Bold, large fonts for impact
- **Body**: Clean, readable fonts for content
- **Interactive**: Clear button and link styling

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured experience for large screens
- **Touch Friendly**: Large touch targets and gestures

## 🔒 Security Features

- **Firebase Security Rules**: Secure data access
- **Authentication Validation**: Server-side verification
- **HTTPS Only**: Secure data transmission
- **Input Sanitization**: XSS protection

## 📊 Analytics Events

### Authentication Events
- `Login Attempted` - User tries to log in
- `Login Success` - Successful authentication
- `Login Failed` - Failed login attempts
- `Signup Attempted` - User registration attempts
- `Signup Success` - Successful registration
- `Logout Success` - User logout

### Engagement Events
- `Issue 2 Survey Clicked` - Quest interaction
- User identification and session tracking

## 🚀 Deployment

The application is built with Vite and can be deployed to any static hosting service:

- **Vercel** (recommended)
- **Netlify**
- **Firebase Hosting**
- **GitHub Pages**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- **Firebase** for authentication and database services
- **Mixpanel** for analytics and user tracking
- **Tailwind CSS** for the design system
- **Framer Motion** for smooth animations
- **Radix UI** for accessible components

---

**Built with ❤️ for magical learning adventures** ✨