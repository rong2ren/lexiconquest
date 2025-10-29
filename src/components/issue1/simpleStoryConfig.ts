import type { SimpleStoryIssue } from '../../types/storyContentTypes';

export const simpleStoryIssue1: SimpleStoryIssue = {
  id: "issue1",
  chapters: [
    {
      id: "chapter-1",
      title: "A Strange Invitation",
      pages: [
        {
          id: "page-1-1",
          content: [
            {
              type: "chapter-header",
              data: {
                backgroundImage: "/issues/issue1/background.png",
                title: "Chapter 1",
                subtitle: "A Strange Invitation",
                textColor: "text-white"
              }
            }
          ]
        },
        {
          id: "page-1-2",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/secret letter.png",
                  alt: "Secret Letter",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "I'M GLAD YOU ARE HERE...",
                  level: 2,
                  content: `<p>Now listen carefully. You have been chosen.</p>
<p>Not everyone gets this magical invitation. We've seen your curiosity and your kindness. So we've decided on you.</p>
<p>We invite you to become a <span class="text-yellow-600 font-bold">Kowai Trainer</span>.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-3",
          content: [
            {
              type: "text",
              data: {
                content: `<p>Oh, I can see you have so many questions bubbling up. Be patient, young one. Let me explain.</p>
<p>You see, in our magical world called <span class="text-yellow-600 font-bold">LEXICON</span>, there are special creatures named <span class="text-yellow-600 font-bold">Kowai</span>. Some fluffy like snowballs, others sparkling with tiny lightning bolts. Each Kowai has amazing powers that will take your breath away.</p>
<p>But here's the most wonderful part: every Kowai chooses one special human to be their friend forever. This person becomes a <span class="text-yellow-600 font-bold">Kowai Trainer</span>.</p>`
              }
            }
          ]
        },
        {
          id: "page-1-4",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "text",
                  content: `<p>I am the Headmistress of <span class="text-yellow-600 font-bold">Starlight College</span>.</p>

<p>We teach young explorers like you how to bond with Kowai, how to help them grow strong, and how to unlock the greatest potential in both your Kowai and yourself.</p>

<p>We have given you your first <span class="text-yellow-600 font-bold">Kowai egg</span>. Inside sleeps one of three Kowai, waiting to meet you.</p>

<p>Come now. Look at them carefully. You are choosing a friend for life. Feel it... which one is the most special to you?</p>`
                },
                right: {
                  type: "image",
                  content: "/kowai/egg.gif",
                  alt: "Kowai Egg"
                }
              }
            }
          ]
        },
        {
          id: "page-1-5",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/fanelle.png",
                  alt: "Fanelle",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  
                    heading: "SPECIAL LOOK",
                    level: 3,
                    content: `<p>Fanelle's antlers grow clusters of glowing crystals that change color depending on its emotions.</p>

<p>Sensitive ears help Fanelle hear sounds from great distances — even snowflakes falling.</p>`
                    }
                
              }
            }
          ]
        },
        {
          id: "page-1-6",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/fanelle.png",
                  alt: "Fanelle",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "PERSONALITY",
                  level: 3,
                  content: `<p>Loves rainy and snowy nights and places where the winds are gentle.</p>

<p>Natural peacemaker — it dislikes conflict and tries to bring harmony to any group.</p>

<p>Shy at first, but once Fanelle bonds with a Trainer, it gives them its full trust and stays deeply loyal.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-7",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/fanelle.png",
                  alt: "Fanelle",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "ABILITY",
                  level: 3,
                  content: `<p><span class="font-bold">Crystal Bloom:</span> Fanelle sends a burst of sparkling energy from its antlers, stunning nearby enemies.</p>

<p><span class="font-bold">Stone Veil:</span> Can form a protective crystal shield around itself or a friend for a short time.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-8",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/scorki.png",
                  alt: "Scorki",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "SPECIAL LOOK",
                  level: 3,
                  content: `<p>Scorki is flexible; it is an excellent climber across rocky cliffs and cavern walls.</p>

<p>It prefers to stay in dry, stony habitats and can go days without food.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-9",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/scorki.png",
                  alt: "Scorki",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "PERSONALITY",
                  level: 3,
                  content: `<p>Scorki is smart and calm. It prefers doing things on its own and rarely makes a sound.</p>

<p>Scorki may not always stay by your side, but if the Trainer is in trouble, it appears immediately.</p>

<p>Calm and cool-headed even in dangerous moments, it carefully watches and waits before acting.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-10",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/scorki.png",
                  alt: "Scorki",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "ABILITY",
                  level: 3,
                  content: `<p><span class="font-bold">Stone Pinch:</span> Uses its strong pincers to pinch enemies sharply. This move is quick and precise.</p>

<p><span class="font-bold">Dig Pop:</span> Scorki quickly digs into the ground and pops up in another spot. It's a sneaky way to escape.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-11",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/peblaff.png",
                  alt: "Peblaff",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "SPECIAL LOOK",
                  level: 3,
                  content: `<p>Peblaff's soft fur hides a strong, rocky body underneath, making it much tougher than it looks.</p>

<p>Its sturdy body helps it stay balanced and steady, even in bumpy or shaky places.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-12",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/peblaff.png",
                  alt: "Peblaff",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "PERSONALITY",
                  level: 3,
                  content: `<p>Peblaff is playful and goofy — it loves to roll around, chase fireflies, and turn anything into a game.</p>

<p>It's friendly and loves cheering others up, especially when things feel sad or a little scary.</p>

<p>Peblaff treats its Trainer like a family and loves cuddling up beside them.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-13",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "image",
                  content: "/issues/issue1/peblaff.png",
                  alt: "Peblaff",
                  className: "h-48 md:h-120"
                },
                right: {
                  type: "text",
                  heading: "ABILITY",
                  level: 3,
                  content: `<p><span class="font-bold">Gem Slam:</span> It stomps with its crystal-covered paws, shaking the ground beneath its feet.</p>

<p><span class="font-bold">Moss Shield:</span> Peblaff curls into a ball, and the moss on its body puffs out to block enemy attacks.</p>`
                }
              }
            }
          ]
        },
        {
          id: "page-1-14",
          hasQuest: true,
          content: [
            {
              type: "info-box",
              data: {
                title: "Which Kowai will you choose?",
                content: "Click below button to tell Starlight College which Kowai feels like the perfect match.",
                className: "text-center"
              }
            },
            {
              type: "quest-button",
              data: {
                buttonText: "Choose Your Kowai",
                questId: 1
              }
            }
          ]
        },
        {
          id: "page-1-15",
          content: [
            {
              type: "text",
              data: {
                heading: "The Journey Begins",
                level: 2,
                content: `<p>Good, you have made your choice. I can already sense a special bond forming between you and your chosen Kowai.</p>

<p>But becoming a Kowai trainer is not easy. You'll journey across sparkling lakes, endless forests, and ancient ruins, each hiding secrets of its own.</p>`
              }
            }
          ]
        },
        {
          id: "page-1-16",
          content: [
            {
              type: "text",
              data: {
                content: `<p>So, before we can awaken your sleeping companion, we need to make sure you are truly ready. We will give you a series of challenges. Only those who complete them all shall join us in the magical Lexicon world, to write your own glorious story alongside your Kowai.</p>

<p>Show us your <span class="text-blue-600 font-bold">BRAVERY</span>, <span class="text-yellow-600 font-bold">WISDOM</span>, <span class="text-green-600 font-bold">CURIOSITY</span>, and <span class="text-pink-600 font-bold">EMPATHY</span>. Prove yourself to us.</p>

<p>Get Ready.</p>`
              }
            }
          ]
        }
      ]
    },
    {
      id: "chapter-2",
      title: "The First Challenge",
      pages: [
        {
          id: "page-2-1",
          content: [
            {
              type: "chapter-header",
              data: {
                backgroundImage: "/issues/issue1/chapter2_background.png",
                title: "Chapter 2",
                subtitle: "The First Challenge",
                textColor: "text-yellow-800"
              }
            }
          ]
        },
        {
          id: "page-2-2",
          content: [
            
            {
              type: "text",
              data: {
                content: `<p>As you close the strange letter, the words begin to fade from the page. Suddenly, your room starts to spin like a whirlwind around you. You feel so dizzy that you have to squeeze your eyes shut tight.</p>

<p>Then everything changes.</p>`
              }
            }
          ]
        },
        {
          id: "page-2-3",
          content: [
            {
                type: "image",
                data: {
                  src: "/issues/issue1/riddle_i1q2.png",
                  alt: "Letter",
                  className: "h-48 md:h-100"
                }
              },
            {
              type: "text",
              data: {
                content: `<p>A cold wind brushes against your cheek. Icy air slips through your shirt and makes you shiver. When you finally dare to open your eyes….</p>

<p>It's white everywhere.</p>`
              }
            }
          ]
        },
        {
          id: "page-2-4",
          content: [
            {
              type: "text",
              data: {
                content: `<p>Endless snow stretches in every direction. No trees, no grass, no signs of life. The sky hangs dark and heavy above you, even though your watch says it's 11 in the morning. The sun sits low on the horizon, as if it's too tired to climb higher.</p>

<p>Where are you?</p>`
              }
            }
          ]
        },
        {
          id: "page-2-5",
          content: [
            {
              type: "text",
              data: {
                content: `<p>At your feet, you discover a backpack. Inside, you find cookies, water, winter jackets, and... a map?</p>

<p>Your frozen fingers fumble to open the map. As you spread it carefully on the ground, magical white words begin to glow across its surface:</p>`
              }
            },
            {
              type: "info-box",
              data: {
                content: `
                  <p>At the bottom of the world so wide, where snowy silence grows.</p>
                  <p>Mountains sleep beneath the ice, where hidden fire glows.</p>
                  <p>The sun may shine for weeks on end, then vanish from the sky.</p>
                  <p>And glowing lights in purple-green will swirl and flicker by.</p>
                `
              }
            }
          ]
        },
        {
          id: "page-2-6",
          hasQuest: true,
          content: [
            {
              type: "text",
              data: {
                heading: "Your Mission: Find the Continent",
                level: 2,
                content: `<p>It's a riddle! This must be your first challenge. The headmistress wants you to figure out exactly where the magic has brought you.</p>
<p>Use the riddle's clues to discover which continent you're standing on right now.</p>`
              }
            },
            {
              type: "image",
              data: {
                src: "/issues/issue1/world_map.png",
                alt: "World Map",
                className: "max-w-md sm:max-w-xs md:max-w-sm mx-auto"
              }
            },
            {
              type: "quest-button",
              data: {
                buttonText: "Find the Continent",
                questId: 2
              }
            }
          ]
        }
      ]
    },
    {
      id: "chapter-3",
      title: "A Lumino",
      pages: [
        {
          id: "page-3-1",
          content: [
            {
              type: "chapter-header",
              data: {
                backgroundImage: "/issues/issue1/chapter3_background.png",
                title: "Chapter 3",
                subtitle: "A Lumino",
                textColor: "text-cyan-600"
              }
            }
          ]
        },
        {
          id: "page-3-2",
          content: [
            {
              type: "text",
              data: {
                content: `<p>You fold the map carefully, feeling confused. What could the rest of the challenges be? Just as you scratch your head in thought, you catch something in the corner of your eye — a flash of blue and purple racing across the snow.</p>
<p>What was that?</p>
<p>Your heart pounds with excitement as you quickly chase after it. This is the first living thing you've found in Antarctica. The creature notices you following and gracefully climbs to the top of a small snow hill, then turns to look at you with large, curious eyes.</p>`
              }
            },
          ]
        },
        {
            id: "page-3-3",
            content: [
                {
                    type: "image",
                    data: {
                        src: "/issues/issue1/lumino.png",
                        alt: "Lumino the Kowai",
                        className: "h-48 md:h-120"
                    }
                },
                {
                    type: "text",
                    data: {
                        content: `<p>It's a <span class="text-yellow-600 font-bold">KOWAI</span>!</p>`
                    }
                }
            ]
        },
        {
          id: "page-3-4",
          content: [
            {
              type: "text",
              data: {
                content: `
                <p>You're certain you've never seen this type of creature before. It looks like a small fox, but its fur ripples with waves of blue and purple light. Its tail flows behind it like soft silk dancing in the wind.</p>
                <p>This beautiful creature must be connected to my next challenge! You think. With eager hands, you unfold the magical map once more, and you're not surprised to see new words already appearing.</p>`
              }
            },
          ]
        },
        {
            id: "page-3-5",
            content: [
                {
                    type: "info-box",
                    data: {
                        title: "❄️ LUMINO ❄️",
                         content: `
                             <p>An ice-bonded Kowai who is shy and cautious. It observes humans carefully and takes a long time to build trust.</p>
                             <p>Young Luminos make a once-in-a-lifetime journey to the <span class="font-bold text-yellow-600">SOUTH POLE</span> to complete an evolution that strengthens their ice powers.</p>
                             <p>They travel in packs for safety. But they have to reach the South Pole before the <span class="font-bold text-yellow-600">POLAR NIGHT</span> begins, where the sun never rises for months. If they don't, they risk being caught in endless darkness — that is when the ancient snow beast known as the <span class="font-bold text-yellow-600">YEZU</span> awakens.</p>
                         `,
                         className: "p-20"
                    }
                }
            ]
        },
        {
          id: "page-3-6",
          content: [
            {
              type: "two-column",
              data: {
                left: {
                  type: "text",
                  content: `<p>As you read about Lumino, you look up at the small creature still perched on the snow hill. You glance around the endless white landscape. Where is its group? Young Luminos are supposed to travel together for safety, but this one is completely alone.</p>`
                },
                right: {
                  type: "image",
                  content: "/kowai/lumino.png",
                  alt: "Lumino the Kowai",
                  className: "h-48 md:h-120"
                }
              }
            }
          ]
        },
        {
          id: "page-3-7",
          hasQuest: true,
          content: [
            {
              type: "text",
              data: {
                content: `<p>The Lumino makes a soft, worried sound. You can see it looking at you nervously, ready to run away at any sudden movement. But you can also see curiosity in its sparkling eyes. You suddenly understand what it is thinking — it's lost. It has been alone all by itself for too long. And now it has finally found you, so it doesn't want you to leave.</p>
<p>Your heart goes out to the little creature. Maybe…maybe we can be friends. You think. Maybe I can help it.</p>`
              }
            },
            {
              type: "quest-button",
              data: {
                buttonText: "Help Lumino",
                questId: 3
              }
            }
          ]
        }
      ]
    }
  ]
};
