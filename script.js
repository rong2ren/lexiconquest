class LexiconQuest {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('lexicon-users') || '{}');
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthState();
    }

    bindEvents() {
        // Navigation events
        document.getElementById('signup-btn').addEventListener('click', () => this.showSection('signup'));
        document.getElementById('profile-btn').addEventListener('click', () => this.showSection('profile'));
        document.getElementById('surveys-btn').addEventListener('click', () => this.showSection('surveys'));
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Form events
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));
        document.getElementById('forgot-password-btn').addEventListener('click', () => this.showSection('forgot-password'));
        document.getElementById('forgot-password-form').addEventListener('submit', (e) => this.handlePasswordRecovery(e));

        // Profile events
        document.getElementById('edit-email-btn').addEventListener('click', () => this.showEditProfile());
        document.getElementById('profile-form').addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('cancel-edit-btn').addEventListener('click', () => this.hideEditProfile());

        // Survey events
        document.querySelectorAll('.start-survey').forEach(btn => {
            btn.addEventListener('click', (e) => this.startSurvey(e.target.dataset.survey));
        });
        document.getElementById('vocab-level-form').addEventListener('submit', (e) => this.handleVocabSurvey(e));
        document.getElementById('learning-style-form').addEventListener('submit', (e) => this.handleLearningSurvey(e));
        document.getElementById('back-to-surveys-btn').addEventListener('click', () => this.showSection('surveys'));
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('lexicon-current-user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    showSection(sectionName) {
        // Hide all sections and pages
        const sections = document.querySelectorAll('[id$="-section"]');
        const pages = document.querySelectorAll('.page');
        sections.forEach(section => section.style.display = 'none');
        pages.forEach(page => page.classList.remove('active'));

        // Show requested section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            if (targetSection.classList.contains('page')) {
                targetSection.classList.add('active');
            } else {
                targetSection.style.display = 'block';
            }
            this.currentSection = sectionName;
        }

        // Special handling for profile section
        if (sectionName === 'profile' && this.currentUser) {
            this.updateProfileDisplay();
        }
    }

    handleGetStarted() {
        if (this.currentUser) {
            this.showSection('surveys');
        } else {
            this.showSection('signup');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (this.users[email] && this.users[email].password === password) {
            this.currentUser = this.users[email];
            localStorage.setItem('lexicon-current-user', JSON.stringify(this.currentUser));
            this.updateUI();
            this.showMessage('Welcome back!', 'success');
        } else {
            this.showMessage('Invalid email or password', 'error');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const kidsNames = document.getElementById('kids-names').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        if (this.users[email]) {
            this.showMessage('Email already exists', 'error');
            return;
        }

        const newUser = {
            email: email,
            password: password,
            kidsNames: kidsNames.split(',').map(name => name.trim()),
            surveyResults: {}
        };

        this.users[email] = newUser;
        localStorage.setItem('lexicon-users', JSON.stringify(this.users));

        this.currentUser = newUser;
        localStorage.setItem('lexicon-current-user', JSON.stringify(this.currentUser));

        this.updateUI();
        this.showMessage('Account created successfully!', 'success');
    }

    handlePasswordRecovery(e) {
        e.preventDefault();
        const email = document.getElementById('recovery-email').value;

        if (this.users[email]) {
            // In a real app, this would send an email
            this.showMessage(`Password recovery instructions sent to ${email}`, 'success');
            setTimeout(() => this.showSection('login'), 2000);
        } else {
            this.showMessage('Email not found', 'error');
        }
    }

    updateUI() {
        if (this.currentUser) {
            document.getElementById('nav-authenticated').style.display = 'flex';
            document.getElementById('home-section').style.display = 'none';
            document.getElementById('welcome-message').textContent = `Welcome, ${this.currentUser.email}`;
            this.showSection('surveys');
        } else {
            document.getElementById('nav-authenticated').style.display = 'none';
            document.getElementById('home-section').style.display = 'block';
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('lexicon-current-user');
        this.updateUI();
        this.showMessage('Logged out successfully', 'success');
    }

    updateProfileDisplay() {
        if (this.currentUser) {
            document.getElementById('profile-email').textContent = this.currentUser.email;
            document.getElementById('profile-kids').textContent = this.currentUser.kidsNames.join(', ');
        }
    }

    showEditProfile() {
        document.getElementById('profile-info').style.display = 'none';
        document.getElementById('edit-profile-form').classList.add('active');
        
        document.getElementById('edit-email').value = this.currentUser.email;
        document.getElementById('edit-kids-names').value = this.currentUser.kidsNames.join(', ');
    }

    hideEditProfile() {
        document.getElementById('profile-info').style.display = 'block';
        document.getElementById('edit-profile-form').classList.remove('active');
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        const newEmail = document.getElementById('edit-email').value;
        const newKidsNames = document.getElementById('edit-kids-names').value;

        // Update user data
        const oldEmail = this.currentUser.email;
        this.currentUser.email = newEmail;
        this.currentUser.kidsNames = newKidsNames.split(',').map(name => name.trim());

        // Update in storage
        if (oldEmail !== newEmail) {
            delete this.users[oldEmail];
        }
        this.users[newEmail] = this.currentUser;
        localStorage.setItem('lexicon-users', JSON.stringify(this.users));
        localStorage.setItem('lexicon-current-user', JSON.stringify(this.currentUser));

        this.hideEditProfile();
        this.updateProfileDisplay();
        this.updateUI();
        this.showMessage('Profile updated successfully!', 'success');
    }

    startSurvey(surveyType) {
        this.showSection(`survey-${surveyType}`);
    }

    handleVocabSurvey(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const responses = {};
        
        for (let [key, value] of formData.entries()) {
            responses[key] = value;
        }

        // Calculate results based on responses
        let level = 'Beginner';
        let recommendations = [];

        if (responses.enormous === 'huge' && responses.reading === 'daily') {
            level = 'Advanced';
            recommendations = [
                'Try complex word puzzles',
                'Read challenging books',
                'Practice etymology exercises'
            ];
        } else if (responses.enormous === 'huge' || responses.reading === 'weekly') {
            level = 'Intermediate';
            recommendations = [
                'Build vocabulary with flashcards',
                'Read grade-appropriate books',
                'Play word association games'
            ];
        } else {
            level = 'Beginner';
            recommendations = [
                'Start with picture books',
                'Use simple word games',
                'Practice basic sight words'
            ];
        }

        // Store results
        this.currentUser.surveyResults.vocabLevel = {
            level: level,
            responses: responses,
            recommendations: recommendations,
            date: new Date().toISOString()
        };

        this.users[this.currentUser.email] = this.currentUser;
        localStorage.setItem('lexicon-users', JSON.stringify(this.users));
        localStorage.setItem('lexicon-current-user', JSON.stringify(this.currentUser));

        this.showResults('Vocabulary Level Assessment', level, recommendations);
    }

    handleLearningSurvey(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const responses = {};
        
        for (let [key, value] of formData.entries()) {
            responses[key] = value;
        }

        // Generate personalized learning plan
        let style = responses['learning-method'] || 'mixed';
        let plan = [];

        switch(style) {
            case 'visual':
                plan = [
                    'Use colorful vocabulary cards',
                    'Create mind maps for word families',
                    'Watch educational videos with subtitles'
                ];
                break;
            case 'auditory':
                plan = [
                    'Practice pronunciation with audio clips',
                    'Listen to audiobooks',
                    'Use rhyming and rhythm exercises'
                ];
                break;
            case 'kinesthetic':
                plan = [
                    'Use letter tiles and word building blocks',
                    'Create physical word games',
                    'Practice writing words in sand or clay'
                ];
                break;
            case 'reading':
                plan = [
                    'Keep a vocabulary journal',
                    'Read diverse genres regularly',
                    'Practice creative writing exercises'
                ];
                break;
            default:
                plan = [
                    'Mix different learning activities',
                    'Try various approaches to find what works',
                    'Combine visual, audio, and hands-on methods'
                ];
        }

        // Store results
        this.currentUser.surveyResults.learningStyle = {
            style: style,
            responses: responses,
            plan: plan,
            date: new Date().toISOString()
        };

        this.users[this.currentUser.email] = this.currentUser;
        localStorage.setItem('lexicon-users', JSON.stringify(this.users));
        localStorage.setItem('lexicon-current-user', JSON.stringify(this.currentUser));

        this.showResults('Learning Style Assessment', `${style.charAt(0).toUpperCase() + style.slice(1)} Learner`, plan);
    }

    showResults(surveyTitle, result, recommendations) {
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div class="results-card">
                <h3>${surveyTitle}</h3>
                <div class="result-main">
                    <strong>Result: ${result}</strong>
                </div>
                <div class="recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="next-steps">
                    <p>These recommendations are based on your responses. Try implementing these suggestions for the best learning experience!</p>
                </div>
            </div>
        `;
        this.showSection('results');
    }

    showMessage(message, type) {
        // Hide existing messages
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Show appropriate message
        if (type === 'error') {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        } else if (type === 'success') {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
        }

        // Remove after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';
        }, 5000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LexiconQuest();
});