class LexiconQuest {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'home';
        this.firebaseReady = false;
        this.init();
    }

    async init() {
        // Wait for Firebase to be available
        await this.waitForFirebase();
        this.bindEvents();
        this.setupAuthListener();
    }

    async waitForFirebase() {
        let attempts = 0;
        while (!window.firebaseAuth && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (window.firebaseAuth) {
            this.firebaseReady = true;
            console.log('Firebase initialized successfully');
        } else {
            console.error('Firebase failed to initialize');
            this.showMessage('Failed to initialize authentication system', 'error');
        }
    }

    setupAuthListener() {
        if (!this.firebaseReady) return;
        
        // Listen for authentication state changes
        window.firebaseServices.onAuthStateChanged(window.firebaseAuth, async (user) => {
            if (user) {
                // User is signed in
                this.currentUser = {
                    uid: user.uid,
                    email: user.email
                };
                
                // Load additional user data from Firestore
                await this.loadUserProfile();
                this.updateUI();
            } else {
                // User is signed out
                this.currentUser = null;
                this.updateUI();
            }
        });
    }

    async loadUserProfile() {
        if (!this.currentUser || !this.firebaseReady) return;

        try {
            const userDoc = window.firebaseServices.doc(window.firebaseDB, 'users', this.currentUser.uid);
            const docSnap = await window.firebaseServices.getDoc(userDoc);
            
            if (docSnap.exists()) {
                const userData = docSnap.data();
                this.currentUser = {
                    ...this.currentUser,
                    ...userData
                };
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    bindEvents() {
        // Navigation events
        document.getElementById('signup-btn').addEventListener('click', () => this.showSection('signup'));
        document.getElementById('profile-btn').addEventListener('click', () => this.showSection('profile'));
        document.getElementById('surveys-btn').addEventListener('click', () => this.showSection('surveys'));
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Form events
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('google-login-btn').addEventListener('click', () => this.handleGoogleLogin());
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

    showSection(sectionName) {
        // Hide all sections first
        const allSections = document.querySelectorAll('[id$="-section"]');
        allSections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show requested section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            if (targetSection.classList.contains('page')) {
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
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

    async handleLogin(e) {
        e.preventDefault();
        if (!this.firebaseReady) {
            this.showMessage('Authentication system not ready', 'error');
            return;
        }

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await window.firebaseServices.signInWithEmailAndPassword(
                window.firebaseAuth, email, password
            );
            this.showMessage('Welcome back!', 'success');
            // Clear form
            document.getElementById('login-form').reset();
        } catch (error) {
            console.error('Login error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error), 'error');
        }
    }

    async handleGoogleLogin() {
        if (!this.firebaseReady) {
            this.showMessage('Authentication system not ready', 'error');
            return;
        }

        try {
            const provider = new window.firebaseServices.GoogleAuthProvider();
            const result = await window.firebaseServices.signInWithPopup(window.firebaseAuth, provider);
            
            // Check if this is a new user and create profile if needed
            const userDoc = window.firebaseServices.doc(window.firebaseDB, 'users', result.user.uid);
            const docSnap = await window.firebaseServices.getDoc(userDoc);
            
            if (!docSnap.exists()) {
                // New user - create profile with Google info
                await window.firebaseServices.setDoc(userDoc, {
                    email: result.user.email,
                    kidsNames: [], // Empty initially, can be filled later
                    surveyResults: {},
                    createdAt: new Date().toISOString(),
                    provider: 'google'
                });
            }
            
            this.showMessage('Welcome!', 'success');
        } catch (error) {
            console.error('Google login error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error), 'error');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        if (!this.firebaseReady) {
            this.showMessage('Authentication system not ready', 'error');
            return;
        }

        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const kidsNames = document.getElementById('kids-names').value;

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            // Create user account
            const userCredential = await window.firebaseServices.createUserWithEmailAndPassword(
                window.firebaseAuth, email, password
            );

            // Save additional user data to Firestore
            const userDoc = window.firebaseServices.doc(window.firebaseDB, 'users', userCredential.user.uid);
            await window.firebaseServices.setDoc(userDoc, {
                email: email,
                kidsNames: kidsNames.split(',').map(name => name.trim()),
                surveyResults: {},
                createdAt: new Date().toISOString()
            });

            this.showMessage('Account created successfully!', 'success');
            // Clear form
            document.getElementById('signup-form').reset();
        } catch (error) {
            console.error('Signup error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error), 'error');
        }
    }

    async handlePasswordRecovery(e) {
        e.preventDefault();
        if (!this.firebaseReady) {
            this.showMessage('Authentication system not ready', 'error');
            return;
        }

        const email = document.getElementById('recovery-email').value;

        try {
            await window.firebaseServices.sendPasswordResetEmail(window.firebaseAuth, email);
            this.showMessage(`Password recovery email sent to ${email}. Please check your spam folder if you don't receive it within a few minutes.`, 'success');
            setTimeout(() => this.showSection('home'), 3000);
        } catch (error) {
            console.error('Password recovery error:', error);
            this.showMessage(this.getFirebaseErrorMessage(error), 'error');
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

    async logout() {
        if (!this.firebaseReady) return;

        try {
            await window.firebaseServices.signOut(window.firebaseAuth);
            this.showMessage('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('Error logging out', 'error');
        }
    }

    updateProfileDisplay() {
        if (this.currentUser) {
            document.getElementById('profile-email').textContent = this.currentUser.email;
            document.getElementById('profile-kids').textContent = this.currentUser.kidsNames ? this.currentUser.kidsNames.join(', ') : '';
        }
    }

    showEditProfile() {
        document.getElementById('profile-info').style.display = 'none';
        document.getElementById('edit-profile-form').classList.add('active');
        
        document.getElementById('edit-email').value = this.currentUser.email;
        document.getElementById('edit-kids-names').value = this.currentUser.kidsNames ? this.currentUser.kidsNames.join(', ') : '';
    }

    hideEditProfile() {
        document.getElementById('profile-info').style.display = 'block';
        document.getElementById('edit-profile-form').classList.remove('active');
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        if (!this.firebaseReady || !this.currentUser) return;

        const newEmail = document.getElementById('edit-email').value;
        const newKidsNames = document.getElementById('edit-kids-names').value;

        try {
            // Update Firestore document
            const userDoc = window.firebaseServices.doc(window.firebaseDB, 'users', this.currentUser.uid);
            await window.firebaseServices.updateDoc(userDoc, {
                kidsNames: newKidsNames.split(',').map(name => name.trim()),
                updatedAt: new Date().toISOString()
            });

            // Update local user data
            this.currentUser.kidsNames = newKidsNames.split(',').map(name => name.trim());

            this.hideEditProfile();
            this.updateProfileDisplay();
            this.showMessage('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Profile update error:', error);
            this.showMessage('Error updating profile', 'error');
        }
    }

    startSurvey(surveyType) {
        this.showSection(`survey-${surveyType}`);
    }

    async handleVocabSurvey(e) {
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

        // Save results to Firestore
        if (this.currentUser && this.firebaseReady) {
            try {
                const userDoc = window.firebaseServices.doc(window.firebaseDB, 'users', this.currentUser.uid);
                await window.firebaseServices.updateDoc(userDoc, {
                    [`surveyResults.vocabLevel`]: {
                        level: level,
                        responses: responses,
                        recommendations: recommendations,
                        date: new Date().toISOString()
                    }
                });
            } catch (error) {
                console.error('Error saving survey results:', error);
            }
        }

        this.showResults('Vocabulary Level Assessment', level, recommendations);
    }

    async handleLearningSurvey(e) {
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

        // Save results to Firestore
        if (this.currentUser && this.firebaseReady) {
            try {
                const userDoc = window.firebaseServices.doc(window.firebaseDB, 'users', this.currentUser.uid);
                await window.firebaseServices.updateDoc(userDoc, {
                    [`surveyResults.learningStyle`]: {
                        style: style,
                        responses: responses,
                        plan: plan,
                        date: new Date().toISOString()
                    }
                });
            } catch (error) {
                console.error('Error saving survey results:', error);
            }
        }

        this.showResults('Learning Style Assessment', `${style.charAt(0).toUpperCase() + style.slice(1)} Learner`, plan);
    }

    showResults(surveyTitle, result, recommendations) {
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div class="results-card" style="background: linear-gradient(135deg, #e8f4fd, #f0f8ff); padding: 30px; border-radius: 15px; border: 2px solid #4facfe;">
                <h3>${surveyTitle}</h3>
                <div class="result-main" style="font-size: 1.5rem; text-align: center; margin-bottom: 25px; color: #1e3c72;">
                    <strong>Result: ${result}</strong>
                </div>
                <div class="recommendations">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 1.2rem;">Recommendations:</h4>
                    <ul style="list-style: none; padding-left: 0;">
                        ${recommendations.map(rec => `<li style="background: white; padding: 12px; margin-bottom: 8px; border-radius: 5px; border-left: 4px solid #4facfe; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="next-steps" style="margin-top: 25px; padding: 20px; background: rgba(79, 172, 254, 0.1); border-radius: 10px; text-align: center; font-style: italic;">
                    <p>These recommendations are based on your responses and are now saved to your account. Try implementing these suggestions for the best learning experience!</p>
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

    getFirebaseErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'This Email or Password does not match our records';
            case 'auth/wrong-password':
                return 'This Email or Password does not match our records';
            case 'auth/invalid-credential':
                return 'This Email or Password does not match our records';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists';
            case 'auth/weak-password':
                return 'Password must be at least 6 characters';
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later';
            default:
                return error.message || 'An error occurred';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LexiconQuest();
});