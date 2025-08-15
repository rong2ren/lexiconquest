# Lexicon Quest

A web application for vocabulary learning and assessment, designed for parents to track their children's language development through interactive surveys.

## Features

### User Authentication
- User registration with parent email and kids' names
- Secure login system
- Password recovery functionality
- Session management with automatic login persistence

### User Profile Management
- View and edit parent email
- Manage children's names
- Profile information persistence

### Interactive Surveys
- **Vocabulary Level Assessment**: Determines child's current vocabulary level
- **Learning Style Preferences**: Identifies optimal learning approaches
- Single-choice question format
- Conditional results based on responses
- Personalized recommendations

### Survey Results & Recommendations
- Dynamic result generation based on survey responses
- Personalized learning recommendations
- Results storage and retrieval
- Different pathways based on user answers

## Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Responsive design with mobile-first approach
- **JavaScript**: Client-side functionality and state management

### Data Storage
- **localStorage**: Client-side data persistence
- User accounts and survey results stored locally
- No server-side dependencies

### GitHub Pages Compatibility
- Static site architecture
- No build process required
- Direct deployment to GitHub Pages

## File Structure

```
lexicon-quest/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── script.js           # Application logic and functionality
└── README.md           # Project documentation
```

## Setup Instructions

### Local Development
1. Clone or download the repository
2. Open `index.html` in any modern web browser
3. No build process or dependencies required

### GitHub Pages Deployment
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://username.github.io/repository-name`

## Usage Guide

### Getting Started
1. Open the website
2. Click "Get Started" or "Sign Up" to create an account
3. Enter parent email, password, and children's names
4. Login with your credentials

### Taking Surveys
1. Navigate to "Surveys" section
2. Choose from available assessments:
   - Vocabulary Level Assessment
   - Learning Style Preferences
3. Answer all questions by selecting radio button options
4. Submit to receive personalized results and recommendations

### Managing Profile
1. Click "Profile" to view current information
2. Use "Edit" buttons to modify email or children's names
3. Save changes to update your profile

### Password Recovery
1. Click "Forgot Password?" on login page
2. Enter your registered email
3. System will confirm recovery instructions sent (simulated)

## Survey Logic

### Vocabulary Level Assessment
- **Beginner**: Basic recommendations for early learners
- **Intermediate**: Moderate challenges for developing readers
- **Advanced**: Complex activities for proficient learners
- Results based on vocabulary knowledge and reading frequency

### Learning Style Preferences
- **Visual**: Picture-based and diagram learning approaches
- **Auditory**: Sound-based and listening activities
- **Kinesthetic**: Hands-on and physical learning methods
- **Reading/Writing**: Text-based learning preferences

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security Considerations
- Client-side only implementation
- No sensitive data transmission
- Local storage encryption recommended for production use
- Consider server-side authentication for enhanced security

## Future Enhancements
- Server-side user management
- Additional survey types
- Progress tracking over time
- Parent-child progress sharing
- Mobile application version
- Multi-language support

## License
This project is open source and available under the MIT License.