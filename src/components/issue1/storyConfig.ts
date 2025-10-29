import type { StoryIssue } from '../../types/storyTypes';

export const storyIssue1: StoryIssue = {
  id: "issue1",
  chapters: [
    {
      id: "chapter-1",
      title: "A Strange Invitation",
      pages: [
        {
          id: "page-1-1",
          htmlContent: `
            <div class="p-6 rounded-2xl text-center relative min-h-[70vh] flex flex-col justify-center items-center text-white" 
                 style="background-image: url('/issues/issue1/background.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">Chapter 1</h2>
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">A Strange Invitation</h2>
            </div>
            `
        },
        {
          id: "page-1-2",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <h2 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">I'M GLAD YOU ARE HERE...</h2>
              <div class="text-lg leading-relaxed p-2 space-y-4">
                <p>Now listen carefully. You have been chosen.</p>
                <p>Not everyone gets this magical invitation. We've seen your curiosity and your kindness. So we've decided on you.</p>
                <p>We invite you to become a Kowai Trainer.</p>
                <p>Oh, I can see you have so many questions bubbling up. Be patient, young one. Let me explain.</p>
                <p>You see, in our magical world called <span class="text-yellow-600 font-bold text-xl font-gagalin">LEXICON</span>, there are special creatures named <span class="text-pink-600 font-bold text-xl font-gagalin">Kowai</span>. Some fluffy like snowballs, others sparkling with tiny lightning bolts. Each Kowai has amazing powers that will take your breath away.</p>
                <p>But here's the most wonderful part: every Kowai chooses one special human to be their friend forever. This person becomes a <span class="text-blue-600 font-bold text-xl font-gagalin">Kowai Trainer</span>.</p>
              </div>
            </div>
          `
        },
        {
          id: "page-1-3",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Text -->
                <div class=" text-lg leading-relaxed space-y-4">
                  <p>I am the Headmistress of <span class="text-yellow-600 font-bold text-xl font-gagalin">Starlight College</span>. </p>
                  <p>We teach young explorers like you how to bond with Kowai, how to help them grow strong, and how to unlock the greatest potential in both your Kowai and yourself.</p>
                  <p>We have given you your first <span class="text-pink-600 font-bold text-xl font-gagalin">Kowai egg</span>. Inside sleeps one of three Kowai, waiting to meet you.</p>
                  <p>Come now. Look at them carefully. You are choosing a friend for life. Feel it... which one is the most special to you?</p>
                </div>
                
                <!-- Right column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/kowai/egg.gif" class="max-w-full h-auto rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-4",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/fanelle.png" alt="Fanelle" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-yellow-600 mb-4 font-gagalin">SPECIAL LOOK</h3>
                  <p class="text-lg leading-relaxed">Fanelle's antlers grow clusters of glowing crystals that change color depending on its emotions.</p>
                  <p class="text-lg leading-relaxed">Sensitive ears help Fanelle hear sounds from great distances — even snowflakes falling.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-5",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/fanelle.png" alt="Fanelle" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-pink-600 mb-4 font-gagalin">PERSONALITY</h3>
                  <p class="text-lg leading-relaxed">Loves rainy and snowy nights and places where the winds are gentle.</p>
                  <p class="text-lg leading-relaxed">Natural peacemaker — it dislikes conflict and tries to bring harmony to any group.</p>
                  <p class="text-lg leading-relaxed">Shy at first, but once Fanelle bonds with a Trainer, it gives them its full trust and stays deeply loyal.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-6",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/fanelle.png" alt="Fanelle" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-blue-600 mb-4 font-gagalin">ABILITY</h3>
                  <p class="text-lg leading-relaxed"><span class="font-bold">Crystal Bloom:</span> Fanelle sends a burst of sparkling energy from its antlers, stunning nearby enemies.</p>
                  <p class="text-lg leading-relaxed"><span class="font-bold">Stone Veil:</span> Can form a protective crystal shield around itself or a friend for a short time.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-7",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/scorki.png" alt="Scorki" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-yellow-600 mb-4 font-gagalin">SPECIAL LOOK</h3>
                  <p class="text-lg leading-relaxed">Scorki is flexible; it is an excellent climber across rocky cliffs and cavern walls.</p>
                  <p class="text-lg leading-relaxed">It prefers to stay in dry, stony habitats and can go days without food.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-8",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/scorki.png" alt="Scorki" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-pink-600 mb-4 font-gagalin">PERSONALITY</h3>
                  <p class="text-lg leading-relaxed">Scorki is smart and calm. It prefers doing things on its own and rarely makes a sound.</p>
                  <p class="text-lg leading-relaxed">Scorki may not always stay by your side, but if the Trainer is in trouble, it appears immediately.</p>
                  <p class="text-lg leading-relaxed">Calm and cool-headed even in dangerous moments, it carefully watches and waits before acting.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-9",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/scorki.png" alt="Scorki" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-blue-600 mb-4 font-gagalin">ABILITY</h3>
                  <p class="text-lg leading-relaxed"><span class="font-bold">Stone Pinch:</span> Uses its strong pincers to pinch enemies sharply. This move is quick and precise.</p>
                  <p class="text-lg leading-relaxed"><span class="font-bold">Dig Pop:</span> Scorki quickly digs into the ground and pops up in another spot. It's a sneaky way to escape.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-10",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/peblaff.png" alt="Peblaff" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-yellow-600 mb-4 font-gagalin">SPECIAL LOOK</h3>
                  <p class="text-lg leading-relaxed">Peblaff's soft fur hides a strong, rocky body underneath, making it much tougher than it looks.</p>
                  <p class="text-lg leading-relaxed">Its sturdy body helps it stay balanced and steady, even in bumpy or shaky places.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-11",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/peblaff.png" alt="Peblaff" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-pink-600 mb-4 font-gagalin">PERSONALITY</h3>
                  <p class="text-lg leading-relaxed">Peblaff is playful and goofy — it loves to roll around, chase fireflies, and turn anything into a game.</p>
                  <p class="text-lg leading-relaxed">It's friendly and loves cheering others up, especially when things feel sad or a little scary.</p>
                  <p class="text-lg leading-relaxed">Peblaff treats its Trainer like a family and loves cuddling up beside them.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-12",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Picture -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/peblaff.png" alt="Peblaff" class="max-w-full h-120 rounded-lg shadow-lg" />
                </div>
                
                <!-- Right column - Information -->
                <div class="space-y-4">
                  <h3 class="text-2xl font-bold text-blue-600 mb-4 font-gagalin">ABILITY</h3>
                  <p class="text-lg leading-relaxed"><span class="font-bold">Gem Slam:</span> It stomps with its crystal-covered paws, shaking the ground beneath its feet.</p>
                  <p class="text-lg leading-relaxed"><span class="font-bold">Moss Shield:</span> Peblaff curls into a ball, and the moss on its body puffs out to block enemy attacks.</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-1-13",
          hasQuest: true,
          htmlContent: `
            <div class="p-10 rounded-2xl bg-blue-100 text-center my-12">
              <h2 class="text-3xl font-bold text-cyan-600 font-gagalin mb-12">
                Which Kowai Egg will you choose?
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <!-- Fanelle Egg -->
                <div class="flex flex-col items-center space-y-4">
                  <img src="/kowai/fanelle egg.png" alt="Fanelle Egg" class="w-32 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                </div>
                
                <!-- Scorki Egg -->
                <div class="flex flex-col items-center space-y-4">
                  <img src="/kowai/scorki egg.png" alt="Scorki Egg" class="w-32 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                </div>
                
                <!-- Peblaff Egg -->
                <div class="flex flex-col items-center space-y-4">
                  <img src="/kowai/peblaff egg.png" alt="Peblaff Egg" class="w-32 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
                <button class="text-white bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500  font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="1">
                  Choose Your Kowai
                </button>
              </div>
          `
        },
        {
          id: "page-1-14",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <h2 class="text-2xl font-bold text-center text-cyan-600 mb-6 font-gagalin">
                The Journey Begins
              </h2>
              
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>Good, you have made your choice. I can already sense a special bond forming between you and your chosen Kowai.</p>
                <p>But becoming a Kowai trainer is not easy. You'll journey across sparkling lakes, endless forests, and ancient ruins, each hiding secrets of its own.</p>
                <p>So, before we can awaken your sleeping companion, we need to make sure you are truly ready. We will give you a series of challenges. Only those who complete them all shall join us in the magical Lexicon world, to write your own glorious story alongside your Kowai.</p>
                <p>Show us your <span class="text-blue-600 font-bold text-xl font-gagalin">BRAVERY</span>, <span class="text-yellow-600 font-bold text-xl font-gagalin">WISDOM</span>, <span class="text-green-600 font-bold text-xl font-gagalin">CURIOSITY</span>, and <span class="text-pink-600 font-bold text-xl font-gagalin">EMPATHY</span>. Prove yourself to us.</p>
                <p>Get Ready.</p>
              </div>
            </div>
          `
        },
      ]
    },
    {
      id: "chapter-2",
      title: "The First Challenge",
      pages: [
        {
          id: "page-2-1",
          htmlContent: `
            <div class="p-6 rounded-2xl text-center relative min-h-[70vh] flex flex-col justify-center items-center" 
                 style="background-image: url('/issues/issue1/chapter2_background.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">Chapter 2</h2>
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">The First Challenge</h2>
            </div>
          `
        },
        {
          id: "page-2-2",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>As you close the strange letter, the words begin to fade from the page. Suddenly, your room starts to spin like a whirlwind around you. You feel so dizzy that you have to squeeze your eyes shut tight.</p>
                <p>Then everything changes.</p>
                <p>A cold wind brushes against your cheek. Icy air slips through your shirt and makes you shiver. When you finally dare to open your eyes….</p>
                <p>It's white everywhere.</p>
                <p>Endless snow stretches in every direction. No trees, no grass, no signs of life. The sky hangs dark and heavy above you, even though your watch says it's 11 in the morning. The sun sits low on the horizon, as if it's too tired to climb higher.</p>
                <p>Where are you?</p>
              </div>
            </div>
          `
        },
        {
          id: "page-2-3",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>At your feet, you discover a backpack. Inside, you find cookies, water, winter jackets, and... a map?</p>
                <p>Your frozen fingers fumble to open the map. As you spread it carefully on the ground, magical white words begin to glow across its surface:</p>
                <div class="bg-blue-100 p-6 rounded-lg my-6">
                  <p class="text-slate-800 text-lg leading-relaxed text-center">
                    At the bottom of the world so wide, where snowy silence grows.<br>
                    Mountains sleep beneath the ice, where hidden fire glows.<br>
                    The sun may shine for weeks on end, then vanish from the sky.<br>
                    And glowing lights in purple-green will swirl and flicker by.
                  </p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-2-4",
          hasQuest: true,
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <h2 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">Your Mission: Find the Continent</h2>
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>It's a riddle! This must be your first challenge. The headmistress wants you to figure out exactly where the magic has brought you.</p>
                <img src="/issues/issue1/world_map.png" alt="World Map" class="max-w-full h-90 rounded-lg shadow-lg mx-auto" />
                <p>Use the riddle's clues to discover which continent you're standing on right now.</p>
              </div>
               <div class="rounded-2xl text-center text-white mt-2">
                <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500  font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="2">
                  Find the Continent
                </button>
              </div>
            </div>
           
          `
        },
      ]
    },
    {
      id: "chapter-3",
      title: "A Lumino",
      pages: [
        {
          id: "page-3-1",
          htmlContent: `
            <div class="p-6 rounded-2xl text-center relative min-h-[70vh] flex flex-col justify-center items-center" 
                 style="background-image: url('/issues/issue1/chapter3_background.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">Chapter 3</h2>
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">A Lumino</h2>
            </div>
          `
        },
        {
          id: "page-3-2",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>You fold the map carefully, feeling confused. What could the rest of the challenges be? Just as you scratch your head in thought, you catch something in the corner of your eye — a flash of blue and purple racing across the snow.</p>
                <p>What was that?</p>
                <p>Your heart pounds with excitement as you quickly chase after it. This is the first living thing you've found in Antarctica. The creature notices you following and gracefully climbs to the top of a small snow hill, then turns to look at you with large, curious eyes.</p>
              </div>
            </div>
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Last two paragraphs -->
                <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                  <p>It's a <span class="text-pink-600 font-bold text-xl font-gagalin">KOWAI</span>!</p>
                  <p>You're certain you've never seen this type of creature before. It looks like a small fox, but its fur ripples with waves of blue and purple light. Its tail flows behind it like soft silk dancing in the wind.</p>
                </div>
                
                <!-- Right column - Image -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/lumino.png" alt="Lumino the Kowai" class="max-w-full h-auto rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-3-3",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>This beautiful creature must be connected to my next challenge! You think. With eager hands, you unfold the magical map once more, and you're not surprised to see new words already appearing.</p>
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-blue-100 text-center">
              <h3 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">❄️ LUMINO ❄️</h3>
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>An ice-bonded Kowai who is shy and cautious. It observes humans carefully and takes a long time to build trust.</p>
                <p>Young Luminos make a once-in-a-lifetime journey to the <span class="font-bold text-blue-600 font-gagalin">SOUTH POLE</span> to complete an evolution that strengthens their ice powers.</p>
                <p>They travel in packs for safety. But they have to reach the South Pole before the <span class="font-bold text-purple-600 font-gagalin">POLAR NIGHT</span> begins, where the sun never rises for months. If they don't, they risk being caught in endless darkness — that is when the ancient snow beast known as the <span class="font-bold text-red-600 font-gagalin">YEZU</span> awakens.</p>
              </div>
            </div>
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>As you read about Lumino, you look up at the small creature still perched on the snow hill. You glance around the endless white landscape. Where is its group? Young Luminos are supposed to travel together for safety, but this one is completely alone.</p>
              </div>
            </div>
          `
        },
        {
          id: "page-3-4",
          hasQuest: true,
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>The Lumino makes a soft, worried sound. You can see it looking at you nervously, ready to run away at any sudden movement. But you can also see curiosity in its sparkling eyes. You suddenly understand what it is thinking — it's lost. It has been alone all by itself for too long. And now it has finally found you, so it doesn't want you to leave.</p>
                <p>Your heart goes out to the little creature. Maybe…maybe we can be friends. You think. Maybe I can help it.</p>
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-blue-100 text-center">
              <h3 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">Your Choice: Build Trust with Lumino</h3>
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>You want to help the lost and helpless young Lumino. But first, you need to gain its trust. What would you do?</p>
                <div class="space-y-3">
                  <p>1. Slowly approach the Lumino with your hands open to show you're friendly.</p>
                  <p>2. Sit in the snow and let Lumino decide if it wants to come closer.</p>
                  <p>3. Take out cookies from your backpack to share as a friendship gift.</p>
                </div>
              </div>
            </div>
            <div class="p-6 rounded-2xl text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500  font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="3">
                Make Your Choice
              </button>
            </div>
          `
        },
        {
          id: "page-3-5",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>The Lumino senses your kind intentions, but it doesn't come closer. You unfold the magical map again, hoping for guidance. New words shimmer across the surface:</p>
                <p>As a future Kowai Trainer, you need wisdom to help those in need. Now, it's your chance: guide this lost Lumino to the South Pole safely.</p>
                <p>But first, you must know the path.</p>
                <div class="p-6 rounded-2xl bg-blue-100 text-center">
                  <h3 class="mb-4 text-2xl font-bold text-cyan-600 text-center font-gagalin">Your Mission: Find a Way to South Pole</h3>
                   <p>Before you can help the Lumino, you need to understand how to read directions using a compass.</p>
                   <div class="mt-2 p-4 rounded-lg bg-white/80 border border-gray-200">
                     <h4 class="text-lg font-bold text-slate-800 mb-3 text-center">Compass Directions</h4>
                     <div class="grid grid-cols-3 gap-4 text-sm">
                       <div class="flex justify-center">
                         <img src="/issues/issue1/compass.png" alt="Compass" class="w-36 h-auto" />
                       </div>
                       <div class="space-y-4">
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">N:</span>  North</div>
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">S:</span>  South</div>
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">E:</span>  East</div>
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">W:</span>  West</div>
                       </div>
                       <div class="space-y-4">
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">NE:</span>  Northeast</div>
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">SE:</span>  Southeast</div>
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">SW:</span>  Southwest</div>
                         <div class="text-center"><span class="font-bold text-blue-600 font-gagalin">NW:</span>  Northwest</div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-3-6",
          hasQuest: true,
          htmlContent: `
            <div class="p-6 rounded-2xl text-left text-slate-800 text-lg leading-relaxed space-y-4">
            <p>Now you need to be a <span class="font-bold text-blue-600">detective</span>! Use below clues to answer: Which grid coordinate are you standing on right now?</p>
              <div class="text-slate-800 text-lg leading-relaxed space-y-4 mt-4">
                <div class="p-6 rounded-2xl bg-blue-100 space-y-4">
                <h3 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">Position Riddle</h3>
                  <p>You look toward the North and see Mount Vinson, the highest mountain in Antarctica, rising into the sky.</p>
                  <p>You turn and look toward the South East. There you spot Mount Sidley, Antarctica's highest volcano, covered in white snow.</p>
                  <p>You're standing exactly on one of the grid points (such as C4 or G5).</p>
                  <img src="/issues/issue1/map.png" alt="Map to South Pole" class="max-w-full h-110 rounded-lg shadow-lg mx-auto" />
                </div>
              </div>

              <div class="rounded-2xl text-center mt-6">
                <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500  font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="4">
                  Find Your Exact Position
                </button>
              </div>
            </div>
          `
        },
        {
          id: "page-3-7",
          hasQuest: true,
          htmlContent: `
            <div class="p-6 rounded-2xl text-left text-slate-800 text-lg leading-relaxed space-y-4">
            <p><span class="font-bold text-yellow-600">Great work!</span> You've figured out where you and Lumino are standing. But now comes the next challenge — you need to plan the shortest possible route to get Lumino to the South Pole before it's too late.</p>
              <div class="text-slate-800 text-lg leading-relaxed space-y-4 mt-4">
                <div class="p-6 rounded-2xl bg-blue-100 space-y-4">
                <h3 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">Find the Shortest Path to the South Pole</h3>
                  <p>You must follow the grid lines - you cannot cut across the wilderness between grid points.</p>
                  <p>You and Lumino are too weak to climb over <span class="font-bold text-blue-600">Mount Vinson</span>, so you must go around it.</p>
                  <p>You cannot leave Antarctica and travel over the ocean.</p>
                  <p>There are <span class="font-bold text-red-600">dangerous monsters</span> along some paths. You can still use those routes, just be extra careful and quiet.</p>
                </div>                
              </div>

              <div class="rounded-2xl text-center mt-6">
                <button class="text-white bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500  font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="5">
                  Find the Shortest Path to the South Pole
                </button>
              </div>
            </div>
          `
        },
        {
          id: "page-3-8",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>As you finally figure out the path to the South Pole, you feel confident that you can lead Lumino the right way.</p>
                <p>If the Lumino is brave enough to make this journey alone, then I'll be brave enough to walk alongside it.</p>
                <p>Tomorrow, you will follow the frost.</p>
              </div>
            </div>
          `
        },
      ]
    },
    {
      id: "chapter-4",
      title: "When Darkness Falls",
      pages: [
        {
          id: "page-4-1",
          htmlContent: `
            <div class="p-6 rounded-2xl text-center relative min-h-[70vh] flex flex-col justify-center items-center text-cyan-600" 
                 style="background-image: url('/issues/issue1/chapter4_background.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">Chapter 4</h2>
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">When Darkness Falls</h2>
            </div>
          `
        },
        {
          id: "page-4-2",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>When you wake up this morning, something feels wrong. The sky is still pitch black. You check your watch twice, making sure it really is morning, but no sun appears anywhere — just endless darkness and bone-chilling cold. The <span class="font-bold text-purple-600 font-gagalin">POLAR NIGHT</span> has begun.</p>
                <p>You crawl out of your tent and find Lumino curled up beside the dying fire pit. It hasn't eaten for days — the prey is hard to find in this darkness. Despite being so weak, it still manages to stand and follow you forward.</p>
                <p>That's when it happens.</p>
                <p>Without warning, a massive claw bursts up from beneath the snow. It latches onto Lumino's tail and hurls it into the sky, like a wisp of snow in the wind.</p>
                <p>Lumino cries out — a high, sharp shriek that pierces the air. Then, with a terrible roar, the snow explodes, and a <span class="font-bold text-red-600 font-gagalin">YEZU</span> appears.</p>
              </div>
            </div>
          `
        },
        {
          id: "page-4-3",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Left column - Text -->
                <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                  <p>The beast is even larger than you imagined. It leaps into the air and slams Lumino down into the snow with a thunderous crash.</p>
                  <p>Lumino tries to fight back. You see the brave little creature breathing hard, struggling to summon its ice magic. But nothing happens. No frost, no wind. Lumino is too weak from hunger.</p>
                </div>
                
                <!-- Right column - Yezu Image -->
                <div class="flex justify-center items-center">
                  <img src="/issues/issue1/yezu.png" alt="Yezu the ancient snow beast" class="max-w-full h-auto rounded-lg shadow-lg" />
                </div>
              </div>
            </div>
          `
        },
        {
          id: "page-4-4",
          hasQuest: true,
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>The Yezu roared again and charged at the Lumino, claws raised. Your heart pounds — you have to act fast! What would you do?</p>
              </div>
            </div>
            <div class="p-6 rounded-2xl bg-blue-100 text-center">
              <h3 class="text-2xl font-bold text-cyan-600 mb-4 text-center font-gagalin">Your Choice: Save Lumino</h3>
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <div class="space-y-3">
                  <p>1. Shout loudly at the Yezu to distract it from Lumino.</p>
                  <p>2. Throw snowballs at the Yezu to get its attention.</p>
                  <p>3. Rush to Lumino and try to scoop it up in your arms to carry it to safety.</p>
                </div>
              </div>
            </div>
            <div class="p-6 rounded-2xl text-center">
              <button class="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 font-black text-lg rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0 px-8 py-3" data-quest-id="6">
                Make Your Choice
              </button>
            </div>
          `
        },
        {
          id: "page-4-5",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>It took you hours to dig your way out. When you finally stepped outside, there was no sign of the Yezu. No sign of Lumino.</p>
                <p>Did you save it?</p>
                <p>That night, you lay in your sleeping bag, wide awake. You kept listening, hoping for a sound — a soft paw, a breath in the dark. But the silence never broke.</p>
                <p>And when you woke the next morning, you saw something that made your heart squeeze: Tiny pawprints circled your tent in the snow. And right at the entrance was a freshly caught fish.</p>
                <p>Lumino was safe! It had survived!</p>
                <p>And it brought you a thank-you gift. Tears filled your eyes.</p>
                <p>Not because you were scared.</p>
                <p class="text-xl font-bold text-blue-600 font-gagalin">But because on the coldest night, something warm had found you.</p>
              </div>
            </div>
          `
        },
      ]
    },
    {
      id: "chapter-5",
      title: "The Becoming",
      pages: [
        {
          id: "page-5-1",
          htmlContent: `
            <div class="p-6 rounded-2xl text-center relative min-h-[70vh] flex flex-col justify-center items-center" 
                 style="background-image: url('/kowai/forcino2.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">Chapter 5</h2>
                <h2 class="text-3xl font-bold  mb-4 text-center drop-shadow-xl font-gagalin">The Becoming</h2>
            </div>
          `
        },
        {
          id: "page-5-2",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>Today marks exactly one month since you started your journey. After all the challenges and dangers, you have finally reached the <span class="font-bold text-blue-600 font-gagalin">SOUTH POLE</span>.</p>
                <p>Lumino stands at the center of an ancient circle of ice. For so long, this brave little creature has been fighting just to survive. And now, this is the moment it has been waiting for its entire life. With a sharp howl, the evolution begins.</p>
                <p>The snow begins to swirl around it in magical circles, and a gentle breeze lifts it into the air. Its fur begins to sparkle and glow with bright golden light, shining like the morning sun breaking through the clouds.</p>
                <p>When it floats back down to the snowy ground, it has become a new being — a <span class="font-bold text-yellow-600 font-gagalin">FORCINO</span>. Full of strength. Full of magic.</p>
                <p>You slowly reach out your hand, unsure if it will come closer. Maybe it doesn't recognize you anymore. Maybe it doesn't need you. But without hesitation, it steps forward and gently presses its warm forehead into your palm — steady, trusting, and certain of your friendship.</p>
              </div>
            </div>
          `
        },
        {
          id: "page-5-3",
          htmlContent: `
            <div class="p-6 rounded-2xl text-left">
              <div class="text-slate-800 text-lg leading-relaxed space-y-4">
                <p>Suddenly, the world starts to spin around you again. You feel that familiar dizziness as you're magically transported back to your room. Everything looks exactly the same — same bed, same walls, like nothing had happened, like everything was just a dream.</p>
                <p>But you know it was all real. You quickly grab the magical letter again, and this time, new words appear:</p>
              </div>
            </div>
            <div class="p-6 rounded-2xl text-center">
              <img src="/issues/issue1/letter.png" alt="Magical letter with new words" class="max-w-full h-128 rounded-lg shadow-lg mx-auto" />
            </div>
          `
        },
      ]
    },
  ]
};


