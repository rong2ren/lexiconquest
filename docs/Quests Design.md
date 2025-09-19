# Lexicon Quest FireStorage

# Folder Structure

```jsx
issues/{issueId}
   └── nodes/{nodeId}
		   └── attempts/{attemptId}
		   └── submissions/{submissionId}

parents/{parentId}
   (email, trainers[], purchaseHistory[])

trainers/{trainersId}
   (stats, parentId, createdAt, lastLogin, progress)
   └── attempts/{attemptId}
   └── submissions/{issueId_nodeId}

kowais
```

# Issues:

```jsx
issues/issue_1
{
  "id": "issue_1",
  "title": "The Frozen Expedition",
  "purchaseLink": "https://buy.example.com/issue_1",
  "createdAt": "2025-09-14T12:00:00Z"
  "updateAt": "2025-09-15T12:00:00Z"
}
```

# Nodes

```jsx
issues/issue_1/nodes/door_riddle_1
{
  "id": "door_riddle_1",
  "title": "The Mysterious Door",
  "question": "You need to solve the riddle to open the door. Which word would you choose to complete the rhyme?",
  "type": "choice",
  "media": {
    "imageUrl": "gs://bucket/issues/issue_1/assets/door.png",
    "gifUrl": "gs://bucket/issues/issue_1/assets/door_open.gif",
    "videoUrl": "",
    "audioUrl": ""
  },
  "choices": [
    {
      "id": "earth",
      "text": "Earth",
      "isCorrect": true,
      "feedback": {
        "text": "The door opens with a satisfying click! The ancient magic recognizes your wisdom. You step through into a chamber filled with glowing crystals.",
        "media": {
          "gifUrl": "gs://bucket/issues/issue_1/assets/door_open.gif",
          "imageUrl": "gs://bucket/issues/issue_1/assets/crystal_chamber.png"
        }
      },
      "statModifiers": { 
        "bravery": 5, 
        "wisdom": 3, 
        "curiosity": 2, 
        "empathy": 0 
      },
      "rewards": {
        "kowai": ["crystal_guardian"],
        "items": ["crystal_key", "wisdom_scroll"]
      },
      "nextNodeId": "cavern_chamber_2"
    },
    {
      "id": "ice",
      "text": "Ice",
      "isCorrect": false,
      "feedback": {
        "text": "For a moment, nothing happens. Then the words on the door begin to glow red. You hear a low rumbling sound, but the door stays firmly shut. The magic seems confused - ice can be strong, but it's not really 'steady' like the poem describes.",
        "media": {
          "imageUrl": "gs://bucket/issues/issue_1/assets/door_red_glow.png",
          "gifUrl": "gs://bucket/issues/issue_1/assets/door_red_pulse.gif"
        }
      },
      "statModifiers": { 
        "bravery": 0, 
        "wisdom": -1, 
        "curiosity": 1, 
        "empathy": 0 
      },
      "rewards": {
        "kowai": [],
        "items": ["ice_fragment"]
      },
      "nextNodeId": ""
    },
    {
      "id": "moon",
      "text": "Moon",
      "isCorrect": false,
      "feedback": {
        "text": "The moonlight fades as you speak the word. The door remains closed, but you notice something interesting - the moon symbols on the door seem to shift slightly. Perhaps there's more to this riddle than meets the eye.",
        "media": {
          "imageUrl": "gs://bucket/issues/issue_1/assets/moon_fade.png",
          "gifUrl": "gs://bucket/issues/issue_1/assets/moon_symbols_shift.gif"
        }
      },
      "statModifiers": { 
        "bravery": 0, 
        "wisdom": 0, 
        "curiosity": 2, 
        "empathy": 1 
      },
      "rewards": {
        "kowai": [],
        "items": ["moon_dust", "observation_notes"]
      },
      "nextNodeId": ""
    }
  ]
}
```

# Parents

```jsx
parents/parent_a1b2c3
{
  "id": "parent_a1b2c3",
  "email": "parent@example.com",
  "createdAt": "2025-09-14T12:00:00Z",
  "trainers": [
    { "trainerId": "trainer_123", "name": "Alice" },
    { "trainerId": "trainer_456", "name": "Bob" }
  ],
  "purchaseHistory": [
    { "issueId": "issue_1", "purchasedAt": "2025-09-10T10:00:00Z" }
  ]
}
```

# Trainers

```jsx
trainers/trainer_123
{
  "id": "trainer_123",
  "parentId": "parent_a1b2c3",
  "name": "Alice",
  "createdAt": "2025-09-14T12:00:00Z",
  "lastLogin": "2025-09-14T16:00:00Z",
  "stats": {
    "bravery": 15,
    "wisdom": 12,
    "curiosity": 18,
    "empathy": 10
  },
  "unlockedKowai": ["crystal_guardian", "frosty"],
  "inventory": ["crystal_key", "wisdom_scroll", "ice_fragment"],
  "progress": [
    {
      "issueId": "issue_1",
      "nodeId": "door_riddle_1",
      "startedAt": "2025-09-14T12:30:00Z",
      "lastAccessed": "2025-09-14T12:45:00Z",
      "completedAt": null
    }
  ]
}
```

# Stat History (per trainer)

```jsx
trainers/trainer_123/statHistory/door_riddle_1_earth_20250914T125000
{
  "nodeId": "door_riddle_1",
  "choiceId": "earth",
  "changes": {
    "bravery": 5,
    "wisdom": 3,
    "curiosity": 2,
    "empathy": 0
  },
  "previousStats": {
    "bravery": 10,
    "wisdom": 9,
    "curiosity": 16,
    "empathy": 10
  },
  "newStats": {
    "bravery": 15,
    "wisdom": 12,
    "curiosity": 18,
    "empathy": 10
  },
  "timestamp": "2025-09-14T12:50:00Z",
  "reason": "Solved the door riddle with wisdom"
}
```

# Attempts (per user) → failed

```jsx
trainers/trainer_123/attempts/issue_1_door_riddle_1_20250914T124500
{
  "issueId": "issue_1",
  "nodeId": "door_riddle_1",
  "choiceId": "moon",
  "isCorrect": false,
  "timestamp": "2025-09-14T12:45:00Z"
}
```

# Attempts (per node) → failed

```jsx
issues/issue_1/nodes/door_riddle_1/attempts/trainer_123_20250914T124500
{
  "trainerId": "trainer_123",
  "choiceId": "moon",
  "isCorrect": false,
  "timestamp": "2025-09-14T12:45:00Z"
}
```

# Submissions (per user) → succeed

```jsx
trainers/trainer_123/submissions/issue_1_door_riddle_1
{
  "id": "issue_1_door_riddle_1_20250914T125000",
  "issueId": "issue_1",
  "nodeId": "door_riddle_1",
  "choiceId": "earth",
  "isCorrect": true,
  "timestamp": "2025-09-14T12:50:00Z",
  "statModifiers": { 
    "bravery": 5, 
    "wisdom": 3, 
    "curiosity": 2, 
    "empathy": 0 
  },
  "rewards": {
    "kowai": ["crystal_guardian"],
    "items": ["crystal_key", "wisdom_scroll"]
  }
}
```

# Submissions (per node) → succeed

```jsx
issues/issue_1/nodes/door_riddle_1/submissions/trainer_123
{
  "issueId": "issue_1",
  "nodeId": "door_riddle_1",
  "trainerId": "trainer_123",
  "choiceId": "earth",
  "isCorrect": true,
  "timestamp": "2025-09-14T12:50:00Z",
  "statModifiers": { 
    "bravery": 5, 
    "wisdom": 3, 
    "curiosity": 2, 
    "empathy": 0 
  },
  "rewards": {
    "kowai": ["crystal_guardian"],
    "items": ["crystal_key", "wisdom_scroll"]
  }
}
```

# Enhanced Choice Structure

Each choice in a quest node now includes:

```jsx
{
  "id": "unique_choice_id",
  "text": "Display text for the choice",
  "isCorrect": true/false,
  "feedback": {
    "text": "Rich feedback text describing what happens",
    "media": {
      "imageUrl": "gs://bucket/path/to/image.png",
      "gifUrl": "gs://bucket/path/to/animation.gif",
      "videoUrl": "gs://bucket/path/to/video.mp4",
      "audioUrl": "gs://bucket/path/to/audio.mp3"
    }
  },
  "statModifiers": {
    "bravery": number,    // Can be positive or negative
    "wisdom": number,     // Can be positive or negative
    "curiosity": number,  // Can be positive or negative
    "empathy": number     // Can be positive or negative
  },
  "rewards": {
    "kowai": ["kowai_id_1", "kowai_id_2"],  // Kowai to unlock
    "items": ["item_id_1", "item_id_2"]     // Items to add to inventory
  },
  "nextNodeId": "next_node_id",     // For correct choices
  "retryNodeId": "retry_node_id"    // For incorrect choices (optional)
}
```

# Kowais

```jsx
kowais/frosty
{
  "id": "kowai_001",
  "name": "Frosty",
  "description": "A playful ice spirit that loves riddles.",
  "imageUrl": "gs://bucket/kowais/frosty.png",
  "rarity": "basic",
  "hp": 3,
  "type": "ice",
  "resistance": ["water", "ice"],
  "weakness": ["fire", "earth"],
  "skills": [
    { "damage": "Chill Breeze", "effect": "Adds +2 wisdom" },
    { "attack": "Frozen Path", "effect": "Unlocks hidden riddle hints" }
  ]
}
```

# Items

```jsx
items/crystal_key
{
  "id": "crystal_key",
  "name": "Crystal Key",
  "description": "A shimmering key that glows with inner light. It seems to pulse with ancient magic.",
  "imageUrl": "gs://bucket/items/crystal_key.png",
  "type": "key",
  "rarity": "rare",
  "effects": {
    "unlocks": ["crystal_door", "ancient_chamber"],
    "statBonus": { "wisdom": 1 }
  }
}
```