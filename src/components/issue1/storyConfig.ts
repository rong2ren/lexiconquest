import type { StoryIssue } from '../../types/storyTypes';

// Issue 1: The Frozen Expedition
export const storyIssue1: StoryIssue = {
  id: "issue1",
  backgroundTheme: "antarctica",
  chapters: [
    {
      id: "chapter-1",
      title: "The Journey Begins",
      description: "Lumino prepares for his greatest adventure yet",
      theme: "adventure",
      pages: [
        {
          id: "page-1-1",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/lumino-waking-up.png" alt="Lumino waking up excited for adventure" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Great Expedition</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>Lumino the dragon woke up one morning with a special feeling. Today was the day of the great expedition to Antarctica! The icy continent was calling, and Lumino couldn't wait to explore its frozen mysteries.</p>
              </div>
            </div>
          `
        },
        {
          id: "page-1-2",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/friends-gathering.png" alt="Lumino with his friends Yezu and Scorki" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Gathering Friends</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>As Lumino prepared for the journey, he gathered his magical friends. There was Yezu, the wise penguin who knew all the secret paths through the ice. And Scorki, the brave seal who could dive deep into the frozen waters.</p>
              </div>
            </div>
          `
        },
        {
          id: "page-1-3",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Preparing for Adventure</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>The team packed their warmest clothes and magical supplies. Lumino's scales shimmered with excitement as he looked at the map of Antarctica. 'This will be our greatest adventure yet!' he declared.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/packing-supplies.png" alt="Team packing supplies" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-1-4",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Choose Your Companion</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>But first, Lumino needed to choose a special companion for this journey. Each friend had unique abilities that would help in different situations. Who would you choose to join Lumino on this frozen expedition?</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/choose-companion.png" alt="Choose your companion for the journey" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="1">
                🎯 Start Quest
              </button>
            </div>
          `,
          hasQuest: true,
          questNumber: 1
        }
      ]
    },
    {
      id: "chapter-2",
      title: "The Icy Path",
      description: "Journey through the frozen landscape",
      theme: "adventure",
      pages: [
        {
          id: "page-2-1",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Setting Off</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>With their chosen companion, the team set off towards Antarctica. The journey was long and cold, but their friendship kept them warm. Lumino's wings carried them over vast oceans of ice.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/journey-to-antarctica.png" alt="The team flying towards Antarctica" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-2-2",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Beautiful Ice Formations</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>As they approached the frozen continent, they saw magnificent ice formations that sparkled like diamonds in the sunlight. 'Look at those beautiful ice crystals!' exclaimed Lumino.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/ice-formations.png" alt="Beautiful ice formations in Antarctica" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-2-3",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Blizzard</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>But suddenly, a fierce blizzard began to blow! The wind howled and snow swirled around them. 'We need to find shelter quickly!' shouted Yezu. The team huddled together, trying to stay warm.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/blizzard.png" alt="A fierce blizzard approaching" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-2-4",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Ice Cave Riddle</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>In the middle of the storm, they discovered an ancient ice cave. The entrance was hidden behind a wall of snow, but Lumino's keen eyes spotted it. 'This could be our shelter!' he said. But there was a problem - the cave entrance was blocked by a mysterious riddle carved in ice.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/ice-cave-riddle.png" alt="Ancient riddle carved in ice" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="2">
                🎯 Start Quest
              </button>
            </div>
          `,
          hasQuest: true,
          questNumber: 2
        }
      ]
    },
    {
      id: "chapter-3",
      title: "The Ice Cave Mystery",
      description: "Explore the mysterious underground cave",
      theme: "mystery",
      pages: [
        {
          id: "page-3-1",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Inside the Cave</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>After solving the riddle, the team entered the mysterious ice cave. Inside, they found walls covered in ancient drawings and strange symbols. 'These look like they've been here for thousands of years!' whispered Scorki.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/cave-interior.png" alt="Ancient drawings on cave walls" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-3-2",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Underground Lake</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>As they explored deeper into the cave, they discovered a beautiful underground lake. The water was crystal clear and seemed to glow with its own light. 'This is magical!' said Lumino in wonder.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/underground-lake.png" alt="Magical underground lake" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-3-3",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Cave Collapse</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>But their peaceful exploration was interrupted by a loud rumbling sound. The cave walls began to shake! 'What's happening?' asked Yezu. They realized they were in an avalanche zone, and the cave was starting to collapse!</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/cave-collapse.png" alt="Cave walls shaking and collapsing" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-3-4",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Escape Decision</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>The team needed to make a quick decision. They could try to escape through the way they came, or they could venture deeper into the cave to find another exit. The choice was urgent - their safety depended on it!</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/escape-decision.png" alt="Team deciding which way to escape" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="3">
                🎯 Start Quest
              </button>
            </div>
          `,
          hasQuest: true,
          questNumber: 3
        }
      ]
    },
    {
      id: "chapter-4",
      title: "The Hidden Treasure",
      description: "Discover ancient secrets and treasures",
      theme: "discovery",
      pages: [
        {
          id: "page-4-1",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Crystal Chamber</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>Their choice led them to a hidden chamber deep within the cave. The walls were covered in glowing crystals that cast beautiful patterns of light across the room. 'This is incredible!' breathed Lumino.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/crystal-chamber.png" alt="Chamber filled with glowing crystals" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-4-2",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Treasure Chest</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>In the center of the chamber, they found an ancient treasure chest made of ice. It was locked with a complex mechanism that required solving a series of puzzles. 'This must be the legendary treasure of Antarctica!' said Yezu excitedly.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/treasure-chest.png" alt="Ancient ice treasure chest" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-4-3",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Opening the Chest</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>The chest was protected by magical ice that could only be opened by someone with a pure heart. Lumino stepped forward and placed his paw on the chest. The ice began to melt, revealing a beautiful collection of ancient artifacts.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/opening-chest.png" alt="Lumino opening the treasure chest" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-4-4",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Magical Treasures</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>Inside the chest, they found a magical compass that could guide them through any storm, a warm cloak that never got cold, and most importantly, a map showing the location of other hidden treasures across Antarctica.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/treasure-revealed.png" alt="Magical treasures revealed" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="4">
                🎯 Start Quest
              </button>
            </div>
          `,
          hasQuest: true,
          questNumber: 4
        }
      ]
    },
    {
      id: "chapter-5",
      title: "The Final Challenge",
      description: "Face the ultimate test of wisdom and teamwork",
      theme: "friendship",
      pages: [
        {
          id: "page-5-1",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Mysterious Voice</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>With their new treasures, the team felt ready for any challenge. But as they prepared to leave the cave, they heard a mysterious voice echoing through the ice walls. 'Only those who prove their wisdom can leave this place safely.'</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/mysterious-voice.png" alt="Mysterious voice echoing through cave" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-5-2",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Final Puzzle</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>The voice presented them with a final test - they had to work together to solve a complex puzzle that required all their skills. Lumino's courage, Yezu's wisdom, and Scorki's bravery would all be needed.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/final-puzzle.png" alt="Complex puzzle requiring teamwork" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-5-3",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Puzzle Solved</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>The puzzle was challenging, but working together, they managed to solve it. The cave walls began to glow with a warm, golden light, and a path appeared leading them safely back to the surface.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/puzzle-solved.png" alt="Team celebrating solving the puzzle" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-5-4",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Victory Celebration</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>As they emerged from the cave, they saw that the blizzard had stopped and the sun was shining brightly. 'We did it!' cheered Lumino. 'We've completed our first Antarctic adventure!'</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/victory-celebration.png" alt="Team celebrating their victory" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="5">
                🎯 Start Quest
              </button>
            </div>
          `,
          hasQuest: true,
          questNumber: 5
        }
      ]
    },
    {
      id: "chapter-6",
      title: "New Adventures Await",
      description: "Plan for future expeditions and discoveries",
      theme: "adventure",
      pages: [
        {
          id: "page-6-1",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Celebration at Base Camp</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>Back at their base camp, the team celebrated their successful expedition. They had discovered ancient secrets, solved challenging puzzles, and most importantly, learned the value of friendship and teamwork.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/celebration.png" alt="Team celebrating at base camp" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-6-2",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">Future Adventures</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>Lumino looked at the map they had found, showing many more locations across Antarctica waiting to be explored. 'This is just the beginning of our adventures!' he said with excitement.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/future-adventures.png" alt="Map showing future adventure locations" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-6-3",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-left">
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>As the sun set over the frozen landscape, the team made plans for their next expedition. There were still many mysteries to solve and treasures to discover in the magical world of Antarctica.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/sunset-antarctica.png" alt="Story image" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
        {
          id: "page-6-4",
          htmlContent: `
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <h2 class="text-2xl font-bold text-slate-800 mb-4 text-center bg-gradient-to-r from-yellow-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">The Adventure Continues</h2>
              <div class="text-slate-800 text-lg leading-relaxed">
                <p>The adventure had taught them that with courage, wisdom, curiosity, and empathy, they could overcome any challenge. And so, with hearts full of excitement and minds full of wonder, they prepared for whatever adventures lay ahead.</p>
              </div>
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <img src="/images/team-together.png" alt="Team together ready for new adventures" class="max-w-full h-auto rounded-lg shadow-lg mx-auto" />
            </div>
            <div class="mb-8 p-6 rounded-2xl bg-white/60 border border-blue-300/50 text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="6">
                🎯 Start Quest
              </button>
            </div>
          `,
          hasQuest: true,
          questNumber: 6
        }
      ]
    }
  ]
};
