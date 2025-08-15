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
        // Profile functionality removed - keeping basic user data only
        return;
    }

    bindEvents() {
        // Navigation events
        document.getElementById('signup-btn').addEventListener('click', () => this.showSection('signup'));
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Form events
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('google-login-btn').addEventListener('click', () => this.handleGoogleLogin());
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));
        document.getElementById('forgot-password-btn').addEventListener('click', () => this.showSection('forgot-password'));
        document.getElementById('forgot-password-form').addEventListener('submit', (e) => this.handlePasswordRecovery(e));
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
            document.getElementById('header-nav').style.display = 'block';
            document.getElementById('home-section').style.display = 'none';
            document.getElementById('logged-in-section').style.display = 'block';
        } else {
            document.getElementById('header-nav').style.display = 'none';
            document.getElementById('home-section').style.display = 'block';
            document.getElementById('logged-in-section').style.display = 'none';
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