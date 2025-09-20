# Dual-Customer System Design

## Overview
This document outlines the design for accommodating two different customer groups with simplified, production-ready solutions that can be deployed quickly.

## Customer Types

### 1. Old Cohort (Existing Customers)
- **URL**: `https://lexiconquest.com/`
- **Authentication**: Parent email/password or Google OAuth
- **Experience**: Simplified profile page with Tally form link
- **Purpose**: Continue with Issue 2 via Tally form

### 2. New Customers (Kids)
- **URL**: `https://lexiconquest.com/play`
- **Authentication**: Kid's firstName + lastName + birthday
- **Experience**: Full quest experience with stats, kowais, and hardcoded quest pages
- **Purpose**: Engage new customers with complete game experience

## Data Structure

### Firebase Collections

#### Users Collection (Old Cohort - Existing)
```typescript
users/{userId} {
  email: string,
  kidsNames?: string[], // Names of kids for this parent
  createdAt: string,
  provider: 'email' | 'google' // How they signed up
}
```

#### Trainers Collection (New Customers)
```typescript
trainers/{trainerId} {
  // Basic Info
  uid: string, // Same as trainerId (first_last_birthday)
  firstName: string,
  lastName: string,
  birthday: string,
  
  // Game Data
  stats: { 
    bravery: number, 
    wisdom: number, 
    curiosity: number, 
    empathy: number 
  },
  ownedKowai: string[], // Kowai the trainer has collected
  encounteredKowai: string[], // Kowai the trainer has met but not collected
  questProgress: Record<string, any>,
  
  // Meta
  createdAt: string,
  lastLogin: string,
  provider: 'local' // Always 'local' for new customers (name + birthday signup)
}
```

### Kowai System ✅ COMPLETED
- **Default State**: New trainers start with empty `ownedKowai` array (shows egg.png)
- **Encountered Kowai**: Default includes 'lumino' and 'forcino' for testing
- **Visual Display**: 
  - Empty owned array → Shows egg with "???" name and special EggModal
  - Owned Kowai → Full color images with KowaiModal
  - Encountered Kowai → Full color images (no visual difference from owned)
- **Trading Card Design**: KowaiModal displays HP, abilities, resistances, weaknesses, evolution info
- **Kowai Data**: Complete database with Lumino, Frocino, Fanelle, Scorki, Peblaff
- **Progression**: Quest system will move Kowai from encountered → owned

## Authentication Flows

### Old Cohort Flow
1. **URL**: `https://lexiconquest.com/`
2. **Login**: Parent enters email/password or uses Google
3. **Profile**: Simple page with welcome message and Tally form button
4. **Action**: Click button → Redirect to Tally form

### New Customer Flow
1. **URL**: `https://lexiconquest.com/play`
2. **Signup**: Kid enters firstName + lastName + birthday
3. **Profile**: Full experience with stats, kowais, quest system
4. **Session**: Stays logged in until logout (using localStorage)
5. **Return**: If logged out, re-enter name + birthday to login

## New Customer Authentication Details

### Trainer ID Generation
```typescript
// Generate unique trainerId from user input
const trainerId = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${birthday}`
// Example: "john_doe_2010-05-15"

// This trainerId becomes the Firebase document ID
// Document path: trainers/john_doe_2010-05-15
```

### Firebase Lookup Strategy
```typescript
// Direct document lookup (fastest approach)
// Document ID = trainerId (first_last_birthday)
const trainerDoc = await db.collection('trainers').doc(trainerId).get()

if (trainerDoc.exists()) {
  // Login existing trainer
  const trainer = trainerDoc.data()
} else {
  // Create new trainer document with this trainerId as document ID
  await db.collection('trainers').doc(trainerId).set({
    uid: trainerId,
    firstName: "John",
    lastName: "Doe", 
    birthday: "2010-05-15",
    stats: { bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 },
    ownedKowai: [],
    encounteredKowai: ['lumino', 'forcino'],
    questProgress: {},
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    provider: "local"
  })
}
```

### Session Management with localStorage
```typescript
// After successful login
localStorage.setItem('trainerId', trainerId)
localStorage.setItem('userType', 'new_customer')

// On app load
const trainerId = localStorage.getItem('trainerId')
if (trainerId) {
  // Load trainer directly from Firebase
  const trainer = await db.collection('trainers').doc(trainerId).get()
} else {
  // Show login form
}

// On logout
localStorage.removeItem('trainerId')
localStorage.removeItem('userType')
```

### Benefits of This Approach
- **Fast Lookup**: Direct document access (O(1)) instead of queries
- **Unique IDs**: Name + birthday combination ensures uniqueness
- **Better UX**: localStorage prevents re-entering info on return visits
- **Simple Implementation**: No complex composite field queries needed
- **Document ID as Key**: trainerId becomes the Firebase document ID for instant access

## User Type Detection

### Method
- **URL-based routing**: Different URLs for different customer types
- **Collection-based detection**: users collection = old cohort, trainers collection = new customers
- **Backward compatibility**: Existing users work without changes

### Detection Logic
```typescript
// URL routing - Simple and clean
/ → Old cohort flow (AuthContext + users collection)
/play → New customer flow (PlayAuthContext + trainers collection)

// No complex user type detection needed!
// Each route uses its own AuthContext and components
```

## Implementation Plan

### Phase 1: User Type System ✅ COMPLETED
1. ✅ Create separate PlayAuthContext for new customers
2. ✅ Keep existing AuthContext for old cohort
3. ✅ Create URL-based routing system

### Phase 2: Old Cohort Simplification ✅ COMPLETED
1. ✅ Simplify ProfilePage (remove stats, kowais)
2. ✅ Keep only welcome message and Tally form button
3. ✅ Maintain existing Firebase authentication

### Phase 3: New Customer System ✅ COMPLETED
1. ✅ Create PlayAuthContext (localStorage + trainers collection)
2. ✅ Create PlayLogin component (firstName, lastName, birthday signup)
3. ✅ Create PlayProfile component (full game experience)
4. ✅ Create PlayPage component (route handler for /play)
5. ✅ Implement localStorage session management
6. ✅ Create separate Header.tsx (old cohort) and PlayHeader.tsx (new customers)
7. ✅ Create EggModal for mystery egg interactions

### Phase 4: Quest System (New Customers) 🔄 IN PROGRESS
1. 🔄 Create hardcoded quest pages
2. 🔄 Implement stat progression system
3. ✅ Build Kowai collection system
4. 🔄 Add quest completion tracking

### Phase 5: Integration & Testing 🔄 IN PROGRESS
1. 🔄 Test both customer flows
2. ✅ Verify data persistence
3. ✅ Ensure proper routing

## Technical Decisions

### Authentication
- **Old Cohort**: Keep existing Firebase Auth
- **New Customers**: Generate unique trainer IDs, store in Firebase
- **Session Management**: localStorage for new customers

### Data Storage
- **Separate Collections**: users collection for old cohort, trainers collection for new customers
- **Firebase**: All data stored in Firestore
- **Backward Compatibility**: Existing users work without changes

### Routing
- **URL-based**: Different URLs for different experiences
- **Simple Detection**: No complex logic needed
- **Future-proof**: Easy to add more user types

## Trade-offs & Limitations

### Current Limitations
1. **Old Cohort**: No individual kid profiles (parent-level only)
2. **New Customers**: Simple authentication (no email/password)
3. **Session Management**: Basic localStorage approach
4. **Quest System**: Hardcoded initially

### Future Improvements
1. **Kid Selection**: Add multiple kids per parent for old cohort
2. **Enhanced Auth**: Email/password for new customers
3. **Advanced Sessions**: More sophisticated session management
4. **Dynamic Quests**: Move from hardcoded to dynamic quest system

## File Structure Changes

### New Files ✅ COMPLETED
- ✅ `src/components/PlayProfile.tsx` (full quest experience for new customers)
- ✅ `src/components/PlayLogin.tsx` (name + birthday signup for new customers)
- ✅ `src/components/PlayPage.tsx` (route handler for /play)
- ✅ `src/contexts/PlayAuthContext.tsx` (localStorage + trainers collection auth)
- ✅ `src/components/PlayHeader.tsx` (header for new customers)
- ✅ `src/components/EggModal.tsx` (special modal for mystery egg)
- ✅ `src/data/kowaiData.ts` (Kowai trading card data)

### Modified Files ✅ COMPLETED
- ✅ `src/components/AppContent.tsx` (add routing logic)
- ✅ `src/components/ProfilePage.tsx` (simplify for old cohort - remove stats/kowais)
- ✅ `src/components/LoginPage.tsx` (keep existing for old cohort)
- ✅ `src/components/Header.tsx` (updated for old cohort)
- ✅ `src/components/KowaiModal.tsx` (updated with trading card design)
- ✅ `src/components/KowaiCard.tsx` (updated for egg handling)
- ✅ `src/App.tsx` (wrapped with both AuthProviders)

### Routing Updates
- Add `/play` route for new customers
- Update main routing logic

## Success Criteria

### Old Cohort ✅ COMPLETED
- ✅ Simple login with existing credentials
- ✅ Clean profile page with Tally form access
- ✅ No confusion or complexity
- ✅ Separate Header component

### New Customers ✅ COMPLETED
- ✅ Easy signup with kid's basic info
- ✅ Full quest experience with stats display
- ✅ Persistent session until logout
- ✅ Simple return login process
- ✅ Kowai collection system with trading card modals
- ✅ Special egg modal for mystery egg
- ✅ Separate PlayHeader component

### Technical ✅ COMPLETED
- ✅ Unified data structure
- ✅ Clean separation of user types
- ✅ Production-ready deployment
- ✅ Easy future enhancements
- ✅ URL-based routing system
- ✅ Dual authentication contexts
- ✅ Complete Kowai database

## Recent Updates & Enhancements

### UI/UX Improvements ✅ COMPLETED
- ✅ **KowaiModal Redesign**: Updated to match trading card design with HP, abilities, resistances, weaknesses
- ✅ **EggModal Creation**: Special modal for mystery egg with adventure motivation
- ✅ **Stats Section**: Added "My Stats" header with proper section styling
- ✅ **Button Consistency**: Matched button styles across components
- ✅ **Click-to-Close**: Added click-outside-to-close functionality to modals
- ✅ **Kowai Data**: Complete database with accurate trading card information

### Kowai Database ✅ COMPLETED
- ✅ **Lumino**: Ice-type basic Kowai with Snow Swirl and Quick Glide abilities
- ✅ **Frocino**: Ice-type evolved Kowai with Frost Lock and Aurora Veil abilities  
- ✅ **Fanelle**: Earth-type basic Kowai with Crystal Bloom and Stone Veil abilities
- ✅ **Scorki**: Earth-type basic Kowai with Stone Pinch and Dig Pop abilities
- ✅ **Peblaff**: Earth-type basic Kowai with Gem Slam and Moss Shield abilities

## Next Steps

1. ✅ **Core System**: Dual-customer system fully implemented
2. 🔄 **Quest System**: Implement hardcoded quest pages and stat progression
3. 🔄 **Testing**: Comprehensive testing of both customer flows
4. 🔄 **Production**: Deploy to production environment

---

*This design prioritizes simplicity and quick deployment while maintaining the ability to enhance and expand the system in the future.*
