'use strict';

// Rollen-Daten aus eingebettetem JSON (oder Fallback)
var ROLES_DATA = {
    "meta": {
        "version": 1,
        "generatedAt": "2026-03-31T21:00:00Z",
        "currentPlayableCounts": {
            "townsfolk": 69,
            "outsider": 23,
            "minion": 27,
            "demon": 19,
            "traveler": 18,
            "fabled": 14
        },
        "totals": {
            "onPlayerScripts": 156,
            "includingFabledStorytellerOnly": 170,
            "rolesInDataset": 170,
            "note": "onPlayerScripts = townsfolk+outsider+minion+demon+traveler; fabled zählen nicht zum Spieler-Script."
        },
        "schemaHint": "Compatible with your current app fields (name, team, type, ability, nightOrder) plus richer metadata.",
        "sources": [
            "https://github.com/chizmeeple/json-on-the-clocktower",
            "https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json",
            "https://wiki.bloodontheclocktower.com/Main_Page",
            "https://script.bloodontheclocktower.com/"
        ],
        "notes": [
            "Based primarily on json-on-the-clocktower for structured fields.",
            "Patched to current playable roster using BOTC Wiki pages for roles added/changed after that dataset.",
            "Phase G: Meta totals clarified; run `npm run roles:audit-night` (optional `--with-upstream --write-report`).",
            "Night order: many day-only or passive roles legitimately have empty firstNight/otherNights; travellers often have no machine-readable index in upstream JSON — verify with official Script Tool night sheet when in doubt.",
            "Fabled roles merged from json-on-the-clocktower (Storyteller-only; not on player script)."
        ]
    },
    "scripts": {
        "trouble_brewing": {
            "townsfolk": [
                "washerwoman",
                "librarian",
                "investigator",
                "chef",
                "empath",
                "fortune_teller",
                "undertaker",
                "monk",
                "ravenkeeper",
                "virgin",
                "slayer",
                "soldier",
                "mayor"
            ],
            "outsiders": [
                "butler",
                "drunk",
                "recluse",
                "saint"
            ],
            "minions": [
                "poisoner",
                "spy",
                "scarlet_woman",
                "baron"
            ],
            "demons": [
                "imp"
            ]
        },
        "bad_moon_rising": {
            "townsfolk": [
                "grandmother",
                "sailor",
                "chambermaid",
                "exorcist",
                "innkeeper",
                "gambler",
                "gossip",
                "courtier",
                "professor",
                "minstrel",
                "tea_lady",
                "pacifist",
                "fool"
            ],
            "outsiders": [
                "goon",
                "lunatic",
                "tinker",
                "moonchild"
            ],
            "minions": [
                "godfather",
                "devils_advocate",
                "assassin",
                "mastermind"
            ],
            "demons": [
                "zombuul",
                "pukka",
                "shabaloth",
                "po"
            ]
        },
        "sects_and_violets": {
            "townsfolk": [
                "clockmaker",
                "dreamer",
                "snake_charmer",
                "mathematician",
                "flowergirl",
                "town_crier",
                "oracle",
                "savant",
                "seamstress",
                "philosopher",
                "artist",
                "juggler",
                "sage"
            ],
            "outsiders": [
                "mutant",
                "sweetheart",
                "barber",
                "klutz"
            ],
            "minions": [
                "evil_twin",
                "witch",
                "cerenovus",
                "pit_hag"
            ],
            "demons": [
                "fang_gu",
                "vigormortis",
                "no_dashii",
                "vortox"
            ]
        },
        "custom": {
            "townsfolk": [
                "acrobat",
                "alchemist",
                "alsaahir",
                "amnesiac",
                "artist",
                "atheist",
                "balloonist",
                "banshee",
                "bounty_hunter",
                "cannibal",
                "chambermaid",
                "chef",
                "choirboy",
                "clockmaker",
                "courtier",
                "cult_leader",
                "dreamer",
                "empath",
                "engineer",
                "exorcist",
                "farmer",
                "fisherman",
                "flowergirl",
                "fool",
                "fortune_teller",
                "gambler",
                "general",
                "gossip",
                "grandmother",
                "high_priestess",
                "huntsman",
                "innkeeper",
                "investigator",
                "juggler",
                "king",
                "knight",
                "librarian",
                "lycanthrope",
                "magician",
                "mathematician",
                "mayor",
                "minstrel",
                "monk",
                "nightwatchman",
                "noble",
                "oracle",
                "pacifist",
                "philosopher",
                "pixie",
                "poppy_grower",
                "preacher",
                "princess",
                "professor",
                "ravenkeeper",
                "sage",
                "sailor",
                "savant",
                "seamstress",
                "shugenja",
                "slayer",
                "snake_charmer",
                "soldier",
                "steward",
                "tea_lady",
                "town_crier",
                "undertaker",
                "village_idiot",
                "virgin",
                "washerwoman"
            ],
            "outsiders": [
                "barber",
                "butler",
                "damsel",
                "drunk",
                "golem",
                "goon",
                "hatter",
                "heretic",
                "hermit",
                "klutz",
                "lunatic",
                "moonchild",
                "mutant",
                "ogre",
                "plague_doctor",
                "politician",
                "puzzlemaster",
                "recluse",
                "saint",
                "snitch",
                "sweetheart",
                "tinker",
                "zealot"
            ],
            "minions": [
                "assassin",
                "baron",
                "boffin",
                "boomdandy",
                "cerenovus",
                "devils_advocate",
                "evil_twin",
                "fearmonger",
                "goblin",
                "godfather",
                "harpy",
                "marionette",
                "mastermind",
                "mezepheles",
                "organ_grinder",
                "pit_hag",
                "poisoner",
                "psychopath",
                "scarlet_woman",
                "spy",
                "summoner",
                "vizier",
                "widow",
                "witch",
                "wizard",
                "wraith",
                "xaan"
            ],
            "demons": [
                "al_hadikhia",
                "fang_gu",
                "imp",
                "kazali",
                "legion",
                "leviathan",
                "lil_monsta",
                "lleech",
                "lord_of_typhon",
                "no_dashii",
                "ojo",
                "po",
                "pukka",
                "riot",
                "shabaloth",
                "vigormortis",
                "vortox",
                "yaggababble",
                "zombuul"
            ],
            "travelers": [
                "apprentice",
                "barista",
                "beggar",
                "bishop",
                "bone_collector",
                "bureaucrat",
                "butcher",
                "cacklejack",
                "deviant",
                "gangster",
                "gnome",
                "gunslinger",
                "harlot",
                "judge",
                "matron",
                "scapegoat",
                "thief",
                "voudon"
            ]
        },
        "fabled": [
            "angel",
            "bootlegger",
            "buddhist",
            "djinn",
            "doomsayer",
            "duchess",
            "fibbin",
            "fiddler",
            "hellslibrarian",
            "revolutionary",
            "sentinel",
            "spiritofivory",
            "stormcatcher",
            "toymaker"
        ]
    },
    "roles": {
        "acrobat": {
            "id": "acrobat",
            "sourceId": "acrobat",
            "name": "Acrobat",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each night*, if either good living neighbour is drunk or poisoned, you die.",
            "summary": "",
            "reminder": "If a good living neighbour is drunk or poisoned, the Acrobat player dies.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 44,
                        "phase": "other",
                        "label": "Acrobat: If a good living neighbour is drunk or poisoned, the Acrobat player dies",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 44,
            "firstNightReminder": "",
            "otherNightReminder": "If a good living neighbour is drunk or poisoned, the Acrobat player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/acrobat.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#acrobat"
        },
        "alchemist": {
            "id": "alchemist",
            "sourceId": "alchemist",
            "name": "Alchemist",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "You have a not-in-play Minion ability.",
            "summary": "",
            "reminder": "Show the Alchemist a not-in-play Minion token",
            "reminders": [],
            "remindersGlobal": [
                "Is the Alchemist"
            ],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 4,
                        "phase": "first",
                        "label": "Alchemist: Show the Alchemist a not-in-play Minion token",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 4,
            "otherNightIndex": null,
            "firstNightReminder": "Show the Alchemist a not-in-play Minion token",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/alchemist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#alchemist"
        },
        "alsaahir": {
            "name": "Alsaahir",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each day, if you publicly guess which players are Minion(s) and which are Demon(s), good wins.",
            "summary": "The Alsaahir guesses the entire evil team.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Alsaahir",
            "id": "alsaahir"
        },
        "amnesiac": {
            "id": "amnesiac",
            "sourceId": "amnesiac",
            "name": "Amnesiac",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are.",
            "summary": "",
            "reminder": "Decide the Amnesiac's entire ability. If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
            "reminders": [
                "?"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 36,
                        "phase": "first",
                        "label": "Amnesiac: Decide the Amnesiac's entire ability",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 54,
                        "phase": "other",
                        "label": "Amnesiac: If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 36,
            "otherNightIndex": 54,
            "firstNightReminder": "Decide the Amnesiac's entire ability. If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
            "otherNightReminder": "If the Amnesiac's ability causes them to wake tonight: Wake the Amnesiac and run their ability.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/amnesiac.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#amnesiac"
        },
        "artist": {
            "id": "artist",
            "sourceId": "artist",
            "name": "Artist",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Once per game, during the day, privately ask the Storyteller any yes/no question.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/artist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#artist"
        },
        "atheist": {
            "id": "atheist",
            "sourceId": "atheist",
            "name": "Atheist",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "The Storyteller can break the game rules & if executed, good wins, even if you are dead. [No evil characters]",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/atheist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#atheist"
        },
        "balloonist": {
            "id": "balloonist",
            "sourceId": "balloonist",
            "name": "Balloonist",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each night, you learn 1 player of each character type, until there are no more types to learn. [+1 Outsider]",
            "summary": "",
            "reminder": "Choose a character type. Point to a player whose character is of that type. Place the Balloonist's Seen reminder next to that character.",
            "reminders": [
                "Seen Townsfolk",
                "Seen Outsider",
                "Seen Minion",
                "Seen Demon",
                "Seen Traveller"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 51,
                        "phase": "first",
                        "label": "Balloonist: Choose a character type",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 69,
                        "phase": "other",
                        "label": "Balloonist: Choose a character type that does not yet have a Seen reminder next to a character of that type",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 51,
            "otherNightIndex": 69,
            "firstNightReminder": "Choose a character type. Point to a player whose character is of that type. Place the Balloonist's Seen reminder next to that character.",
            "otherNightReminder": "Choose a character type that does not yet have a Seen reminder next to a character of that type. Point to a player whose character is of that type, if there are any. Place the Balloonist's Seen reminder next to that character.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/balloonist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#balloonist"
        },
        "banshee": {
            "id": "banshee",
            "sourceId": "banshee",
            "name": "Banshee",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination.",
            "summary": "",
            "reminder": "Announce that the Banshee has died.",
            "reminders": [
                "Has Ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 49,
                        "phase": "other",
                        "label": "Banshee: Announce that the Banshee has died",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 49,
            "firstNightReminder": "",
            "otherNightReminder": "Announce that the Banshee has died.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/banshee.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#banshee"
        },
        "bounty_hunter": {
            "id": "bounty_hunter",
            "sourceId": "bountyhunter",
            "name": "Bounty Hunter",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]",
            "summary": "",
            "reminder": "Point to 1 evil player. Wake the townsfolk who is evil and show them the 'You are' card and the thumbs down evil sign.",
            "reminders": [
                "Known"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 54,
                        "phase": "first",
                        "label": "Bounty Hunter: Point to 1 evil player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 72,
                        "phase": "other",
                        "label": "Bounty Hunter: If the known evil player has died, point to another evil player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 54,
            "otherNightIndex": 72,
            "firstNightReminder": "Point to 1 evil player. Wake the townsfolk who is evil and show them the 'You are' card and the thumbs down evil sign.",
            "otherNightReminder": "If the known evil player has died, point to another evil player. ",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/bountyhunter.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#bountyhunter"
        },
        "cannibal": {
            "id": "cannibal",
            "sourceId": "cannibal",
            "name": "Cannibal",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Poisoned",
                "Died today"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/cannibal.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#cannibal"
        },
        "chambermaid": {
            "id": "chambermaid",
            "sourceId": "chambermaid",
            "name": "Chambermaid",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.",
            "summary": "",
            "reminder": "The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 61,
                        "phase": "first",
                        "label": "Chambermaid: The Chambermaid points to two players",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 79,
                        "phase": "other",
                        "label": "Chambermaid: The Chambermaid points to two players",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 61,
            "otherNightIndex": 79,
            "firstNightReminder": "The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.",
            "otherNightReminder": "The Chambermaid points to two players. Show the number signal (0, 1, 2, …) for how many of those players wake tonight for their ability.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/chambermaid.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#chambermaid"
        },
        "chef": {
            "id": "chef",
            "sourceId": "chef",
            "name": "Chef",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "You start knowing how many pairs of evil players there are.",
            "summary": "",
            "reminder": "Show the finger signal (0, 1, 2, …) for the number of pairs of neighbouring evil players.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 40,
                        "phase": "first",
                        "label": "Chef: Show the finger signal (0, 1, 2, …) for the number of pairs of neighbouring evil players",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 40,
            "otherNightIndex": null,
            "firstNightReminder": "Show the finger signal (0, 1, 2, …) for the number of pairs of neighbouring evil players.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/chef.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#chef"
        },
        "choirboy": {
            "id": "choirboy",
            "sourceId": "choirboy",
            "name": "Choirboy",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "If the Demon kills the King, you learn which player is the Demon. [+ the King]",
            "summary": "",
            "reminder": "If the King was killed by the Demon, wake the Choirboy and point to the Demon player.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 51,
                        "phase": "other",
                        "label": "Choirboy: If the King was killed by the Demon, wake the Choirboy and point to the Demon player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 51,
            "firstNightReminder": "",
            "otherNightReminder": "If the King was killed by the Demon, wake the Choirboy and point to the Demon player.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/choirboy.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#choirboy"
        },
        "clockmaker": {
            "id": "clockmaker",
            "sourceId": "clockmaker",
            "name": "Clockmaker",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "You start knowing how many steps from the Demon to its nearest Minion.",
            "summary": "",
            "reminder": "Show the hand signal for the number (1, 2, 3, etc.) of places from Demon to closest Minion.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 45,
                        "phase": "first",
                        "label": "Clockmaker: Show the hand signal for the number (1, 2, 3, etc",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 45,
            "otherNightIndex": null,
            "firstNightReminder": "Show the hand signal for the number (1, 2, 3, etc.) of places from Demon to closest Minion.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/clockmaker.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#clockmaker"
        },
        "courtier": {
            "id": "courtier",
            "sourceId": "courtier",
            "name": "Courtier",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.",
            "summary": "",
            "reminder": "The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
            "reminders": [
                "Drunk 3",
                "Drunk 2",
                "Drunk 1",
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 22,
                        "phase": "first",
                        "label": "Courtier: The Courtier either shows a 'no' head signal, or points to a character on the sheet",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 8,
                        "phase": "other",
                        "label": "Courtier: Reduce the remaining number of days the marked player is poisoned",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 22,
            "otherNightIndex": 8,
            "firstNightReminder": "The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
            "otherNightReminder": "Reduce the remaining number of days the marked player is poisoned. If the Courtier has not yet used their ability: The Courtier either shows a 'no' head signal, or points to a character on the sheet. If the Courtier used their ability: If that character is in play, that player is drunk.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/courtier.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#courtier"
        },
        "cult_leader": {
            "id": "cult_leader",
            "sourceId": "cultleader",
            "name": "Cult Leader",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each night, you become the alignment of an alive neighbour. If all good players choose to join your cult, your team wins.",
            "summary": "",
            "reminder": "If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 56,
                        "phase": "first",
                        "label": "Cult Leader: If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 74,
                        "phase": "other",
                        "label": "Cult Leader: If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 56,
            "otherNightIndex": 74,
            "firstNightReminder": "If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.",
            "otherNightReminder": "If the cult leader changed alignment, show them the thumbs up good signal of the thumbs down evil signal accordingly.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/cultleader.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#cultleader"
        },
        "dreamer": {
            "id": "dreamer",
            "sourceId": "dreamer",
            "name": "Dreamer",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each night, choose a player (not yourself or Travellers): you learn 1 good and 1 evil character, 1 of which is correct.",
            "summary": "",
            "reminder": "The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 46,
                        "phase": "first",
                        "label": "Dreamer: The Dreamer points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 63,
                        "phase": "other",
                        "label": "Dreamer: The Dreamer points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 46,
            "otherNightIndex": 63,
            "firstNightReminder": "The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.",
            "otherNightReminder": "The Dreamer points to a player. Show 1 good and 1 evil character token; one of these is correct.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/dreamer.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#dreamer"
        },
        "empath": {
            "id": "empath",
            "sourceId": "empath",
            "name": "Empath",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "Each night, you learn how many of your 2 alive neighbours are evil.",
            "summary": "",
            "reminder": "Show the finger signal (0, 1, 2) for the number of evil alive neighbours of the Empath.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 41,
                        "phase": "first",
                        "label": "Empath: Show the finger signal (0, 1, 2) for the number of evil alive neighbours of the Empath",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 60,
                        "phase": "other",
                        "label": "Empath: Show the finger signal (0, 1, 2) for the number of evil neighbours",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 41,
            "otherNightIndex": 60,
            "firstNightReminder": "Show the finger signal (0, 1, 2) for the number of evil alive neighbours of the Empath.",
            "otherNightReminder": "Show the finger signal (0, 1, 2) for the number of evil neighbours.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/empath.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#empath"
        },
        "engineer": {
            "id": "engineer",
            "sourceId": "engineer",
            "name": "Engineer",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "Once per game, at night, choose which Minions or which Demon is in play.",
            "summary": "",
            "reminder": "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the You are card and the relevant character tokens.",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 16,
                        "phase": "first",
                        "label": "Engineer: The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 5,
                        "phase": "other",
                        "label": "Engineer: The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 16,
            "otherNightIndex": 5,
            "firstNightReminder": "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the You are card and the relevant character tokens.",
            "otherNightReminder": "The Engineer shows a 'no' head signal, or points to a Demon or points to the relevant number of Minions. If the Engineer chose characters, replace the Demon or Minions with the choices, then wake the relevant players and show them the 'You are' card and the relevant character tokens.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/engineer.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#engineer"
        },
        "exorcist": {
            "id": "exorcist",
            "sourceId": "exorcist",
            "name": "Exorcist",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight.",
            "summary": "",
            "reminder": "The Exorcist points to a player, different from the previous night. If that player is the Demon: Wake the Demon. Show the Exorcist token. Point to the Exorcist. The Demon does not act tonight.",
            "reminders": [
                "Chosen"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 23,
                        "phase": "other",
                        "label": "Exorcist: The Exorcist points to a player, different from the previous night",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 23,
            "firstNightReminder": "",
            "otherNightReminder": "The Exorcist points to a player, different from the previous night. If that player is the Demon: Wake the Demon. Show the Exorcist token. Point to the Exorcist. The Demon does not act tonight.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/exorcist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#exorcist"
        },
        "farmer": {
            "id": "farmer",
            "sourceId": "farmer",
            "name": "Farmer",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "If you die at night, an alive good player becomes a Farmer.",
            "summary": "",
            "reminder": "If a Farmer died tonight, choose another good player and make them the Farmer. Wake this player, show them the 'You are' card and the Farmer character token.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 55,
                        "phase": "other",
                        "label": "Farmer: If a Farmer died tonight, choose another good player and make them the Farmer",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 55,
            "firstNightReminder": "",
            "otherNightReminder": "If a Farmer died tonight, choose another good player and make them the Farmer. Wake this player, show them the 'You are' card and the Farmer character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/farmer.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#farmer"
        },
        "fisherman": {
            "id": "fisherman",
            "sourceId": "fisherman",
            "name": "Fisherman",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Once per game, during the day, visit the Storyteller for some advice to help you win.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fisherman.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#fisherman"
        },
        "flowergirl": {
            "id": "flowergirl",
            "sourceId": "flowergirl",
            "name": "Flowergirl",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each night*, you learn if a Demon voted today.",
            "summary": "",
            "reminder": "Nod 'yes' or shake head 'no' for whether the Demon voted today. Place the 'Demon not voted' marker (remove 'Demon voted', if any).",
            "reminders": [
                "Demon voted",
                "Demon not voted"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 64,
                        "phase": "other",
                        "label": "Flowergirl: Nod 'yes' or shake head 'no' for whether the Demon voted today",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 64,
            "firstNightReminder": "",
            "otherNightReminder": "Nod 'yes' or shake head 'no' for whether the Demon voted today. Place the 'Demon not voted' marker (remove 'Demon voted', if any).",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/flowergirl.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#flowergirl"
        },
        "fool": {
            "id": "fool",
            "sourceId": "fool",
            "name": "Fool",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "The first time you die, you don't.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fool.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#fool"
        },
        "fortune_teller": {
            "id": "fortune_teller",
            "sourceId": "fortuneteller",
            "name": "Fortune Teller",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.",
            "summary": "",
            "reminder": "The Fortune Teller points to two players. Give the head signal (nod yes, shake no) for whether one of those players is the Demon. ",
            "reminders": [
                "Red herring"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 42,
                        "phase": "first",
                        "label": "Fortune Teller: The Fortune Teller points to two players",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 61,
                        "phase": "other",
                        "label": "Fortune Teller: The Fortune Teller points to two players",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 42,
            "otherNightIndex": 61,
            "firstNightReminder": "The Fortune Teller points to two players. Give the head signal (nod yes, shake no) for whether one of those players is the Demon. ",
            "otherNightReminder": "The Fortune Teller points to two players. Show the head signal (nod 'yes', shake 'no') for whether one of those players is the Demon.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fortuneteller.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#fortuneteller"
        },
        "gambler": {
            "id": "gambler",
            "sourceId": "gambler",
            "name": "Gambler",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Each night*, choose a player & guess their character: if you guess wrong, you die.",
            "summary": "",
            "reminder": "The Gambler points to a player, and a character on their sheet. If incorrect, the Gambler dies.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 10,
                        "phase": "other",
                        "label": "Gambler: The Gambler points to a player, and a character on their sheet",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 10,
            "firstNightReminder": "",
            "otherNightReminder": "The Gambler points to a player, and a character on their sheet. If incorrect, the Gambler dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/gambler.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#gambler"
        },
        "general": {
            "id": "general",
            "sourceId": "general",
            "name": "General",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "Each night, you learn which alignment the Storyteller believes is winning: good, evil, or neither.",
            "summary": "",
            "reminder": "Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 60,
                        "phase": "first",
                        "label": "General: Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 78,
                        "phase": "other",
                        "label": "General: Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 60,
            "otherNightIndex": 78,
            "firstNightReminder": "Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.",
            "otherNightReminder": "Show the General thumbs up for good winning, thumbs down for evil winning or thumb to the side for neither.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/general.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#general"
        },
        "gossip": {
            "id": "gossip",
            "sourceId": "gossip",
            "name": "Gossip",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Each day, you may make a public statement. Tonight, if it was true, a player dies.",
            "summary": "",
            "reminder": "If the Gossip’s public statement was true: Choose a player not protected from dying tonight. That player dies.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 43,
                        "phase": "other",
                        "label": "Gossip: If the Gossip’s public statement was true: Choose a player not protected from dying tonight",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 43,
            "firstNightReminder": "",
            "otherNightReminder": "If the Gossip’s public statement was true: Choose a player not protected from dying tonight. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/gossip.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#gossip"
        },
        "grandmother": {
            "id": "grandmother",
            "sourceId": "grandmother",
            "name": "Grandmother",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "You start knowing a good player & their character. If the Demon kills them, you die too.",
            "summary": "",
            "reminder": "Show the marked character token. Point to the marked player.",
            "reminders": [
                "Grandchild"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 44,
                        "phase": "first",
                        "label": "Grandmother: Show the marked character token",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 58,
                        "phase": "other",
                        "label": "Grandmother: If the Grandmother’s grandchild was killed by the Demon tonight: The Grandmother dies",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 44,
            "otherNightIndex": 58,
            "firstNightReminder": "Show the marked character token. Point to the marked player.",
            "otherNightReminder": "If the Grandmother’s grandchild was killed by the Demon tonight: The Grandmother dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/grandmother.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#grandmother"
        },
        "high_priestess": {
            "id": "high_priestess",
            "sourceId": "highpriestess",
            "name": "High Priestess",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each night, learn which player the Storyteller believes you should talk to most.",
            "summary": "",
            "reminder": "Point to a player.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 59,
                        "phase": "first",
                        "label": "High Priestess: Point to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 77,
                        "phase": "other",
                        "label": "High Priestess: Point to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 59,
            "otherNightIndex": 77,
            "firstNightReminder": "Point to a player.",
            "otherNightReminder": "Point to a player.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/highpriestess.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#highpriestess"
        },
        "huntsman": {
            "id": "huntsman",
            "sourceId": "huntsman",
            "name": "Huntsman",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]",
            "summary": "",
            "reminder": "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 34,
                        "phase": "first",
                        "label": "Huntsman: The Huntsman shakes their head 'no' or points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 52,
                        "phase": "other",
                        "label": "Huntsman: The Huntsman shakes their head 'no' or points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 34,
            "otherNightIndex": 52,
            "firstNightReminder": "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
            "otherNightReminder": "The Huntsman shakes their head 'no' or points to a player. If they point to the Damsel, wake that player, show the 'You are' card and a not-in-play character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/huntsman.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#huntsman"
        },
        "innkeeper": {
            "id": "innkeeper",
            "sourceId": "innkeeper",
            "name": "Innkeeper",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk.",
            "summary": "",
            "reminder": "The previously protected and drunk players lose those markers. The Innkeeper points to two players. Those players are protected. One is drunk.",
            "reminders": [
                "Protected",
                "Drunk"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 9,
                        "phase": "other",
                        "label": "Innkeeper: The previously protected and drunk players lose those markers",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 9,
            "firstNightReminder": "",
            "otherNightReminder": "The previously protected and drunk players lose those markers. The Innkeeper points to two players. Those players are protected. One is drunk.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/innkeeper.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#innkeeper"
        },
        "investigator": {
            "id": "investigator",
            "sourceId": "investigator",
            "name": "Investigator",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "You start knowing that 1 of 2 players is a particular Minion.",
            "summary": "",
            "reminder": "Show the character token of a Minion in play. Point to two players, one of which is that character.",
            "reminders": [
                "Minion",
                "Wrong"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 39,
                        "phase": "first",
                        "label": "Investigator: Show the character token of a Minion in play",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 39,
            "otherNightIndex": null,
            "firstNightReminder": "Show the character token of a Minion in play. Point to two players, one of which is that character.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/investigator.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#investigator"
        },
        "juggler": {
            "id": "juggler",
            "sourceId": "juggler",
            "name": "Juggler",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct.",
            "summary": "",
            "reminder": "If today was the Juggler’s first day: Show the hand signal for the number (0, 1, 2, etc.) of 'Correct' markers. Remove markers.",
            "reminders": [
                "Correct"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 68,
                        "phase": "other",
                        "label": "Juggler: If today was the Juggler’s first day: Show the hand signal for the number (0, 1, 2, etc",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 68,
            "firstNightReminder": "",
            "otherNightReminder": "If today was the Juggler’s first day: Show the hand signal for the number (0, 1, 2, etc.) of 'Correct' markers. Remove markers.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/juggler.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#juggler"
        },
        "king": {
            "id": "king",
            "sourceId": "king",
            "name": "King",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "Each night, if the dead outnumber the living, you learn 1 alive character. The Demon knows who you are.",
            "summary": "",
            "reminder": "Wake the Demon, show them the 'This character selected you' card, show the King token and point to the King player.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 13,
                        "phase": "first",
                        "label": "King: Wake the Demon, show them the 'This character selected you' card, show the King token and point to the King player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 71,
                        "phase": "other",
                        "label": "King: If there are more dead than living, show the King a character token of a living player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 13,
            "otherNightIndex": 71,
            "firstNightReminder": "Wake the Demon, show them the 'This character selected you' card, show the King token and point to the King player.",
            "otherNightReminder": "If there are more dead than living, show the King a character token of a living player.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/king.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#king"
        },
        "knight": {
            "id": "knight",
            "sourceId": "knight",
            "name": "Knight",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "You start knowing 2 players that are not the Demon.",
            "summary": "",
            "reminder": "Point to two players who are not the Demon.",
            "reminders": [
                "Knows"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 49,
                        "phase": "first",
                        "label": "Knight: Point to two players who are not the Demon",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 49,
            "otherNightIndex": null,
            "firstNightReminder": "Point to two players who are not the Demon.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/knight.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#knight"
        },
        "librarian": {
            "id": "librarian",
            "sourceId": "librarian",
            "name": "Librarian",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)",
            "summary": "",
            "reminder": "Show the character token of an Outsider in play. Point to two players, one of which is that character.",
            "reminders": [
                "Outsider",
                "Wrong"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 38,
                        "phase": "first",
                        "label": "Librarian: Show the character token of an Outsider in play",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 38,
            "otherNightIndex": null,
            "firstNightReminder": "Show the character token of an Outsider in play. Point to two players, one of which is that character.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/librarian.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#librarian"
        },
        "lycanthrope": {
            "id": "lycanthrope",
            "sourceId": "lycanthrope",
            "name": "Lycanthrope",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "Each night*, choose a living player: if good, they die, but they are the only player that can die tonight.",
            "summary": "",
            "reminder": "The Lycanthrope points to a living player: if good, they die and no one else can die tonight.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 24,
                        "phase": "other",
                        "label": "Lycanthrope: The Lycanthrope points to a living player: if good, they die and no one else can die tonight",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 24,
            "firstNightReminder": "",
            "otherNightReminder": "The Lycanthrope points to a living player: if good, they die and no one else can die tonight.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/lycanthrope.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#lycanthrope"
        },
        "magician": {
            "id": "magician",
            "sourceId": "magician",
            "name": "Magician",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "The Demon thinks you are a Minion. Minions think you are a Demon.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 7,
                        "phase": "first",
                        "label": "Magician: act",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 7,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/magician.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#magician"
        },
        "mathematician": {
            "id": "mathematician",
            "sourceId": "mathematician",
            "name": "Mathematician",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability.",
            "summary": "",
            "reminder": "Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.",
            "reminders": [
                "Abnormal"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 62,
                        "phase": "first",
                        "label": "Mathematician: Show the hand signal for the number (0, 1, 2, etc",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 80,
                        "phase": "other",
                        "label": "Mathematician: Show the hand signal for the number (0, 1, 2, etc",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 62,
            "otherNightIndex": 80,
            "firstNightReminder": "Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.",
            "otherNightReminder": "Show the hand signal for the number (0, 1, 2, etc.) of players whose ability malfunctioned due to other abilities.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/mathematician.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#mathematician"
        },
        "mayor": {
            "id": "mayor",
            "sourceId": "mayor",
            "name": "Mayor",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/mayor.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#mayor"
        },
        "minstrel": {
            "id": "minstrel",
            "sourceId": "minstrel",
            "name": "Minstrel",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Everyone drunk"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/minstrel.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#minstrel"
        },
        "monk": {
            "id": "monk",
            "sourceId": "monk",
            "name": "Monk",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "Each night*, choose a player (not yourself): they are safe from the Demon tonight.",
            "summary": "",
            "reminder": "The previously protected player is no longer protected. The Monk points to a player not themself. Mark that player 'Protected'.",
            "reminders": [
                "Protected"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 12,
                        "phase": "other",
                        "label": "Monk: The previously protected player is no longer protected",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 12,
            "firstNightReminder": "",
            "otherNightReminder": "The previously protected player is no longer protected. The Monk points to a player not themself. Mark that player 'Protected'.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/monk.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#monk"
        },
        "nightwatchman": {
            "id": "nightwatchman",
            "sourceId": "nightwatchman",
            "name": "Nightwatchman",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Once per game, at night, choose a player: they learn who you are.",
            "summary": "",
            "reminder": "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 55,
                        "phase": "first",
                        "label": "Nightwatchman: The Nightwatchman may point to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 73,
                        "phase": "other",
                        "label": "Nightwatchman: The Nightwatchman may point to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 55,
            "otherNightIndex": 73,
            "firstNightReminder": "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
            "otherNightReminder": "The Nightwatchman may point to a player. Wake that player, show the 'This character selected you' card and the Nightwatchman token, then point to the Nightwatchman player.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/nightwatchman.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#nightwatchman"
        },
        "noble": {
            "id": "noble",
            "sourceId": "noble",
            "name": "Noble",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "You start knowing 3 players, 1 and only 1 of which is evil.",
            "summary": "",
            "reminder": "Point to 3 players including one evil player, in no particular order.",
            "reminders": [
                "Seen"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 50,
                        "phase": "first",
                        "label": "Noble: Point to 3 players including one evil player, in no particular order",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 50,
            "otherNightIndex": null,
            "firstNightReminder": "Point to 3 players including one evil player, in no particular order.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/noble.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#noble"
        },
        "oracle": {
            "id": "oracle",
            "sourceId": "oracle",
            "name": "Oracle",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each night*, you learn how many dead players are evil.",
            "summary": "",
            "reminder": "Show the hand signal for the number (0, 1, 2, etc.) of dead evil players.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 66,
                        "phase": "other",
                        "label": "Oracle: Show the hand signal for the number (0, 1, 2, etc",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 66,
            "firstNightReminder": "",
            "otherNightReminder": "Show the hand signal for the number (0, 1, 2, etc.) of dead evil players.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/oracle.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#oracle"
        },
        "pacifist": {
            "id": "pacifist",
            "sourceId": "pacifist",
            "name": "Pacifist",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Executed good players might not die.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/pacifist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#pacifist"
        },
        "philosopher": {
            "id": "philosopher",
            "sourceId": "philosopher",
            "name": "Philosopher",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk.",
            "summary": "",
            "reminder": "The Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token and add the 'Is the Philosopher' reminder. If the character is in play, place the drunk marker by that player.",
            "reminders": [
                "Drunk",
                "Is the Philosopher"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 2,
                        "phase": "first",
                        "label": "Philosopher: The Philosopher either shows a 'no' head signal, or points to a good character on their sheet",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 2,
                        "phase": "other",
                        "label": "Philosopher: If the Philosopher has not used their ability: the Philosopher either shows a 'no' head signal, or points to a good character on their sheet",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 2,
            "otherNightIndex": 2,
            "firstNightReminder": "The Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token and add the 'Is the Philosopher' reminder. If the character is in play, place the drunk marker by that player.",
            "otherNightReminder": "If the Philosopher has not used their ability: the Philosopher either shows a 'no' head signal, or points to a good character on their sheet. If they chose a character: Swap the out-of-play character token with the Philosopher token and add the 'Is the Philosopher' reminder. If the character is in play, place the drunk marker by that player.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/philosopher.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#philosopher"
        },
        "pixie": {
            "id": "pixie",
            "sourceId": "pixie",
            "name": "Pixie",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.",
            "summary": "",
            "reminder": "Show the Pixie 1 in-play Townsfolk character token.",
            "reminders": [
                "Mad",
                "Has ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 33,
                        "phase": "first",
                        "label": "Pixie: Show the Pixie 1 in-play Townsfolk character token",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 33,
            "otherNightIndex": null,
            "firstNightReminder": "Show the Pixie 1 in-play Townsfolk character token.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/pixie.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#pixie"
        },
        "poppy_grower": {
            "id": "poppy_grower",
            "sourceId": "poppygrower",
            "name": "Poppy Grower",
            "team": "good",
            "type": "townsfolk",
            "edition": "ks",
            "ability": "Minions & Demons do not know each other. If you die, they learn who each other are that night.",
            "summary": "",
            "reminder": "Do not inform the Demon/Minions who each other are",
            "reminders": [
                "Evil wakes"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 5,
                        "phase": "first",
                        "label": "Poppy Grower: Do not inform the Demon/Minions who each other are",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 3,
                        "phase": "other",
                        "label": "Poppy Grower: If the Poppy Grower has died, show the Minions/Demon who each other are",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 5,
            "otherNightIndex": 3,
            "firstNightReminder": "Do not inform the Demon/Minions who each other are",
            "otherNightReminder": "If the Poppy Grower has died, show the Minions/Demon who each other are.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/poppygrower.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#poppygrower"
        },
        "preacher": {
            "id": "preacher",
            "sourceId": "preacher",
            "name": "Preacher",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability.",
            "summary": "",
            "reminder": "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
            "reminders": [
                "At a sermon"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 17,
                        "phase": "first",
                        "label": "Preacher: The Preacher chooses a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 6,
                        "phase": "other",
                        "label": "Preacher: The Preacher chooses a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 17,
            "otherNightIndex": 6,
            "firstNightReminder": "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
            "otherNightReminder": "The Preacher chooses a player. If a Minion is chosen, wake the Minion and show the 'This character selected you' card and then the Preacher token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/preacher.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#preacher"
        },
        "princess": {
            "name": "Princess",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "On your 1st day, if you nominated & executed a player, the Demon doesn't kill tonight.",
            "summary": "The Princess decides which player dies first.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [
                "Doesn't kill"
            ],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Princess",
            "id": "princess"
        },
        "professor": {
            "id": "professor",
            "sourceId": "professor",
            "name": "Professor",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.",
            "summary": "",
            "reminder": "If the Professor has not used their ability: The Professor either shakes their head no, or points to a player. If that player is a Townsfolk, they are now alive.",
            "reminders": [
                "Alive",
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 50,
                        "phase": "other",
                        "label": "Professor: If the Professor has not used their ability: The Professor either shakes their head no, or points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 50,
            "firstNightReminder": "",
            "otherNightReminder": "If the Professor has not used their ability: The Professor either shakes their head no, or points to a player. If that player is a Townsfolk, they are now alive.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/professor.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#professor"
        },
        "ravenkeeper": {
            "id": "ravenkeeper",
            "sourceId": "ravenkeeper",
            "name": "Ravenkeeper",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "If you die at night, you are woken to choose a player: you learn their character.",
            "summary": "",
            "reminder": "If the Ravenkeeper died tonight: The Ravenkeeper points to a player. Show that player’s character token.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 59,
                        "phase": "other",
                        "label": "Ravenkeeper: If the Ravenkeeper died tonight: The Ravenkeeper points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 59,
            "firstNightReminder": "",
            "otherNightReminder": "If the Ravenkeeper died tonight: The Ravenkeeper points to a player. Show that player’s character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/ravenkeeper.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#ravenkeeper"
        },
        "sage": {
            "id": "sage",
            "sourceId": "sage",
            "name": "Sage",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "If the Demon kills you, you learn that it is 1 of 2 players.",
            "summary": "",
            "reminder": "If the Sage was killed by a Demon: Point to two players, one of which is that Demon.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 48,
                        "phase": "other",
                        "label": "Sage: If the Sage was killed by a Demon: Point to two players, one of which is that Demon",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 48,
            "firstNightReminder": "",
            "otherNightReminder": "If the Sage was killed by a Demon: Point to two players, one of which is that Demon.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/sage.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#sage"
        },
        "sailor": {
            "id": "sailor",
            "sourceId": "sailor",
            "name": "Sailor",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "Each night, choose an alive player: either you or they are drunk until dusk. You can't die.",
            "summary": "",
            "reminder": "The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.",
            "reminders": [
                "Drunk"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 14,
                        "phase": "first",
                        "label": "Sailor: The Sailor points to a living player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 4,
                        "phase": "other",
                        "label": "Sailor: The previously drunk player is no longer drunk",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 14,
            "otherNightIndex": 4,
            "firstNightReminder": "The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.",
            "otherNightReminder": "The previously drunk player is no longer drunk. The Sailor points to a living player. Either the Sailor, or the chosen player, is drunk.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/sailor.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#sailor"
        },
        "savant": {
            "id": "savant",
            "sourceId": "savant",
            "name": "Savant",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/savant.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#savant"
        },
        "seamstress": {
            "id": "seamstress",
            "sourceId": "seamstress",
            "name": "Seamstress",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment.",
            "summary": "",
            "reminder": "The Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 47,
                        "phase": "first",
                        "label": "Seamstress: The Seamstress either shows a 'no' head signal, or points to two other players",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 67,
                        "phase": "other",
                        "label": "Seamstress: If the Seamstress has not yet used their ability: the Seamstress either shows a 'no' head signal, or points to two other players",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 47,
            "otherNightIndex": 67,
            "firstNightReminder": "The Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
            "otherNightReminder": "If the Seamstress has not yet used their ability: the Seamstress either shows a 'no' head signal, or points to two other players. If the Seamstress chose players , nod 'yes' or shake 'no' for whether they are of same alignment.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/seamstress.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#seamstress"
        },
        "shugenja": {
            "id": "shugenja",
            "sourceId": "shugenja",
            "name": "Shugenja",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary.",
            "summary": "",
            "reminder": "Wake the Shugenja; point horizontally in the direction of the closest evil player. If the two closest evil players are equidistant, point your finger horizontally in either direction.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 52,
                        "phase": "first",
                        "label": "Shugenja: Wake the Shugenja; point horizontally in the direction of the closest evil player",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 52,
            "otherNightIndex": null,
            "firstNightReminder": "Wake the Shugenja; point horizontally in the direction of the closest evil player. If the two closest evil players are equidistant, point your finger horizontally in either direction.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/shugenja.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#shugenja"
        },
        "slayer": {
            "id": "slayer",
            "sourceId": "slayer",
            "name": "Slayer",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/slayer.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#slayer"
        },
        "snake_charmer": {
            "id": "snake_charmer",
            "sourceId": "snakecharmer",
            "name": "Snake Charmer",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.",
            "summary": "",
            "reminder": "The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.",
            "reminders": [
                "Poisoned"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 23,
                        "phase": "first",
                        "label": "Snake Charmer: The Snake Charmer points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 11,
                        "phase": "other",
                        "label": "Snake Charmer: The Snake Charmer points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 23,
            "otherNightIndex": 11,
            "firstNightReminder": "The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.",
            "otherNightReminder": "The Snake Charmer points to a player. If that player is the Demon: swap the Demon and Snake Charmer character and alignments. Wake each player to inform them of their new role and alignment. The new Snake Charmer is poisoned.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/snakecharmer.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#snakecharmer"
        },
        "soldier": {
            "id": "soldier",
            "sourceId": "soldier",
            "name": "Soldier",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "You are safe from the Demon.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/soldier.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#soldier"
        },
        "steward": {
            "id": "steward",
            "sourceId": "steward",
            "name": "Steward",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "You start knowing 1 good player.",
            "summary": "",
            "reminder": "Point to a good player.",
            "reminders": [
                "Knows"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 48,
                        "phase": "first",
                        "label": "Steward: Point to a good player",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 48,
            "otherNightIndex": null,
            "firstNightReminder": "Point to a good player.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/steward.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#steward"
        },
        "tea_lady": {
            "id": "tea_lady",
            "sourceId": "tealady",
            "name": "Tea Lady",
            "team": "good",
            "type": "townsfolk",
            "edition": "bmr",
            "ability": "If both your alive neighbours are good, they can't die.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Can not die"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/tealady.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#tealady"
        },
        "town_crier": {
            "id": "town_crier",
            "sourceId": "towncrier",
            "name": "Town Crier",
            "team": "good",
            "type": "townsfolk",
            "edition": "snv",
            "ability": "Each night*, you learn if a Minion nominated today.",
            "summary": "",
            "reminder": "Nod 'yes' or shake head 'no' for whether a Minion nominated today. Place the 'Minion not nominated' marker (remove 'Minion nominated', if any).",
            "reminders": [
                "Minions not nominated",
                "Minion nominated"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 65,
                        "phase": "other",
                        "label": "Town Crier: Nod 'yes' or shake head 'no' for whether a Minion nominated today",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 65,
            "firstNightReminder": "",
            "otherNightReminder": "Nod 'yes' or shake head 'no' for whether a Minion nominated today. Place the 'Minion not nominated' marker (remove 'Minion nominated', if any).",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/towncrier.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#towncrier"
        },
        "undertaker": {
            "id": "undertaker",
            "sourceId": "undertaker",
            "name": "Undertaker",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "Each night*, you learn which character died by execution today.",
            "summary": "",
            "reminder": "If a player was executed today: Show that player’s character token.",
            "reminders": [
                "Executed"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 62,
                        "phase": "other",
                        "label": "Undertaker: If a player was executed today: Show that player’s character token",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 62,
            "firstNightReminder": "",
            "otherNightReminder": "If a player was executed today: Show that player’s character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/undertaker.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#undertaker"
        },
        "village_idiot": {
            "id": "village_idiot",
            "sourceId": "villageidiot",
            "name": "Village Idiot",
            "team": "good",
            "type": "townsfolk",
            "edition": "experimental",
            "ability": "Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots. 1 of the extras is drunk]",
            "summary": "",
            "reminder": "The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil.",
            "reminders": [
                "Drunk"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 53,
                        "phase": "first",
                        "label": "Village Idiot: The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 70,
                        "phase": "other",
                        "label": "Village Idiot: The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 53,
            "otherNightIndex": 70,
            "firstNightReminder": "The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil.",
            "otherNightReminder": "The Village Idiot points to a player; give a thumbs up if that player is good or a thumbs down if that player is evil.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/villageidiot.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#villageidiot"
        },
        "virgin": {
            "id": "virgin",
            "sourceId": "virgin",
            "name": "Virgin",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/virgin.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#virgin"
        },
        "washerwoman": {
            "id": "washerwoman",
            "sourceId": "washerwoman",
            "name": "Washerwoman",
            "team": "good",
            "type": "townsfolk",
            "edition": "tb",
            "ability": "You start knowing that 1 of 2 players is a particular Townsfolk.",
            "summary": "",
            "reminder": "Show the character token of a Townsfolk in play. Point to two players, one of which is that character.",
            "reminders": [
                "Townsfolk",
                "Wrong"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 37,
                        "phase": "first",
                        "label": "Washerwoman: Show the character token of a Townsfolk in play",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 37,
            "otherNightIndex": null,
            "firstNightReminder": "Show the character token of a Townsfolk in play. Point to two players, one of which is that character.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/washerwoman.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#washerwoman"
        },
        "barber": {
            "id": "barber",
            "sourceId": "barber",
            "name": "Barber",
            "team": "good",
            "type": "outsider",
            "edition": "snv",
            "ability": "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.",
            "summary": "",
            "reminder": "If the Barber died today: Wake the Demon. Show the 'This character selected you' card, then Barber token. The Demon either shows a 'no' head signal, or points to 2 players. If they chose players: Swap the character tokens. Wake each player. Show 'You are', then their new character token.",
            "reminders": [
                "Haircuts tonight"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 46,
                        "phase": "other",
                        "label": "Barber: If the Barber died today: Wake the Demon",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 46,
            "firstNightReminder": "",
            "otherNightReminder": "If the Barber died today: Wake the Demon. Show the 'This character selected you' card, then Barber token. The Demon either shows a 'no' head signal, or points to 2 players. If they chose players: Swap the character tokens. Wake each player. Show 'You are', then their new character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/barber.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#barber"
        },
        "butler": {
            "id": "butler",
            "sourceId": "butler",
            "name": "Butler",
            "team": "good",
            "type": "outsider",
            "edition": "tb",
            "ability": "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
            "summary": "",
            "reminder": "The Butler points to a player. Mark that player as 'Master'.",
            "reminders": [
                "Master"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 43,
                        "phase": "first",
                        "label": "Butler: The Butler points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 75,
                        "phase": "other",
                        "label": "Butler: The Butler points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 43,
            "otherNightIndex": 75,
            "firstNightReminder": "The Butler points to a player. Mark that player as 'Master'.",
            "otherNightReminder": "The Butler points to a player. Mark that player as 'Master'.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/butler.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#butler"
        },
        "damsel": {
            "id": "damsel",
            "sourceId": "damsel",
            "name": "Damsel",
            "team": "good",
            "type": "outsider",
            "edition": "ks",
            "ability": "All Minions know you are in play. If a Minion publicly guesses you (once), your team loses.",
            "summary": "",
            "reminder": "Wake all the Minions, show them the 'This character selected you' card and the Damsel token.",
            "reminders": [
                "Guess used"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 35,
                        "phase": "first",
                        "label": "Damsel: Wake all the Minions, show them the 'This character selected you' card and the Damsel token",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 53,
                        "phase": "other",
                        "label": "Damsel: If selected by the Huntsman, wake the Damsel, show 'You are' card and a not-in-play Townsfolk token",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 35,
            "otherNightIndex": 53,
            "firstNightReminder": "Wake all the Minions, show them the 'This character selected you' card and the Damsel token.",
            "otherNightReminder": "If selected by the Huntsman, wake the Damsel, show 'You are' card and a not-in-play Townsfolk token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/damsel.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#damsel"
        },
        "drunk": {
            "id": "drunk",
            "sourceId": "drunk",
            "name": "Drunk",
            "team": "good",
            "type": "outsider",
            "edition": "tb",
            "ability": "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [
                "Drunk"
            ],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/drunk.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#drunk"
        },
        "golem": {
            "id": "golem",
            "sourceId": "golem",
            "name": "Golem",
            "team": "good",
            "type": "outsider",
            "edition": "ks",
            "ability": "You may only nominate once per game. When you do, if the nominee is not the Demon, they die.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Can not nominate"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/golem.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#golem"
        },
        "goon": {
            "id": "goon",
            "sourceId": "goon",
            "name": "Goon",
            "team": "good",
            "type": "outsider",
            "edition": "bmr",
            "ability": "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Drunk"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 59,
                        "phase": "other",
                        "label": "Goon: Reaktiv — wenn eine Fähigkeit den Goon anvisiert, ST markiert drunk until dusk (siehe Regelbuch).",
                        "key": "goon_reactive"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 59,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/goon.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#goon"
        },
        "hatter": {
            "id": "hatter",
            "sourceId": "hatter",
            "name": "Hatter",
            "team": "good",
            "type": "outsider",
            "edition": "experimental",
            "ability": "If you died today or tonight, the Minion & Demon players may choose new Minion & Demon characters to be.",
            "summary": "",
            "reminder": "If the Hatter died today: Wake the Minions and Demon. Show them the 'This Character Selected You' info token, then the Hatter token. Each player either shakes their head no or points to another character of the same type as their current character.  If a second player would end up with the same character as another player, shake your head no and gesture for them to choose again. Put them to sleep. Change each player to the character they chose.",
            "reminders": [
                "Tea Party Tonight"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 45,
                        "phase": "other",
                        "label": "Hatter: If the Hatter died today: Wake the Minions and Demon",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 45,
            "firstNightReminder": "",
            "otherNightReminder": "If the Hatter died today: Wake the Minions and Demon. Show them the 'This Character Selected You' info token, then the Hatter token. Each player either shakes their head no or points to another character of the same type as their current character.  If a second player would end up with the same character as another player, shake your head no and gesture for them to choose again. Put them to sleep. Change each player to the character they chose.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/hatter.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#hatter"
        },
        "heretic": {
            "id": "heretic",
            "sourceId": "heretic",
            "name": "Heretic",
            "team": "good",
            "type": "outsider",
            "edition": "ks",
            "ability": "Whoever wins, loses & whoever loses, wins, even if you are dead.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/heretic.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#heretic"
        },
        "hermit": {
            "name": "Hermit",
            "team": "good",
            "type": "outsider",
            "edition": "experimental",
            "ability": "You have all Outsider abilities. [-0 or -1 Outsider]",
            "summary": "The Hermit isn't really here.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [],
            "setup": true,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Hermit",
            "id": "hermit"
        },
        "klutz": {
            "id": "klutz",
            "sourceId": "klutz",
            "name": "Klutz",
            "team": "good",
            "type": "outsider",
            "edition": "snv",
            "ability": "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/klutz.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#klutz"
        },
        "lunatic": {
            "id": "lunatic",
            "sourceId": "lunatic",
            "name": "Lunatic",
            "team": "good",
            "type": "outsider",
            "edition": "bmr",
            "ability": "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.",
            "summary": "",
            "reminder": "If 7 or more players: Show the Lunatic a number of arbitrary 'Minions', players equal to the number of Minions in play. Show 3 character tokens of arbitrary good characters. If the token received by the Lunatic is a Demon that would wake tonight: Allow the Lunatic to do the Demon actions. Place their 'attack' markers. Wake the Demon. Show the Demon’s real character token. Show them the Lunatic player. If the Lunatic attacked players: Show the real demon each marked player. Remove any Lunatic 'attack' markers.",
            "reminders": [
                "Attack 1",
                "Attack 2",
                "Attack 3"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 10,
                        "phase": "first",
                        "label": "Lunatic: If 7 or more players: Show the Lunatic a number of arbitrary 'Minions', players equal to the number of Minions in play",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 22,
                        "phase": "other",
                        "label": "Lunatic: Allow the Lunatic to do the actions of the Demon",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 10,
            "otherNightIndex": 22,
            "firstNightReminder": "If 7 or more players: Show the Lunatic a number of arbitrary 'Minions', players equal to the number of Minions in play. Show 3 character tokens of arbitrary good characters. If the token received by the Lunatic is a Demon that would wake tonight: Allow the Lunatic to do the Demon actions. Place their 'attack' markers. Wake the Demon. Show the Demon’s real character token. Show them the Lunatic player. If the Lunatic attacked players: Show the real demon each marked player. Remove any Lunatic 'attack' markers.",
            "otherNightReminder": "Allow the Lunatic to do the actions of the Demon. Place their 'attack' markers. If the Lunatic selected players: Wake the Demon. Show the 'attack' marker, then point to each marked player. Remove any Lunatic 'attack' markers.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/lunatic.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#lunatic"
        },
        "moonchild": {
            "id": "moonchild",
            "sourceId": "moonchild",
            "name": "Moonchild",
            "team": "good",
            "type": "outsider",
            "edition": "bmr",
            "ability": "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.",
            "summary": "",
            "reminder": "If the Moonchild used their ability to target a player today: If that player is good, they die.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 57,
                        "phase": "other",
                        "label": "Moonchild: If the Moonchild used their ability to target a player today: If that player is good, they die",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 57,
            "firstNightReminder": "",
            "otherNightReminder": "If the Moonchild used their ability to target a player today: If that player is good, they die.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/moonchild.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#moonchild"
        },
        "mutant": {
            "id": "mutant",
            "sourceId": "mutant",
            "name": "Mutant",
            "team": "good",
            "type": "outsider",
            "edition": "snv",
            "ability": "If you are “mad” about being an Outsider, you might be executed.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/mutant.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#mutant"
        },
        "ogre": {
            "id": "ogre",
            "sourceId": "ogre",
            "name": "Ogre",
            "team": "good",
            "type": "outsider",
            "edition": "experimental",
            "ability": "On your 1st night, choose a player (not yourself): you become their alignment (you don't know which) even if drunk or poisoned.",
            "summary": "",
            "reminder": "The Ogre points to a player (not themselves) and becomes their alignment.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 58,
                        "phase": "first",
                        "label": "Ogre: The Ogre points to a player (not themselves) and becomes their alignment",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 58,
            "otherNightIndex": null,
            "firstNightReminder": "The Ogre points to a player (not themselves) and becomes their alignment.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/ogre.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#ogre"
        },
        "plague_doctor": {
            "id": "plague_doctor",
            "sourceId": "plaguedoctor",
            "name": "Plague Doctor",
            "team": "good",
            "type": "outsider",
            "edition": "experimental",
            "ability": "If you die, the Storyteller gains a not-in-play Minion ability.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Storyteller Ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/plaguedoctor.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#plaguedoctor"
        },
        "politician": {
            "id": "politician",
            "sourceId": "politician",
            "name": "Politician",
            "team": "good",
            "type": "outsider",
            "edition": "experimental",
            "ability": "If you were the player most responsible for your team losing, you change alignment & win, even if dead.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/politician.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#politician"
        },
        "puzzlemaster": {
            "id": "puzzlemaster",
            "sourceId": "puzzlemaster",
            "name": "Puzzlemaster",
            "team": "good",
            "type": "outsider",
            "edition": "ks",
            "ability": "1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Drunk",
                "Guess used"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/puzzlemaster.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#puzzlemaster"
        },
        "recluse": {
            "id": "recluse",
            "sourceId": "recluse",
            "name": "Recluse",
            "team": "good",
            "type": "outsider",
            "edition": "tb",
            "ability": "You might register as evil & as a Minion or Demon, even if dead.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/recluse.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#recluse"
        },
        "saint": {
            "id": "saint",
            "sourceId": "saint",
            "name": "Saint",
            "team": "good",
            "type": "outsider",
            "edition": "tb",
            "ability": "If you die by execution, your team loses.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/saint.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#saint"
        },
        "snitch": {
            "id": "snitch",
            "sourceId": "snitch",
            "name": "Snitch",
            "team": "good",
            "type": "outsider",
            "edition": "ks",
            "ability": "Minions start knowing 3 not-in-play characters.",
            "summary": "",
            "reminder": "After Minion info wake each Minion and show them three not-in-play character tokens. These may be the same or different to each other and the ones shown to the Demon.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 9,
                        "phase": "first",
                        "label": "Snitch: After Minion info wake each Minion and show them three not-in-play character tokens",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 9,
            "otherNightIndex": null,
            "firstNightReminder": "After Minion info wake each Minion and show them three not-in-play character tokens. These may be the same or different to each other and the ones shown to the Demon.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/snitch.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#snitch"
        },
        "sweetheart": {
            "id": "sweetheart",
            "sourceId": "sweetheart",
            "name": "Sweetheart",
            "team": "good",
            "type": "outsider",
            "edition": "snv",
            "ability": "When you die, 1 player is drunk from now on.",
            "summary": "",
            "reminder": "Choose a player that is drunk.",
            "reminders": [
                "Drunk"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 47,
                        "phase": "other",
                        "label": "Sweetheart: Choose a player that is drunk",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 47,
            "firstNightReminder": "",
            "otherNightReminder": "Choose a player that is drunk.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/sweetheart.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#sweetheart"
        },
        "tinker": {
            "id": "tinker",
            "sourceId": "tinker",
            "name": "Tinker",
            "team": "good",
            "type": "outsider",
            "edition": "bmr",
            "ability": "You might die at any time.",
            "summary": "",
            "reminder": "The Tinker might die.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 56,
                        "phase": "other",
                        "label": "Tinker: The Tinker might die",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 56,
            "firstNightReminder": "",
            "otherNightReminder": "The Tinker might die.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/tinker.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#tinker"
        },
        "zealot": {
            "name": "Zealot",
            "team": "good",
            "type": "outsider",
            "edition": "experimental",
            "ability": "If there are 5 or more players alive, you must vote for every nomination.",
            "summary": "The Zealot votes.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Zealot",
            "id": "zealot"
        },
        "assassin": {
            "id": "assassin",
            "sourceId": "assassin",
            "name": "Assassin",
            "team": "evil",
            "type": "minion",
            "edition": "bmr",
            "ability": "Once per game, at night*, choose a player: they die, even if for some reason they could not.",
            "summary": "",
            "reminder": "If the Assassin has not yet used their ability: The Assassin either shows the 'no' head signal, or points to a player. That player dies.",
            "reminders": [
                "Dead",
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 41,
                        "phase": "other",
                        "label": "Assassin: If the Assassin has not yet used their ability: The Assassin either shows the 'no' head signal, or points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 41,
            "firstNightReminder": "",
            "otherNightReminder": "If the Assassin has not yet used their ability: The Assassin either shows the 'no' head signal, or points to a player. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/assassin.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#assassin"
        },
        "baron": {
            "id": "baron",
            "sourceId": "baron",
            "name": "Baron",
            "team": "evil",
            "type": "minion",
            "edition": "tb",
            "ability": "There are extra Outsiders in play. [+2 Outsiders]",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/baron.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#baron"
        },
        "boffin": {
            "name": "Boffin",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "The Demon (even if drunk or poisoned) has a not-in-play good character's ability. You both know which.",
            "summary": "The Boffin replicates a good ability.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [],
            "setup": true,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Boffin",
            "id": "boffin"
        },
        "boomdandy": {
            "id": "boomdandy",
            "sourceId": "boomdandy",
            "name": "Boomdandy",
            "team": "evil",
            "type": "minion",
            "edition": "ks",
            "ability": "If you are executed, all but 3 players die. 1 minute later, the player with the most players pointing at them dies.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/boomdandy.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#boomdandy"
        },
        "cerenovus": {
            "id": "cerenovus",
            "sourceId": "cerenovus",
            "name": "Cerenovus",
            "team": "evil",
            "type": "minion",
            "edition": "snv",
            "ability": "Each night, choose a player & a good character: they are “mad” they are this character tomorrow, or might be executed.",
            "summary": "",
            "reminder": "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
            "reminders": [
                "Mad"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 28,
                        "phase": "first",
                        "label": "Cerenovus: The Cerenovus points to a player, then to a character on their sheet",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 15,
                        "phase": "other",
                        "label": "Cerenovus: The Cerenovus points to a player, then to a character on their sheet",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 28,
            "otherNightIndex": 15,
            "firstNightReminder": "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
            "otherNightReminder": "The Cerenovus points to a player, then to a character on their sheet. Wake that player. Show the 'This character selected you' card, then the Cerenovus token. Show the selected character token. If the player is not mad about being that character tomorrow, they can be executed.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/cerenovus.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#cerenovus"
        },
        "devils_advocate": {
            "id": "devils_advocate",
            "sourceId": "devilsadvocate",
            "name": "Devil's Advocate",
            "team": "evil",
            "type": "minion",
            "edition": "bmr",
            "ability": "Each night, choose a living player (different to last night): if executed tomorrow, they don't die.",
            "summary": "",
            "reminder": "The Devil’s Advocate points to a living player. That player survives execution tomorrow.",
            "reminders": [
                "Survives execution"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 25,
                        "phase": "first",
                        "label": "Devil's Advocate: The Devil’s Advocate points to a living player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 13,
                        "phase": "other",
                        "label": "Devil's Advocate: The Devil’s Advocate points to a living player, different from the previous night",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 25,
            "otherNightIndex": 13,
            "firstNightReminder": "The Devil’s Advocate points to a living player. That player survives execution tomorrow.",
            "otherNightReminder": "The Devil’s Advocate points to a living player, different from the previous night. That player survives execution tomorrow.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/devilsadvocate.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#devilsadvocate"
        },
        "evil_twin": {
            "id": "evil_twin",
            "sourceId": "eviltwin",
            "name": "Evil Twin",
            "team": "evil",
            "type": "minion",
            "edition": "snv",
            "ability": "You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live.",
            "summary": "",
            "reminder": "Wake the Evil Twin and their twin. Confirm that they have acknowledged each other. Point to the Evil Twin. Show their Evil Twin token to the twin player. Point to the twin. Show their character token to the Evil Twin player.",
            "reminders": [
                "Twin"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 26,
                        "phase": "first",
                        "label": "Evil Twin: Wake the Evil Twin and their twin",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 26,
            "otherNightIndex": null,
            "firstNightReminder": "Wake the Evil Twin and their twin. Confirm that they have acknowledged each other. Point to the Evil Twin. Show their Evil Twin token to the twin player. Point to the twin. Show their character token to the Evil Twin player.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/eviltwin.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#eviltwin"
        },
        "fearmonger": {
            "id": "fearmonger",
            "sourceId": "fearmonger",
            "name": "Fearmonger",
            "team": "evil",
            "type": "minion",
            "edition": "ks",
            "ability": "Each night, choose a player. If you nominate & execute them, their team loses. All players know if you choose a new player.",
            "summary": "",
            "reminder": "The Fearmonger points to a player. Place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.",
            "reminders": [
                "Fear"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 29,
                        "phase": "first",
                        "label": "Fearmonger: The Fearmonger points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 17,
                        "phase": "other",
                        "label": "Fearmonger: The Fearmonger points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 29,
            "otherNightIndex": 17,
            "firstNightReminder": "The Fearmonger points to a player. Place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.",
            "otherNightReminder": "The Fearmonger points to a player. If different from the previous night, place the Fear token next to that player and announce that a new player has been selected with the Fearmonger ability.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fearmonger.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#fearmonger"
        },
        "goblin": {
            "id": "goblin",
            "sourceId": "goblin",
            "name": "Goblin",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Claimed"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/goblin.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#goblin"
        },
        "godfather": {
            "id": "godfather",
            "sourceId": "godfather",
            "name": "Godfather",
            "team": "evil",
            "type": "minion",
            "edition": "bmr",
            "ability": "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [−1 or +1 Outsider]",
            "summary": "",
            "reminder": "Show each of the Outsider tokens in play.",
            "reminders": [
                "Died today",
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 24,
                        "phase": "first",
                        "label": "Godfather: Show each of the Outsider tokens in play",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 42,
                        "phase": "other",
                        "label": "Godfather: If an Outsider died today: The Godfather points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 24,
            "otherNightIndex": 42,
            "firstNightReminder": "Show each of the Outsider tokens in play.",
            "otherNightReminder": "If an Outsider died today: The Godfather points to a player. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/godfather.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#godfather"
        },
        "harpy": {
            "id": "harpy",
            "sourceId": "harpy",
            "name": "Harpy",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or both might die.",
            "summary": "",
            "reminder": "Wake the Harpy; they point at one player, then another. Wake the 1st player the Harpy pointed to, show them the 'This character has selected you' card, show them the Harpy token, then point at the 2nd player the Harpy pointed to.",
            "reminders": [
                "Mad",
                "2nd"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 30,
                        "phase": "first",
                        "label": "Harpy: Wake the Harpy; they point at one player, then another",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 18,
                        "phase": "other",
                        "label": "Harpy: Wake the Harpy; they point at one player, then another",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 30,
            "otherNightIndex": 18,
            "firstNightReminder": "Wake the Harpy; they point at one player, then another. Wake the 1st player the Harpy pointed to, show them the 'This character has selected you' card, show them the Harpy token, then point at the 2nd player the Harpy pointed to.",
            "otherNightReminder": "Wake the Harpy; they point at one player, then another. Wake the 1st player the Harpy pointed to, show them the 'This character has selected you' card, show them the Harpy token, then point at the 2nd player the Harpy pointed to.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/harpy.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#harpy"
        },
        "marionette": {
            "id": "marionette",
            "sourceId": "marionette",
            "name": "Marionette",
            "team": "evil",
            "type": "minion",
            "edition": "ks",
            "ability": "You think you are a good character but you are not. The Demon knows who you are. [You neighbour the Demon]",
            "summary": "",
            "reminder": "Select one of the good players next to the Demon and place the Is the Marionette reminder token. Wake the Demon and show them the Marionette.",
            "reminders": [],
            "remindersGlobal": [
                "Is the Marionette"
            ],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 15,
                        "phase": "first",
                        "label": "Marionette: Select one of the good players next to the Demon and place the Is the Marionette reminder token",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 15,
            "otherNightIndex": null,
            "firstNightReminder": "Select one of the good players next to the Demon and place the Is the Marionette reminder token. Wake the Demon and show them the Marionette.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/marionette.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#marionette"
        },
        "mastermind": {
            "id": "mastermind",
            "sourceId": "mastermind",
            "name": "Mastermind",
            "team": "evil",
            "type": "minion",
            "edition": "bmr",
            "ability": "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/mastermind.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#mastermind"
        },
        "mezepheles": {
            "id": "mezepheles",
            "sourceId": "mezepheles",
            "name": "Mezepheles",
            "team": "evil",
            "type": "minion",
            "edition": "ks",
            "ability": "You start knowing a secret word. The 1st good player to say this word becomes evil that night.",
            "summary": "",
            "reminder": "Show the Mezepheles their secret word.",
            "reminders": [
                "Turns evil",
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 31,
                        "phase": "first",
                        "label": "Mezepheles: Show the Mezepheles their secret word",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 19,
                        "phase": "other",
                        "label": "Mezepheles: Wake the 1st good player that said the Mezepheles' secret word and show them the 'You are' card and the thumbs down evil signal",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 31,
            "otherNightIndex": 19,
            "firstNightReminder": "Show the Mezepheles their secret word.",
            "otherNightReminder": "Wake the 1st good player that said the Mezepheles' secret word and show them the 'You are' card and the thumbs down evil signal.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/mezepheles.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#mezepheles"
        },
        "organ_grinder": {
            "id": "organ_grinder",
            "sourceId": "organgrinder",
            "name": "Organ Grinder",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "All players keep their eyes closed when voting & the vote tally is secret. Votes for you only count if you vote.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "About to die"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/organgrinder.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#organgrinder"
        },
        "pit_hag": {
            "id": "pit_hag",
            "sourceId": "pithag",
            "name": "Pit-Hag",
            "team": "evil",
            "type": "minion",
            "edition": "snv",
            "ability": "Each night*, choose a player & a character they become (if not-in-play). If a Demon is made, deaths tonight are arbitrary.",
            "summary": "",
            "reminder": "The Pit-Hag points to a player and a character on the sheet. If this character is not in play, wake that player and show them the 'You are' card and the relevant character token. If the character is in play, nothing happens.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 16,
                        "phase": "other",
                        "label": "Pit-Hag: The Pit-Hag points to a player and a character on the sheet",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 16,
            "firstNightReminder": "",
            "otherNightReminder": "The Pit-Hag points to a player and a character on the sheet. If this character is not in play, wake that player and show them the 'You are' card and the relevant character token. If the character is in play, nothing happens.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/pithag.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#pithag"
        },
        "poisoner": {
            "id": "poisoner",
            "sourceId": "poisoner",
            "name": "Poisoner",
            "team": "evil",
            "type": "minion",
            "edition": "tb",
            "ability": "Each night, choose a player: they are poisoned tonight and tomorrow day.",
            "summary": "",
            "reminder": "The Poisoner points to a player. That player is poisoned.",
            "reminders": [
                "Poisoned"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 20,
                        "phase": "first",
                        "label": "Poisoner: The Poisoner points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 7,
                        "phase": "other",
                        "label": "Poisoner: The previously poisoned player is no longer poisoned",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 20,
            "otherNightIndex": 7,
            "firstNightReminder": "The Poisoner points to a player. That player is poisoned.",
            "otherNightReminder": "The previously poisoned player is no longer poisoned. The Poisoner points to a player. That player is poisoned.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/poisoner.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#poisoner"
        },
        "psychopath": {
            "id": "psychopath",
            "sourceId": "psychopath",
            "name": "Psychopath",
            "team": "evil",
            "type": "minion",
            "edition": "ks",
            "ability": "Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/psychopath.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#psychopath"
        },
        "scarlet_woman": {
            "id": "scarlet_woman",
            "sourceId": "scarletwoman",
            "name": "Scarlet Woman",
            "team": "evil",
            "type": "minion",
            "edition": "tb",
            "ability": "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don’t count)",
            "summary": "",
            "reminder": "If the Scarlet Woman became the Demon today: Show the 'You are' card, then the demon token.",
            "reminders": [
                "Demon"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 20,
                        "phase": "other",
                        "label": "Scarlet Woman: If the Scarlet Woman became the Demon today: Show the 'You are' card, then the demon token",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 20,
            "firstNightReminder": "",
            "otherNightReminder": "If the Scarlet Woman became the Demon today: Show the 'You are' card, then the demon token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/scarletwoman.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#scarletwoman"
        },
        "spy": {
            "id": "spy",
            "sourceId": "spy",
            "name": "Spy",
            "team": "evil",
            "type": "minion",
            "edition": "tb",
            "ability": "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.",
            "summary": "",
            "reminder": "Show the Grimoire to the Spy for as long as they need.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 57,
                        "phase": "first",
                        "label": "Spy: Show the Grimoire to the Spy for as long as they need",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 76,
                        "phase": "other",
                        "label": "Spy: Show the Grimoire to the Spy for as long as they need",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 57,
            "otherNightIndex": 76,
            "firstNightReminder": "Show the Grimoire to the Spy for as long as they need.",
            "otherNightReminder": "Show the Grimoire to the Spy for as long as they need.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/spy.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#spy"
        },
        "summoner": {
            "id": "summoner",
            "sourceId": "summoner",
            "name": "Summoner",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]",
            "summary": "",
            "reminder": "Show the 'These characters are not in play' card. Show 3 character tokens of good characters not in play.",
            "reminders": [
                "Night 1",
                "Night 2",
                "Night 3"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 11,
                        "phase": "first",
                        "label": "Summoner: Show the 'These characters are not in play' card",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 21,
                        "phase": "other",
                        "label": "Summoner: If it is the 3rd night, wake the Summoner",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 11,
            "otherNightIndex": 21,
            "firstNightReminder": "Show the 'These characters are not in play' card. Show 3 character tokens of good characters not in play.",
            "otherNightReminder": "If it is the 3rd night, wake the Summoner. They point to a player and a Demon on the character sheet - that player becomes that Demon.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/summoner.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#summoner"
        },
        "vizier": {
            "id": "vizier",
            "sourceId": "vizier",
            "name": "Vizier",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "All players know who you are. You can not die during the day. If good voted, you may choose to execute immediately.",
            "summary": "",
            "reminder": "Announce 'The Vizier is in play' and state which player they are.",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 65,
                        "phase": "first",
                        "label": "Vizier: Announce 'The Vizier is in play' and state which player they are",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 65,
            "otherNightIndex": null,
            "firstNightReminder": "Announce 'The Vizier is in play' and state which player they are.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/vizier.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#vizier"
        },
        "widow": {
            "id": "widow",
            "sourceId": "widow",
            "name": "Widow",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "On your 1st night, look at the Grimoire and choose a player: they are poisoned. 1 good player knows a Widow is in play.",
            "summary": "",
            "reminder": "Show the Grimoire to the Widow for as long as they need. The Widow points to a player. That player is poisoned. Wake a good player. Show the 'These characters are in play' card, then the Widow character token.",
            "reminders": [
                "Poisoned"
            ],
            "remindersGlobal": [
                "Knows"
            ],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 21,
                        "phase": "first",
                        "label": "Widow: Show the Grimoire to the Widow for as long as they need",
                        "key": "first_night"
                    }
                ],
                "otherNights": []
            },
            "firstNightIndex": 21,
            "otherNightIndex": null,
            "firstNightReminder": "Show the Grimoire to the Widow for as long as they need. The Widow points to a player. That player is poisoned. Wake a good player. Show the 'These characters are in play' card, then the Widow character token.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/widow.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#widow"
        },
        "witch": {
            "id": "witch",
            "sourceId": "witch",
            "name": "Witch",
            "team": "evil",
            "type": "minion",
            "edition": "snv",
            "ability": "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.",
            "summary": "",
            "reminder": "The Witch points to a player. If that player nominates tomorrow they die immediately.",
            "reminders": [
                "Cursed"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 27,
                        "phase": "first",
                        "label": "Witch: The Witch points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 14,
                        "phase": "other",
                        "label": "Witch: If there are 4 or more players alive: The Witch points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 27,
            "otherNightIndex": 14,
            "firstNightReminder": "The Witch points to a player. If that player nominates tomorrow they die immediately.",
            "otherNightReminder": "If there are 4 or more players alive: The Witch points to a player. If that player nominates tomorrow they die immediately.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/witch.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#witch"
        },
        "wizard": {
            "name": "Wizard",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "Once per game, choose to make a wish. If granted, it might have a price & leave a clue as to its nature.",
            "summary": "The Wizard makes a wish.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Wizard",
            "id": "wizard"
        },
        "wraith": {
            "name": "Wraith",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "You may choose to open your eyes at night. You wake when other evil players do.",
            "summary": "The Wraith knows and shares what happens at night.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 13,
                        "phase": "other",
                        "label": "Wraith: Optional — öffnet die Augen mit den bösen Spielern (Experimentell).",
                        "key": "wraith_evil_wake"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 13,
            "reminders": [],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Wraith",
            "id": "wraith"
        },
        "xaan": {
            "name": "Xaan",
            "team": "evil",
            "type": "minion",
            "edition": "experimental",
            "ability": "On night X, all Townsfolk are poisoned until dusk. [X Outsiders]",
            "summary": "The Xaan poisons all Townsfolk.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [
                "Night 1 Xaan",
                "Night 2 Xaan",
                "Night 3 Xaan",
                "X"
            ],
            "setup": true,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Xaan",
            "id": "xaan"
        },
        "al_hadikhia": {
            "id": "al_hadikhia",
            "sourceId": "alhadikhia",
            "name": "Al-Hadikhia",
            "team": "evil",
            "type": "demon",
            "edition": "ks",
            "ability": "Each night*, choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die.",
            "summary": "",
            "reminder": "The Al-Hadikhia chooses 3 players. Announce the first player, wake them to nod yes to live or shake head no to die, kill or resurrect accordingly, then put to sleep and announce the next player. If all 3 are alive after this, all 3 die.",
            "reminders": [
                "1",
                "2",
                "3",
                "Chose death",
                "Chose life"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 36,
                        "phase": "other",
                        "label": "Al-Hadikhia: The Al-Hadikhia chooses 3 players",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 36,
            "firstNightReminder": "",
            "otherNightReminder": "The Al-Hadikhia chooses 3 players. Announce the first player, wake them to nod yes to live or shake head no to die, kill or resurrect accordingly, then put to sleep and announce the next player. If all 3 are alive after this, all 3 die.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/alhadikhia.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#alhadikhia"
        },
        "fang_gu": {
            "id": "fang_gu",
            "sourceId": "fanggu",
            "name": "Fang Gu",
            "team": "evil",
            "type": "demon",
            "edition": "snv",
            "ability": "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]",
            "summary": "",
            "reminder": "The Fang Gu points to a player. That player dies. Or, if that player was an Outsider and there are no other Fang Gu in play: The Fang Gu dies instead of the chosen player. The chosen player is now an evil Fang Gu. Wake the new Fang Gu. Show the 'You are' card, then the Fang Gu token. Show the 'You are' card, then the thumb-down 'evil' hand sign.",
            "reminders": [
                "Dead",
                "Once"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 31,
                        "phase": "other",
                        "label": "Fang Gu: The Fang Gu points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 31,
            "firstNightReminder": "",
            "otherNightReminder": "The Fang Gu points to a player. That player dies. Or, if that player was an Outsider and there are no other Fang Gu in play: The Fang Gu dies instead of the chosen player. The chosen player is now an evil Fang Gu. Wake the new Fang Gu. Show the 'You are' card, then the Fang Gu token. Show the 'You are' card, then the thumb-down 'evil' hand sign.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fanggu.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#fanggu"
        },
        "imp": {
            "id": "imp",
            "sourceId": "imp",
            "name": "Imp",
            "team": "evil",
            "type": "demon",
            "edition": "tb",
            "ability": "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
            "summary": "",
            "reminder": "The Imp points to a player. That player dies. If the Imp chose themselves: Replace the character of 1 alive minion with a spare Imp token. Show the 'You are' card, then the Imp token.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 26,
                        "phase": "other",
                        "label": "Imp: The Imp points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 26,
            "firstNightReminder": "",
            "otherNightReminder": "The Imp points to a player. That player dies. If the Imp chose themselves: Replace the character of 1 alive minion with a spare Imp token. Show the 'You are' card, then the Imp token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/imp.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#imp"
        },
        "kazali": {
            "id": "kazali",
            "sourceId": "kazali",
            "name": "Kazali",
            "team": "evil",
            "type": "demon",
            "edition": "experimental",
            "ability": "Each night*, choose a player: they die. [You choose which players are Minions. -? to +? Outsiders]",
            "summary": "",
            "reminder": "The Kazali points to a player and a Minion on the character sheet. They do this for as many Minions as should be in play. Change those players' tokens to the chosen Minion tokens in the Grim. Wake those players, show them the 'You Are' card, the Minions they have become, and a thumbs down.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 3,
                        "phase": "first",
                        "label": "Kazali: The Kazali points to a player and a Minion on the character sheet",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 40,
                        "phase": "other",
                        "label": "Kazali: The Kazali points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 3,
            "otherNightIndex": 40,
            "firstNightReminder": "The Kazali points to a player and a Minion on the character sheet. They do this for as many Minions as should be in play. Change those players' tokens to the chosen Minion tokens in the Grim. Wake those players, show them the 'You Are' card, the Minions they have become, and a thumbs down.",
            "otherNightReminder": "The Kazali points to a player. That player dies",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/kazali.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#kazali"
        },
        "legion": {
            "id": "legion",
            "sourceId": "legion",
            "name": "Legion",
            "team": "evil",
            "type": "demon",
            "edition": "ks",
            "ability": "Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]",
            "summary": "",
            "reminder": "Choose a player, that player dies.",
            "reminders": [
                "Dead",
                "About to die"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 25,
                        "phase": "other",
                        "label": "Legion: Choose a player, that player dies",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 25,
            "firstNightReminder": "",
            "otherNightReminder": "Choose a player, that player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/legion.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#legion"
        },
        "leviathan": {
            "id": "leviathan",
            "sourceId": "leviathan",
            "name": "Leviathan",
            "team": "evil",
            "type": "demon",
            "edition": "ks",
            "ability": "If more than 1 good player is executed, you win. All players know you are in play. After day 5, evil wins.",
            "summary": "",
            "reminder": "Place the Leviathan 'Day 1' marker. Announce 'The Leviathan is in play; this is Day 1.'",
            "reminders": [
                "Day 1",
                "Day 2",
                "Day 3",
                "Day 4",
                "Day 5",
                "Good player executed"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 64,
                        "phase": "first",
                        "label": "Leviathan: Place the Leviathan 'Day 1' marker",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 82,
                        "phase": "other",
                        "label": "Leviathan: Change the Leviathan Day reminder for the next day",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 64,
            "otherNightIndex": 82,
            "firstNightReminder": "Place the Leviathan 'Day 1' marker. Announce 'The Leviathan is in play; this is Day 1.'",
            "otherNightReminder": "Change the Leviathan Day reminder for the next day.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/leviathan.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#leviathan"
        },
        "lil_monsta": {
            "id": "lil_monsta",
            "sourceId": "lilmonsta",
            "name": "Lil' Monsta",
            "team": "evil",
            "type": "demon",
            "edition": "experimental",
            "ability": "Each night, Minions choose who babysits Lil' Monsta's token & \"is the Demon\". A player dies each night*. [+1 Minion]",
            "summary": "",
            "reminder": "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta.",
            "reminders": [],
            "remindersGlobal": [
                "Is the Demon",
                "Dead"
            ],
            "setup": true,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 18,
                        "phase": "first",
                        "label": "Lil' Monsta: Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 38,
                        "phase": "other",
                        "label": "Lil' Monsta: Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 18,
            "otherNightIndex": 38,
            "firstNightReminder": "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta.",
            "otherNightReminder": "Wake all Minions together, allow them to vote by pointing at who they want to babysit Lil' Monsta. Choose a player, that player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/lilmonsta.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#lilmonsta"
        },
        "lleech": {
            "id": "lleech",
            "sourceId": "lleech",
            "name": "Lleech",
            "team": "evil",
            "type": "demon",
            "edition": "ks",
            "ability": "Each night*, choose a player: they die. You start by choosing an alive player: they are poisoned - you die if & only if they die.",
            "summary": "",
            "reminder": "The Lleech points to a player. Place the Poisoned reminder token.",
            "reminders": [
                "Dead",
                "Poisoned"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 19,
                        "phase": "first",
                        "label": "Lleech: The Lleech points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 37,
                        "phase": "other",
                        "label": "Lleech: The Lleech points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 19,
            "otherNightIndex": 37,
            "firstNightReminder": "The Lleech points to a player. Place the Poisoned reminder token.",
            "otherNightReminder": "The Lleech points to a player. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/lleech.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#lleech"
        },
        "lord_of_typhon": {
            "name": "Lord of Typhon",
            "team": "evil",
            "type": "demon",
            "edition": "experimental",
            "ability": "Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. -? to +? Outsiders]",
            "summary": "The Lord of Typhon is surrounded by Minions.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 0,
                        "phase": "other",
                        "label": "Lord of Typhon: choose a player to die",
                        "key": "kill"
                    }
                ]
            },
            "reminders": [
                "Dead"
            ],
            "setup": true,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Lord_of_Typhon",
            "id": "lord_of_typhon"
        },
        "no_dashii": {
            "id": "no_dashii",
            "sourceId": "nodashii",
            "name": "No Dashii",
            "team": "evil",
            "type": "demon",
            "edition": "snv",
            "ability": "Each night*, choose a player: they die. Your 2 Townsfolk neighbours are poisoned.",
            "summary": "",
            "reminder": "The No Dashii points to a player. That player dies.",
            "reminders": [
                "Dead",
                "Poisoned"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 32,
                        "phase": "other",
                        "label": "No Dashii: The No Dashii points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 32,
            "firstNightReminder": "",
            "otherNightReminder": "The No Dashii points to a player. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/nodashii.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#nodashii"
        },
        "ojo": {
            "id": "ojo",
            "sourceId": "ojo",
            "name": "Ojo",
            "team": "evil",
            "type": "demon",
            "edition": "experimental",
            "ability": "Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies.",
            "summary": "",
            "reminder": "The Ojo points to a character on the sheet; if in play, that player dies. If it is not in play, the Storyteller chooses who dies instead.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 35,
                        "phase": "other",
                        "label": "Ojo: The Ojo points to a character on the sheet; if in play, that player dies",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 35,
            "firstNightReminder": "",
            "otherNightReminder": "The Ojo points to a character on the sheet; if in play, that player dies. If it is not in play, the Storyteller chooses who dies instead.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/ojo.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#ojo"
        },
        "po": {
            "id": "po",
            "sourceId": "po",
            "name": "Po",
            "team": "evil",
            "type": "demon",
            "edition": "bmr",
            "ability": "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.",
            "summary": "",
            "reminder": "If the Po chose no-one the previous night: The Po points to three players. Otherwise: The Po either shows the 'no' head signal , or points to a player. Chosen players die",
            "reminders": [
                "Dead",
                "3 attacks"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 30,
                        "phase": "other",
                        "label": "Po: If the Po chose no-one the previous night: The Po points to three players",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 30,
            "firstNightReminder": "",
            "otherNightReminder": "If the Po chose no-one the previous night: The Po points to three players. Otherwise: The Po either shows the 'no' head signal , or points to a player. Chosen players die",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/po.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#po"
        },
        "pukka": {
            "id": "pukka",
            "sourceId": "pukka",
            "name": "Pukka",
            "team": "evil",
            "type": "demon",
            "edition": "bmr",
            "ability": "Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.",
            "summary": "",
            "reminder": "The Pukka points to a player. That player is poisoned.",
            "reminders": [
                "Poisoned",
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 32,
                        "phase": "first",
                        "label": "Pukka: The Pukka points to a player",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 28,
                        "phase": "other",
                        "label": "Pukka: The Pukka points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 32,
            "otherNightIndex": 28,
            "firstNightReminder": "The Pukka points to a player. That player is poisoned.",
            "otherNightReminder": "The Pukka points to a player. That player is poisoned. The previously poisoned player dies. ",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/pukka.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#pukka"
        },
        "riot": {
            "id": "riot",
            "sourceId": "riot",
            "name": "Riot",
            "team": "evil",
            "type": "demon",
            "edition": "ks",
            "ability": "Nominees die, but may nominate again immediately (on day 3, they must). After day 3, evil wins. [All Minions are Riot]",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/riot.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#riot"
        },
        "shabaloth": {
            "id": "shabaloth",
            "sourceId": "shabaloth",
            "name": "Shabaloth",
            "team": "evil",
            "type": "demon",
            "edition": "bmr",
            "ability": "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.",
            "summary": "",
            "reminder": "One player that the Shabaloth chose the previous night might be resurrected. The Shabaloth points to two players. Those players die.",
            "reminders": [
                "Dead",
                "Alive"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 29,
                        "phase": "other",
                        "label": "Shabaloth: One player that the Shabaloth chose the previous night might be resurrected",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 29,
            "firstNightReminder": "",
            "otherNightReminder": "One player that the Shabaloth chose the previous night might be resurrected. The Shabaloth points to two players. Those players die.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/shabaloth.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#shabaloth"
        },
        "vigormortis": {
            "id": "vigormortis",
            "sourceId": "vigormortis",
            "name": "Vigormortis",
            "team": "evil",
            "type": "demon",
            "edition": "snv",
            "ability": "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbour. [−1 Outsider]",
            "summary": "",
            "reminder": "The Vigormortis points to a player. That player dies. If a Minion, they keep their ability and one of their Townsfolk neighbours is poisoned.",
            "reminders": [
                "Dead",
                "Has ability",
                "Poisoned"
            ],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 34,
                        "phase": "other",
                        "label": "Vigormortis: The Vigormortis points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 34,
            "firstNightReminder": "",
            "otherNightReminder": "The Vigormortis points to a player. That player dies. If a Minion, they keep their ability and one of their Townsfolk neighbours is poisoned.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/vigormortis.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#vigormortis"
        },
        "vortox": {
            "id": "vortox",
            "sourceId": "vortox",
            "name": "Vortox",
            "team": "evil",
            "type": "demon",
            "edition": "snv",
            "ability": "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.",
            "summary": "",
            "reminder": "The Vortox points to a player. That player dies.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 33,
                        "phase": "other",
                        "label": "Vortox: The Vortox points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 33,
            "firstNightReminder": "",
            "otherNightReminder": "The Vortox points to a player. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/vortox.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#vortox"
        },
        "yaggababble": {
            "id": "yaggababble",
            "sourceId": "yaggababble",
            "name": "Yaggababble",
            "team": "evil",
            "type": "demon",
            "edition": "experimental",
            "ability": "You start knowing a secret phrase. For each time you said it publicly today, a player might die.",
            "summary": "",
            "reminder": "Show the Yaggababble their secret phrase.",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 6,
                        "phase": "first",
                        "label": "Yaggababble: Show the Yaggababble their secret phrase",
                        "key": "first_night"
                    }
                ],
                "otherNights": [
                    {
                        "order": 39,
                        "phase": "other",
                        "label": "Yaggababble: Choose a number of players up to the total number of times the Yaggababble said their secret phrase publicly, those players die",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": 6,
            "otherNightIndex": 39,
            "firstNightReminder": "Show the Yaggababble their secret phrase.",
            "otherNightReminder": "Choose a number of players up to the total number of times the Yaggababble said their secret phrase publicly, those players die.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/yaggababble.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#yaggababble"
        },
        "zombuul": {
            "id": "zombuul",
            "sourceId": "zombuul",
            "name": "Zombuul",
            "team": "evil",
            "type": "demon",
            "edition": "bmr",
            "ability": "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.",
            "summary": "",
            "reminder": "If no-one died during the day: The Zombuul points to a player. That player dies.",
            "reminders": [
                "Died today",
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 27,
                        "phase": "other",
                        "label": "Zombuul: If no-one died during the day: The Zombuul points to a player",
                        "key": "other_night"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 27,
            "firstNightReminder": "",
            "otherNightReminder": "If no-one died during the day: The Zombuul points to a player. That player dies.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/zombuul.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#zombuul"
        },
        "apprentice": {
            "id": "apprentice",
            "sourceId": "apprentice",
            "name": "Apprentice",
            "team": "traveler",
            "type": "traveler",
            "edition": "bmr",
            "ability": "On your 1st night, you gain a Townsfolk ability (if good), or a Minion ability (if evil).",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Is the Apprentice"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "Show the Apprentice the 'You are' card, then a Townsfolk or Minion token. In the Grimoire, replace the Apprentice token with that character token, and put the Apprentice's 'Is the Apprentice' reminder by that character token.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/apprentice.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#apprentice"
        },
        "barista": {
            "id": "barista",
            "sourceId": "barista",
            "name": "Barista",
            "team": "traveler",
            "type": "traveler",
            "edition": "snv",
            "ability": "Each night, until dusk, 1) a player becomes sober, healthy and gets true info, or 2) their ability works twice. They learn which.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Sober & Healthy",
                "Ability twice"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 54,
                        "phase": "first",
                        "label": "Barista: Spieler wählen — Barista-Effekt (sober/gesund/Info/2×) mitteilen.",
                        "key": "barista_first"
                    }
                ],
                "otherNights": [
                    {
                        "order": 54,
                        "phase": "other",
                        "label": "Barista: Spieler wählen — Barista-Effekt (sober/gesund/Info/2×) mitteilen.",
                        "key": "barista_other"
                    }
                ]
            },
            "firstNightIndex": 54,
            "otherNightIndex": 54,
            "firstNightReminder": "Choose a player, wake them and tell them which Barista power is affecting them. Treat them accordingly (sober/healthy/true info or activate their ability twice).",
            "otherNightReminder": "Choose a player, wake them and tell them which Barista power is affecting them. Treat them accordingly (sober/healthy/true info or activate their ability twice).",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/barista.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#barista"
        },
        "beggar": {
            "id": "beggar",
            "sourceId": "beggar",
            "name": "Beggar",
            "team": "traveler",
            "type": "traveler",
            "edition": "tb",
            "ability": "You must use a vote token to vote. Dead players may choose to give you theirs. If so, you learn their alignment. You are sober & healthy.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/beggar.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#beggar"
        },
        "bishop": {
            "id": "bishop",
            "sourceId": "bishop",
            "name": "Bishop",
            "team": "traveler",
            "type": "traveler",
            "edition": "bmr",
            "ability": "Only the Storyteller can nominate. At least 1 opposite player must be nominated each day.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Nominate good",
                "Nominate evil"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/bishop.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#bishop"
        },
        "bone_collector": {
            "id": "bone_collector",
            "sourceId": "bonecollector",
            "name": "Bone Collector",
            "team": "traveler",
            "type": "traveler",
            "edition": "snv",
            "ability": "Once per game, at night, choose a dead player: they regain their ability until dusk.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability",
                "Has ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 55,
                        "phase": "other",
                        "label": "Bone Collector: Einmal pro Spiel — toten Spieler wählen (Fähigkeit bis Dämmerung).",
                        "key": "bone_collector_other"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 55,
            "firstNightReminder": "",
            "otherNightReminder": "The Bone Collector either shakes their head no or points at any dead player. If they pointed at any dead player, put the Bone Collector's 'Has Ability' reminder by the chosen player's character token. (They may need to be woken tonight to use it.)",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/bonecollector.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#bonecollector"
        },
        "bureaucrat": {
            "id": "bureaucrat",
            "sourceId": "bureaucrat",
            "name": "Bureaucrat",
            "team": "traveler",
            "type": "traveler",
            "edition": "tb",
            "ability": "Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "3 votes"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 51,
                        "phase": "first",
                        "label": "Bureaucrat: Spieler wählen — „3 votes“-Reminder setzen.",
                        "key": "bureaucrat_first"
                    }
                ],
                "otherNights": [
                    {
                        "order": 51,
                        "phase": "other",
                        "label": "Bureaucrat: Spieler wählen — „3 votes“-Reminder setzen.",
                        "key": "bureaucrat_other"
                    }
                ]
            },
            "firstNightIndex": 51,
            "otherNightIndex": 51,
            "firstNightReminder": "The Bureaucrat points to a player. Put the Bureaucrat's '3 votes' reminder by the chosen player's character token.",
            "otherNightReminder": "The Bureaucrat points to a player. Put the Bureaucrat's '3 votes' reminder by the chosen player's character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/bureaucrat.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#bureaucrat"
        },
        "butcher": {
            "id": "butcher",
            "sourceId": "butcher",
            "name": "Butcher",
            "team": "traveler",
            "type": "traveler",
            "edition": "snv",
            "ability": "Each day, after the 1st execution, you may nominate again.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/butcher.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#butcher"
        },
        "cacklejack": {
            "name": "Cacklejack",
            "team": "traveler",
            "type": "traveler",
            "edition": "experimental",
            "ability": "Each day, choose a player: a different player changes character tonight.",
            "summary": "The Cacklejack causes character-changing chaos.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [
                "Not me"
            ],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Cacklejack",
            "id": "cacklejack"
        },
        "deviant": {
            "id": "deviant",
            "sourceId": "deviant",
            "name": "Deviant",
            "team": "traveler",
            "type": "traveler",
            "edition": "snv",
            "ability": "If you were funny today, you cannot die by exile.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/deviant.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#deviant"
        },
        "gangster": {
            "id": "gangster",
            "sourceId": "gangster",
            "name": "Gangster",
            "team": "traveler",
            "type": "traveler",
            "edition": "ks",
            "ability": "Once per day, you may choose to kill an alive neighbour, if your other alive neighbour agrees.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/gangster.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#gangster"
        },
        "gnome": {
            "name": "Gnome",
            "team": "traveler",
            "type": "traveler",
            "edition": "experimental",
            "ability": "All players start knowing a player of your alignment. You may choose to kill anyone who nominates them.",
            "summary": "The Gnome protects one player on their team.",
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "reminders": [
                "Amigo"
            ],
            "setup": false,
            "sourceUrl": "https://wiki.bloodontheclocktower.com/Gnome",
            "id": "gnome"
        },
        "gunslinger": {
            "id": "gunslinger",
            "sourceId": "gunslinger",
            "name": "Gunslinger",
            "team": "traveler",
            "type": "traveler",
            "edition": "tb",
            "ability": "Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/gunslinger.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#gunslinger"
        },
        "harlot": {
            "id": "harlot",
            "sourceId": "harlot",
            "name": "Harlot",
            "team": "traveler",
            "type": "traveler",
            "edition": "snv",
            "ability": "Each night*, choose a living player: if they agree, you learn their character, but you both might die.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Dead"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": [
                    {
                        "order": 56,
                        "phase": "other",
                        "label": "Harlot: * — Ziel wählen, Zustimmung, ggf. Charaktere zeigen (siehe ST-Text).",
                        "key": "harlot_other"
                    }
                ]
            },
            "firstNightIndex": null,
            "otherNightIndex": 56,
            "firstNightReminder": "",
            "otherNightReminder": "The Harlot points at any player. Then, put the Harlot to sleep. Wake the chosen player, show them the 'This character selected you' token, then the Harlot token. That player either nods their head yes or shakes their head no. If they nodded their head yes, wake the Harlot and show them the chosen player's character token. Then, you may decide that both players die.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/harlot.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#harlot"
        },
        "judge": {
            "id": "judge",
            "sourceId": "judge",
            "name": "Judge",
            "team": "traveler",
            "type": "traveler",
            "edition": "bmr",
            "ability": "Once per game, if another player nominated, you may choose to force the current execution to pass or fail.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No ability"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/judge.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#judge"
        },
        "matron": {
            "id": "matron",
            "sourceId": "matron",
            "name": "Matron",
            "team": "traveler",
            "type": "traveler",
            "edition": "bmr",
            "ability": "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/matron.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#matron"
        },
        "scapegoat": {
            "id": "scapegoat",
            "sourceId": "scapegoat",
            "name": "Scapegoat",
            "team": "traveler",
            "type": "traveler",
            "edition": "tb",
            "ability": "If a player of your alignment is executed, you might be executed instead.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/scapegoat.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#scapegoat"
        },
        "thief": {
            "id": "thief",
            "sourceId": "thief",
            "name": "Thief",
            "team": "traveler",
            "type": "traveler",
            "edition": "tb",
            "ability": "Each night, choose a player (not yourself): their vote counts negatively tomorrow.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Negative vote"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [
                    {
                        "order": 52,
                        "phase": "first",
                        "label": "Thief: Spieler wählen — „Negative vote“-Reminder setzen.",
                        "key": "thief_first"
                    }
                ],
                "otherNights": [
                    {
                        "order": 52,
                        "phase": "other",
                        "label": "Thief: Spieler wählen — „Negative vote“-Reminder setzen.",
                        "key": "thief_other"
                    }
                ]
            },
            "firstNightIndex": 52,
            "otherNightIndex": 52,
            "firstNightReminder": "The Thief points to a player. Put the Thief's 'Negative vote' reminder by the chosen player's character token.",
            "otherNightReminder": "The Thief points to a player. Put the Thief's 'Negative vote' reminder by the chosen player's character token.",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/thief.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#thief"
        },
        "voudon": {
            "id": "voudon",
            "sourceId": "voudon",
            "name": "Voudon",
            "team": "traveler",
            "type": "traveler",
            "edition": "bmr",
            "ability": "Only you and the dead can vote. They don't need a vote token to do so. A 50% majority is not required.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/voudon.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/generated/roles-combined.json#voudon"
        },
        "angel": {
            "id": "angel",
            "sourceId": "angel",
            "name": "Angel",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "Something bad might happen to whoever is most responsible for the death of a new player.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Protect",
                "Something Bad"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/angel.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#angel"
        },
        "bootlegger": {
            "id": "bootlegger",
            "sourceId": "bootlegger",
            "name": "Bootlegger",
            "team": "fabled",
            "type": "fabled",
            "edition": "experimental",
            "ability": "This script has homebrew characters or rules.",
            "summary": "",
            "reminder": "Announce the Bootlegger is in play and inform the group of all homebrew characters and/or rules you are using in this game. ",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "Announce the Bootlegger is in play and inform the group of all homebrew characters and/or rules you are using in this game. ",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/bootlegger.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#bootlegger"
        },
        "buddhist": {
            "id": "buddhist",
            "sourceId": "buddhist",
            "name": "Buddhist",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "For the first 2 minutes of each day, veteran players may not talk.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/buddhist.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#buddhist"
        },
        "djinn": {
            "id": "djinn",
            "sourceId": "djinn",
            "name": "Djinn",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "Use the Djinn's special rule. All players know what it is.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/djinn.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#djinn"
        },
        "doomsayer": {
            "id": "doomsayer",
            "sourceId": "doomsayer",
            "name": "Doomsayer",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "If 4 or more players live, each living player may publicly choose (once per game) that a player of their own alignment dies.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/doomsayer.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#doomsayer"
        },
        "duchess": {
            "id": "duchess",
            "sourceId": "duchess",
            "name": "Duchess",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "Each day, 3 players may choose to visit you. At night*, each visitor learns how many visitors are evil, but 1 gets false info.",
            "summary": "",
            "reminder": "Wake each player marked “Visitor” or “False Info” one at a time. Show them the Duchess token, then fingers (1, 2, 3) equaling the number of evil players marked “Visitor” or, if you are waking the player marked “False Info,” show them any number of fingers except the number of evil players marked “Visitor.”",
            "reminders": [
                "Visitor",
                "False Info"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "Wake each player marked “Visitor” or “False Info” one at a time. Show them the Duchess token, then fingers (1, 2, 3) equaling the number of evil players marked “Visitor” or, if you are waking the player marked “False Info,” show them any number of fingers except the number of evil players marked “Visitor.”",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/duchess.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#duchess"
        },
        "fibbin": {
            "id": "fibbin",
            "sourceId": "fibbin",
            "name": "Fibbin",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "Once per game, 1 good player might get false information.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Used"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fibbin.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#fibbin"
        },
        "fiddler": {
            "id": "fiddler",
            "sourceId": "fiddler",
            "name": "Fiddler",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "Once per game, the Demon secretly chooses an opposing player: all players choose which of these 2 players win.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/fiddler.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#fiddler"
        },
        "hellslibrarian": {
            "id": "hellslibrarian",
            "sourceId": "hellslibrarian",
            "name": "Hell's Librarian",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "Something bad might happen to whoever talks when the Storyteller has asked for silence.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Something Bad"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/hellslibrarian.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#hellslibrarian"
        },
        "revolutionary": {
            "id": "revolutionary",
            "sourceId": "revolutionary",
            "name": "Revolutionary",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "2 neighboring players are known to be the same alignment. Once per game, one of them registers falsely.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "Used"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/revolutionary.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#revolutionary"
        },
        "sentinel": {
            "id": "sentinel",
            "sourceId": "sentinel",
            "name": "Sentinel",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "There might be 1 extra or 1 fewer Outsider in play.",
            "summary": "",
            "reminder": "",
            "reminders": [],
            "remindersGlobal": [],
            "setup": true,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/sentinel.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#sentinel"
        },
        "spiritofivory": {
            "id": "spiritofivory",
            "sourceId": "spiritofivory",
            "name": "Spirit of Ivory",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "There can't be more than 1 extra evil player.",
            "summary": "",
            "reminder": "",
            "reminders": [
                "No extra evil"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/spiritofivory.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#spiritofivory"
        },
        "stormcatcher": {
            "id": "stormcatcher",
            "sourceId": "stormcatcher",
            "name": "Storm Catcher",
            "team": "fabled",
            "type": "fabled",
            "edition": "ks",
            "ability": "Name a good character. If in play, they can only die by execution, but evil players learn which player it is.",
            "summary": "",
            "reminder": "Mark a good player as \"Safe\". Wake each evil player and show them the marked player.",
            "reminders": [
                "Safe"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "Mark a good player as \"Safe\". Wake each evil player and show them the marked player.",
            "otherNightReminder": "",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/stormcatcher.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#stormcatcher"
        },
        "toymaker": {
            "id": "toymaker",
            "sourceId": "toymaker",
            "name": "Toymaker",
            "team": "fabled",
            "type": "fabled",
            "edition": "base3",
            "ability": "The Demon may choose not to attack & must do this at least once per game. Evil players get normal starting info.",
            "summary": "",
            "reminder": "If it is a night when a Demon attack could end the game, and the Demon is marked “Final night: No Attack,” then the Demon does not act tonight. (Do not wake them.)",
            "reminders": [
                "Final Night: No Attack"
            ],
            "remindersGlobal": [],
            "setup": false,
            "nightOrder": {
                "firstNight": [],
                "otherNights": []
            },
            "firstNightIndex": null,
            "otherNightIndex": null,
            "firstNightReminder": "",
            "otherNightReminder": "If it is a night when a Demon attack could end the game, and the Demon is marked “Final night: No Attack,” then the Demon does not act tonight. (Do not wake them.)",
            "remoteImage": "https://raw.githubusercontent.com/chizmw/json-on-the-clocktower/main/data/images/toymaker.png",
            "sourceUrl": "https://raw.githubusercontent.com/chizmeeple/json-on-the-clocktower/main/data/generated/roles-combined.json#toymaker"
        }
    }
};
// ═══════════════ ROLE DATA ═══════════════
let ROLES = {
  // Trouble Brewing - Good
  washerwoman:  { n:'Waschweib',      team:'good',    type:'Townsfolk', order:20,  firstOnly:true,  ability:'Du erfährst, dass einer von 2 Spielern [Rolle X] ist.' },
  librarian:    { n:'Bibliothekar',   team:'good',    type:'Townsfolk', order:25,  firstOnly:true,  ability:'Du erfährst, dass einer von 2 Spielern [Outsider] ist.' },
  investigator: { n:'Ermittler',      team:'good',    type:'Townsfolk', order:30,  firstOnly:true,  ability:'Du erfährst, dass einer von 2 Spielern [Minion] ist.' },
  chef:         { n:'Koch',           team:'good',    type:'Townsfolk', order:35,  firstOnly:true,  ability:'Du erfährst, wie viele böse Spieler nebeneinandersitzen.' },
  empath:       { n:'Empath',         team:'good',    type:'Townsfolk', order:60,  ability:'Du erfährst jede Nacht, wie viele deiner lebenden Nachbarn böse sind.' },
  fortune_teller:{ n:'Wahrsagerin',   team:'good',    type:'Townsfolk', order:70,  ability:'Jede Nacht: Du wählst 2 Spieler; du erfährst ob einer davon der Dämon ist.' },
  undertaker:   { n:'Totengräber',    team:'good',    type:'Townsfolk', order:120, otherOnly:true,  ability:'Jede Nacht (nicht die erste): Du erfährst die Rolle des heute Hingerichteten.' },
  monk:         { n:'Mönch',          team:'good',    type:'Townsfolk', order:45,  otherOnly:true,  ability:'Jede Nacht (nicht die erste): Ein Spieler (nicht du) ist vor dem Dämon geschützt.' },
  ravenkeeper:  { n:'Rabenhalter',    team:'good',    type:'Townsfolk', order:110, ability:'Wenn du in der Nacht stirbst, wählst du einen Spieler und erfährst seine Rolle.' },
  virgin:       { n:'Jungfrau',       team:'good',    type:'Townsfolk', order:0,   ability:'Wenn du das erste Mal nominiert wirst und der Nominierende Townsfolk ist, wird dieser sofort hingerichtet.' },
  slayer:       { n:'Jäger',          team:'good',    type:'Townsfolk', order:0,   ability:'Einmal pro Spiel: Behaupte tagsüber, den Imp zu erschießen.' },
  soldier:      { n:'Soldat',         team:'good',    type:'Townsfolk', order:0,   ability:'Du kannst nicht durch den Imp sterben.' },
  mayor:        { n:'Bürgermeister',  team:'good',    type:'Townsfolk', order:0,   ability:'Wenn nur noch 3 Spieler leben und keine Hinrichtung stattfindet, gewinnt Gut.' },
  butler:       { n:'Butler',         team:'good',    type:'Outsider',  order:50,  firstOnly:true, ability:'Jede Nacht wählst du deinen Herren; du darfst nur abstimmen, wenn er es tut.' },
  drunk:        { n:'Trunkenbold',    team:'good',    type:'Outsider',  order:0,   ability:'Du denkst, du bist ein Townsfolk, bist es aber nicht. Deine Fähigkeit funktioniert nicht.' },
  recluse:      { n:'Einsiedler',     team:'good',    type:'Outsider',  order:0,   ability:'Du kannst als böse gezählt werden, auch wenn du gut bist.' },
  saint:        { n:'Heilige/r',      team:'good',    type:'Outsider',  order:0,   ability:'Wenn du hingerichtet wirst, verliert Gut.' },
  // Trouble Brewing - Evil
  poisoner:     { n:'Giftmischer',    team:'evil',    type:'Minion',    order:30,  ability:'Jede Nacht: Du vergiftest einen Spieler. Seine Fähigkeit/Info funktioniert nicht.' },
  spy:          { n:'Spion',          team:'evil',    type:'Minion',    order:170, ability:'Jede Nacht: Du kannst das Grimoire sehen. Du kannst als gut gezählt werden.' },
  scarlet_woman:{ n:'Scharlachfrau',  team:'evil',    type:'Minion',    order:0,   ability:'Wenn der Imp stirbt und noch 5+ Spieler leben, wirst du zum neuen Imp.' },
  baron:        { n:'Baron',          team:'evil',    type:'Minion',    order:0,   ability:'Bei Setup gibt es 2 zusätzliche Outsider.' },
  imp:          { n:'Imp',            team:'evil',    type:'Dämon',     order:200, ability:'Jede Nacht: Du tötest einen Spieler. Wenn du dich selbst tötest, wird ein lebender Minion zum Imp.' },
  // Bad Moon Rising
  grandmother:  { n:'Großmutter',     team:'good',    type:'Townsfolk', order:55,  firstOnly:false, ability:'—' },
  sailor:       { n:'Seemann',        team:'good',    type:'Townsfolk', order:10,  firstOnly:false, ability:'—' },
  chambermaid:  { n:'Zofe',          team:'good',    type:'Townsfolk', order:65,  otherOnly:true,  ability:'—' },
  exorcist:     { n:'Exorzist',       team:'good',    type:'Townsfolk', order:40,  otherOnly:true,  ability:'—' },
  innkeeper:    { n:'Gastwirt',       team:'good',    type:'Townsfolk', order:35,  otherOnly:true,  ability:'—' },
  gambler:      { n:'Spieler',        team:'good',    type:'Townsfolk', order:45,  otherOnly:true,  ability:'—' },
  gossip:       { n:'Klatschbase',    team:'good',    type:'Townsfolk', order:50,  otherOnly:true,  ability:'—' },
  courtier:     { n:'Höfling',        team:'good',    type:'Townsfolk', order:25,  firstOnly:true,  ability:'—' },
  professor:    { n:'Professor',     team:'good',    type:'Townsfolk', order:100, otherOnly:true,  ability:'—' },
  minstrel:     { n:'Minnesänger',    team:'good',    type:'Townsfolk', order:0,   ability:'—' },
  tea_lady:     { n:'Teedame',        team:'good',    type:'Townsfolk', order:0,   ability:'—' },
  pacifist:     { n:'Pazifist',       team:'good',    type:'Townsfolk', order:0,   ability:'—' },
  fool:         { n:'Narr',           team:'good',    type:'Townsfolk', order:0,   ability:'—' },
  goon:         { n:'Schläger',       team:'good',   type:'Outsider',  order:0,   ability:'—' },
  lunatic:      { n:'Wahnsinniger',   team:'good',   type:'Outsider',  order:15,  firstOnly:false, ability:'—' },
  tinker:       { n:'Tüftler',        team:'good',   type:'Outsider',  order:0,   ability:'—' },
  moonchild:    { n:'Mondkind',       team:'good',   type:'Outsider',  order:0,   ability:'—' },
  godfather:    { n:'Pate',           team:'evil',   type:'Minion',    order:30,  firstOnly:false, ability:'—' },
  devils_advocate:{ n:'Teufels Advokat', team:'evil', type:'Minion',   order:20,  otherOnly:true,  ability:'—' },
  assassin:     { n:'Attentäter',     team:'evil',   type:'Minion',    order:80,  otherOnly:true,  ability:'—' },
  mastermind:   { n:'Mastermind',     team:'evil',   type:'Minion',    order:0,   ability:'—' },
  zombuul:      { n:'Zombuul',        team:'evil',   type:'Dämon',     order:190, otherOnly:true,  ability:'—' },
  pukka:        { n:'Pukka',          team:'evil',   type:'Dämon',     order:195, firstOnly:false, ability:'—' },
  shabaloth:    { n:'Shabaloth',      team:'evil',   type:'Dämon',     order:197, firstOnly:false, ability:'—' },
  po:           { n:'Po',             team:'evil',   type:'Dämon',     order:198, firstOnly:false, ability:'—' },
  // Sects & Violets
  clockmaker:   { n:'Uhrmacher',      team:'good',   type:'Townsfolk', order:30,  firstOnly:true,  ability:'—' },
  dreamer:      { n:'Träumer',        team:'good',   type:'Townsfolk', order:40,  firstOnly:false, ability:'—' },
  snake_charmer:{ n:'Schlangenbeschwörer', team:'good', type:'Townsfolk', order:15, firstOnly:false, ability:'—' },
  mathematician:{ n:'Mathematiker',   team:'good',   type:'Townsfolk', order:75,  firstOnly:false, ability:'—' },
  flowergirl:   { n:'Blumenmädchen',  team:'good',   type:'Townsfolk', order:60,  otherOnly:true,  ability:'—' },
  town_crier:   { n:'Stadtschreier',  team:'good',   type:'Townsfolk', order:55,  otherOnly:true,  ability:'—' },
  oracle:       { n:'Orakel',         team:'good',   type:'Townsfolk', order:65,  otherOnly:true,  ability:'—' },
  savant:       { n:'Gelehrter',      team:'good',   type:'Townsfolk', order:35,  firstOnly:true,  ability:'—' },
  seamstress:   { n:'Schneiderin',    team:'good',   type:'Townsfolk', order:45,  firstOnly:false, ability:'—' },
  philosopher:  { n:'Philosoph',      team:'good',   type:'Townsfolk', order:10,  firstOnly:false, ability:'—' },
  artist:       { n:'Künstler',       team:'good',   type:'Townsfolk', order:0,   ability:'—' },
  juggler:      { n:'Jongleur',       team:'good',   type:'Townsfolk', order:0,   ability:'—' },
  sage:         { n:'Weiser',         team:'good',   type:'Townsfolk', order:0,   ability:'—' },
  mutant:       { n:'Mutant',         team:'good',   type:'Outsider',  order:0,   ability:'—' },
  sweetheart:   { n:'Schatz',         team:'good',   type:'Outsider',  order:0,   ability:'—' },
  barber:       { n:'Barbier',        team:'good',   type:'Outsider',  order:0,   ability:'—' },
  klutz:        { n:'Tölpel',         team:'good',   type:'Outsider',  order:0,   ability:'—' },
  evil_twin:    { n:'Böser Zwilling', team:'evil',  type:'Minion',    order:25,  firstOnly:true,  ability:'—' },
  witch:        { n:'Hexe',           team:'evil',  type:'Minion',    order:30,  firstOnly:false, ability:'—' },
  cerenovus:    { n:'Cerenovus',      team:'evil',  type:'Minion',    order:35,  firstOnly:false, ability:'—' },
  pit_hag:      { n:'Grubenhexe',     team:'evil',  type:'Minion',    order:50,  otherOnly:true,  ability:'—' },
  fang_gu:      { n:'Fang Gu',        team:'evil',  type:'Dämon',     order:200, firstOnly:false, ability:'—' },
  vigormortis:  { n:'Vigormortis',    team:'evil',  type:'Dämon',     order:205, firstOnly:false, ability:'—' },
  no_dashii:    { n:'No-Dashii',      team:'evil',  type:'Dämon',     order:203, firstOnly:false, ability:'—' },
  vortox:       { n:'Vortox',         team:'evil',  type:'Dämon',     order:201, firstOnly:false, ability:'—' },
};

const MARKERS = ['Drunk','Poisoned','Protected','Spent','Mad','Executed','Nominated'];
const REMINDERS = {
  washerwoman: ['Townsfolk gesehen', 'Falscher Townsfolk'],
  librarian: ['Outsider gesehen', 'Kein Outsider'],
  investigator: ['Minion gesehen', 'Falscher Minion'],
  empath: ['0', '1', '2'],
  fortune_teller: ['Ja', 'Nein', 'Rot Herring'],
  undertaker: ['Rolle gesehen'],
  monk: ['Geschützt'],
  poisoner: ['Vergiftet'],
  spy: ['Grimoire gesehen'],
  imp: ['Getötet', 'Selbsttod'],
  butler: ['Herr gewählt'],
  grandmother: ['Enkelin bekannt'],
  sailor: ['Betrunken gemacht'],
  chambermaid: ['0 gewacht', '1 gewacht', '2 gewacht'],
  exorcist: ['Dämon gestoppt'],
  innkeeper: ['Geschützt', 'Betrunken'],
  godfather: ['Outsider getötet'],
  lunatic: ['Falsches Ziel'],
  snake_charmer: ['Rolle getauscht'],
  philosopher: ['Fähigkeit kopiert'],
  witch: ['Verflucht'],
  pit_hag: ['Rolle geändert'],
  chef: ['Vergiftet', 'Geschützt'],
  ravenkeeper: ['Rolle gesehen'],
  virgin: ['Ausgeführt'],
  slayer: ['Schuss verbraucht'],
  soldier: ['Unverwundbar'],
  mayor: ['3 Spieler', 'Keine Hinrichtung'],
  drunk: ['Denkt Townsfolk'],
  recluse: ['Als böse gezählt'],
  saint: ['Hinrichtung = Gut verliert'],
  scarlet_woman: ['Neuer Imp'],
  baron: ['+2 Outsider'],
  dreamer: ['Dämon vermutet', 'Nicht Dämon'],
  flowergirl: ['Blumen geworfen', 'Keine Blumen'],
  clockmaker: ['Dämon-Uhr'],
  juggler: ['Rate 1', 'Rate 2', 'Rate 3'],
  tinker: ['Stirbt über Nacht'],
  moonchild: ['böser Nachbar'],
  gambler: ['Rateleben', 'Tot'],
  gossip: ['Gerücht hinterlassen'],
  courtier: ['Betäubt A', 'Betäubt B'],
  professor: ['Tot wiederbelebt'],
  sweetheart: ['Partner tot'],
  barber: ['Charaktertausch'],
  evil_twin: ['Zwillings-Gut'],
  cerenovus: ['Wahnsinn'],
  summoner: ['Dämon erschaffen'],
  gunslinger: ['Schuss']
};
const REMINDER_ALWAYS = ['Poisoned', 'Drunk', 'Protected', 'Mad', 'Spent'];

// Script role lists (from roles-master.json after load)
let SCRIPTS = {};
let SCRIPT_ROLES = {
  trouble_brewing: { townsfolk: ['washerwoman','librarian','investigator','chef','empath','fortune_teller','undertaker','monk','ravenkeeper','virgin','slayer','soldier','mayor'], outsiders: ['butler','drunk','recluse','saint'], minions: ['poisoner','spy','scarlet_woman','baron'], demons: ['imp'] },
  bad_moon_rising: { townsfolk: [], outsiders: [], minions: [], demons: [] },
  sects_and_violets: { townsfolk: [], outsiders: [], minions: [], demons: [] }
};
const SCRIPT_LABELS = { trouble_brewing: 'Trouble Brewing', bad_moon_rising: 'Bad Moon Rising', sects_and_violets: 'Sects & Violets', custom: 'Custom' };

// ── Phase E: Jinxes (roles/jinxes-master.json) & Leiter-Checkliste ──
// ── Phase I: Diagnose über window.BOTC_runPhaseIReport() (nach botc-abilities.js) ──
// ── Phase J: Journal über window.BOTC.StoryLog + Panel „Protokoll“ (story-log.js) ──
// ── Phase K: Panel „Kern“ — Rollenübersicht (renderKernPanel in game-draw.js) ──
// ── Phase L: Panel „Limits“ — Token-Tabelle vs. Grimoire (renderLimitsPanel) ──
// ── Phase M: Panel „Marker“ — Marker/Erinnerung/Notiz pro Sitz (renderMarkersPanel) ──
let JINX_REASONS_BY_PAIR = new Map();

const STORYTELLER_MANUAL_CHECKS = [
  { id: 'poison_drunk', label: 'Vergiftung oder Trunkenheit vor betroffenen Info- und Schutzwirkungen bedacht' },
  { id: 'first_demon', label: 'Erste Nacht: Dämon- und Minion-Infos (Blickkontakt, Bluffs) vollständig' },
  { id: 'bluffs', label: 'Bluffs: drei gute, nicht im Spiel befindliche Charaktere gewählt und gezeigt' },
  { id: 'execution_state', label: 'Tod/Hinrichtung vor Nachtphasen und Poison-/Ability-Timing konsistent' },
  { id: 'traveller_limits', label: 'Traveller: Token-Tabelle und Außenseiter-Limits nach Ein-/Ausstieg geprüft' },
  { id: 'fabled', label: 'Fabled (falls genutzt): Effekt zu Spielbeginn angewendet und kommuniziert' },
  { id: 'night_order', label: 'Nachtreihenfolge mit Sonderfällen (Barista, Atheist, Script-Jinxes) abgeglichen' },
  { id: 'token_table', label: 'Aktuelle Spielerzahl vs. Grimoire-Stände (T/O/M/D) laut Token-Tabelle' }
];

function botcJinxPairKey(roleIdA, roleIdB) {
  if (!roleIdA || !roleIdB || roleIdA === roleIdB) return '';
  return roleIdA < roleIdB ? roleIdA + '|' + roleIdB : roleIdB + '|' + roleIdA;
}

function ingestJinxPairs(pairs) {
  JINX_REASONS_BY_PAIR = new Map();
  if (!pairs || !pairs.length) return;
  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i];
    const k = botcJinxPairKey(p.roleA, p.roleB);
    if (!k) continue;
    let arr = JINX_REASONS_BY_PAIR.get(k);
    if (!arr) {
      arr = [];
      JINX_REASONS_BY_PAIR.set(k, arr);
    }
    const reason = (p.reason && String(p.reason).trim()) || '';
    if (reason && arr.indexOf(reason) === -1) arr.push(reason);
  }
}

function getAssignedRoleIdsFromSeats() {
  if (typeof seats === 'undefined' || !Array.isArray(seats)) return [];
  const ids = [];
  for (let i = 0; i < seats.length; i++) {
    const r = seats[i] && seats[i].role;
    if (r) ids.push(r);
  }
  return ids;
}

/** Jinxes, bei denen beide Rollen mindestens einmal auf einem Sitz mit Rolle vorkommen. */
function getApplicableJinxesForCurrentSeats() {
  const roleIds = [...new Set(getAssignedRoleIdsFromSeats())];
  const out = [];
  for (let i = 0; i < roleIds.length; i++) {
    for (let j = i + 1; j < roleIds.length; j++) {
      const a = roleIds[i];
      const b = roleIds[j];
      const reasons = JINX_REASONS_BY_PAIR.get(botcJinxPairKey(a, b));
      if (reasons && reasons.length) out.push({ roleA: a, roleB: b, reasons: reasons.slice() });
    }
  }
  return out;
}

function roleDisplayLabel(roleId) {
  if (!roleId || typeof ROLES === 'undefined' || !ROLES[roleId]) return roleId || '—';
  const r = ROLES[roleId];
  return r.name || r.n || roleId;
}

function getStorytellerManualCheckStorage() {
  try {
    const raw = localStorage.getItem('botc_st_manual_checks');
    if (!raw) return {};
    const o = JSON.parse(raw);
    return o && typeof o === 'object' ? o : {};
  } catch (e) {
    return {};
  }
}

function setStorytellerManualCheck(id, checked) {
  try {
    const o = getStorytellerManualCheckStorage();
    o[id] = !!checked;
    localStorage.setItem('botc_st_manual_checks', JSON.stringify(o));
  } catch (e) {}
}

async function loadJinxesFromFile() {
  try {
    if (typeof JINXES_MASTER_EMBEDDED !== 'undefined' && JINXES_MASTER_EMBEDDED &&
        Array.isArray(JINXES_MASTER_EMBEDDED.jinxPairs)) {
      ingestJinxPairs(JINXES_MASTER_EMBEDDED.jinxPairs);
      if (typeof console !== 'undefined' && console.log) {
        console.log('[LOAD] Jinx-Paare (eingebettet, indexiert):', JINX_REASONS_BY_PAIR.size);
      }
      return;
    }
    if (typeof location !== 'undefined' && location.protocol === 'file:') {
      ingestJinxPairs([]);
      if (typeof console !== 'undefined' && console.log) {
        console.log('[LOAD] Jinx: file:// ohne jinxes-embedded.js — Panel leer');
      }
      return;
    }
    const res = await fetch('./roles/jinxes-master.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    ingestJinxPairs(data.jinxPairs || []);
    if (typeof console !== 'undefined' && console.log) {
      console.log('[LOAD] Jinx-Paare (fetch, indexiert):', JINX_REASONS_BY_PAIR.size);
    }
  } catch (e) {
    ingestJinxPairs([]);
    if (typeof console !== 'undefined' && console.warn) console.warn('[LOAD] jinxes-master.json:', e && e.message);
  }
}

// ── Phase F: Fabled (Storyteller-only, kein Sitz-Token) ──
let activeFabledIds = [];

function getAllFabledRoleIds() {
  if (typeof ROLES !== 'object' || !ROLES) return [];
  return Object.keys(ROLES).filter(function (id) {
    return ROLES[id] && isFabledRoleEntry(ROLES[id]);
  }).sort(function (a, b) {
    const la = String(roleDisplayLabel(a)).toLowerCase();
    const lb = String(roleDisplayLabel(b)).toLowerCase();
    if (la < lb) return -1;
    if (la > lb) return 1;
    return 0;
  });
}

function setActiveFabledIdsFromArray(arr) {
  activeFabledIds = Array.isArray(arr)
    ? arr.filter(function (x) { return typeof x === 'string' && x && ROLES[x] && isFabledRoleEntry(ROLES[x]); })
    : [];
  if (typeof gameSetup !== 'undefined' && gameSetup) {
    gameSetup.activeFabledIds = activeFabledIds.slice();
  }
}

function syncActiveFabledToGameSetup() {
  if (typeof gameSetup !== 'undefined' && gameSetup) {
    gameSetup.activeFabledIds = activeFabledIds.slice();
  }
}

/** Script-Typ: alle Charakter-Slot-Kategorien inkl. optional travellers auf Custom-Scripts */
const BOTC_SCRIPT_ROLE_KEYS = ['townsfolk', 'outsiders', 'minions', 'demons', 'travelers'];

function getActiveScriptKey() {
  if (typeof currentScript !== 'undefined' && currentScript) return currentScript;
  return 'trouble_brewing';
}

function isFabledRoleEntry(r) {
  return !!(r && String(r.type || '').toLowerCase() === 'fabled');
}

/**
 * Alle Rollen-IDs, die zur Charakterliste des Scripts gehören, plus alle Traveller
 * (Traveller stehen auf Druck-Scripts meist nicht drauf, sind aber immer zuweisbar).
 */
function expandScriptRoleIds(scriptKey) {
  const sk = scriptKey || getActiveScriptKey();
  const script = SCRIPT_ROLES && SCRIPT_ROLES[sk];
  const set = new Set();
  if (script) {
    BOTC_SCRIPT_ROLE_KEYS.forEach(function (k) {
      const arr = script[k];
      if (Array.isArray(arr)) arr.forEach(function (id) { if (id) set.add(id); });
    });
  }
  if (typeof ROLES === 'object' && ROLES) {
    Object.keys(ROLES).forEach(function (id) {
      const r = ROLES[id];
      if (r && String(r.type || '').toLowerCase() === 'traveler') set.add(id);
    });
  }
  return set;
}

function botcAllowOutsideScriptRoles() {
  try {
    return localStorage.getItem('botc_allow_outside_script') === '1';
  } catch (e) {
    return false;
  }
}

function setBotcAllowOutsideScriptRoles(on) {
  try {
    localStorage.setItem('botc_allow_outside_script', on ? '1' : '0');
  } catch (e) {}
}

/**
 * Rollen für Dropdowns: nach Script (inkl. Traveller) oder alle außer Fabled;
 * currentRoleId bleibt wählbar (z. B. nach Pit-Hag), auch wenn nicht auf Script.
 */
function collectRoleIdsForPicker(scriptKey, currentRoleId) {
  const allowAll = botcAllowOutsideScriptRoles();
  const ids = new Set();
  if (allowAll) {
    Object.keys(ROLES).forEach(function (k) {
      if (ROLES[k] && !isFabledRoleEntry(ROLES[k])) ids.add(k);
    });
  } else {
    expandScriptRoleIds(scriptKey).forEach(function (id) {
      ids.add(id);
    });
  }
  if (currentRoleId && ROLES[currentRoleId] && !isFabledRoleEntry(ROLES[currentRoleId])) {
    ids.add(currentRoleId);
  }
  return ids;
}

function roleTypeToGroupKey(r) {
  const t = String((r && r.type) || '').toLowerCase();
  const map = {
    townsfolk: 'Townsfolk',
    outsider: 'Outsider',
    minion: 'Minion',
    demon: 'Dämon',
    traveler: 'Traveller'
  };
  return map[t] || 'Sonstige';
}

const BOTC_ROLE_GROUP_ORDER = ['Townsfolk', 'Outsider', 'Minion', 'Dämon', 'Traveller', 'Sonstige'];

/**
 * Befüllt ein &lt;select&gt; mit Rollen nach aktuellem Script (Labels gruppiert, sortiert).
 */
function populateRoleSelectElement(selectEl, currentRoleId, scriptKey) {
  if (!selectEl || typeof ROLES !== 'object' || !ROLES) return;
  const sk = scriptKey != null ? scriptKey : getActiveScriptKey();
  selectEl.innerHTML = '<option value="">— Keine Rolle —</option>';
  const idSet = collectRoleIdsForPicker(sk, currentRoleId);
  const groups = {};
  BOTC_ROLE_GROUP_ORDER.forEach(function (g) {
    groups[g] = [];
  });
  idSet.forEach(function (k) {
    const r = ROLES[k];
    if (!r || isFabledRoleEntry(r)) return;
    const g = roleTypeToGroupKey(r);
    if (!groups[g]) groups[g] = [];
    groups[g].push([k, r]);
  });
  BOTC_ROLE_GROUP_ORDER.forEach(function (g2) {
    const list = groups[g2];
    if (!list || !list.length) return;
    list.sort(function (a, b) {
      const na = String((a[1].name || a[1].n || a[0]) || '');
      const nb = String((b[1].name || b[1].n || b[0]) || '');
      return na.localeCompare(nb, 'de');
    });
    const og = document.createElement('optgroup');
    og.label = g2;
    list.forEach(function (kr) {
      const k = kr[0];
      const r = kr[1];
      const o = document.createElement('option');
      o.value = k;
      o.textContent = r.name || r.n || k;
      if (k === currentRoleId) o.selected = true;
      og.appendChild(o);
    });
    selectEl.appendChild(og);
  });
}

function onPopupAllowOutsideScriptChange() {
  const el = document.getElementById('popupAllowOutsideRoles');
  const on = !!(el && el.checked);
  setBotcAllowOutsideScriptRoles(on);
  if (typeof popupId !== 'undefined' && popupId && typeof seats !== 'undefined' && Array.isArray(seats)) {
    const s = seats.find(function (x) {
      return x.id === popupId;
    });
    if (s) {
      const sel = document.getElementById('popupRoleSel');
      populateRoleSelectElement(sel, s.role, getActiveScriptKey());
    }
  }
}
if (typeof window !== 'undefined') window.onPopupAllowOutsideScriptChange = onPopupAllowOutsideScriptChange;

// Merge role from JSON pack into ROLES (index.html format: n, team, type, order, firstOnly, otherOnly, ability)
function mergeRoleFromJson(roleId, r) {
  if (!r || !r.name) return;
  const first = Array.isArray(r.nightOrder && r.nightOrder.firstNight) ? r.nightOrder.firstNight : [];
  const other = Array.isArray(r.nightOrder && r.nightOrder.otherNights) ? r.nightOrder.otherNights : [];
  const order = (first[0] && typeof first[0].order === 'number') ? first[0].order : (other[0] && typeof other[0].order === 'number') ? other[0].order : 0;
  const t = String(r.type || 'townsfolk').toLowerCase();
  const typeMap = { townsfolk: 'Townsfolk', outsider: 'Outsider', outsiders: 'Outsider', minion: 'Minion', demon: 'Dämon', demons: 'Dämon' };
  ROLES[roleId] = {
    n: r.name,
    team: r.team || 'good',
    type: typeMap[t] || 'Townsfolk',
    order: order,
    firstOnly: first.length > 0 && other.length === 0,
    otherOnly: other.length > 0 && first.length === 0,
    ability: r.ability || ''
  };
}

/**
 * Parst ein offizielles BOTC Custom Script JSON Array (von script.bloodontheclocktower.com).
 * Format: Array aus Strings (offizielle Rollen-IDs) und Objekten (Homebrew-Rollen oder _meta).
 * Lädt das Script als SCRIPTS['custom'] + SCRIPT_ROLES['custom'] und registriert Homebrew-Rollen in ROLES.
 * Gibt { ok, name, roleCount, errors } zurück.
 */
function botcImportCustomScriptJSON(jsonInput) {
  var result = { ok: false, name: 'Custom', roleCount: 0, errors: [] };
  var arr;
  try {
    arr = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
  } catch (e) {
    result.errors.push('JSON Parse-Fehler: ' + (e && e.message ? e.message : String(e)));
    return result;
  }
  if (!Array.isArray(arr)) {
    result.errors.push('Kein Array — erwartet: [ "_meta"-Objekt?, "rollenid", ... ]');
    return result;
  }

  var scriptName = 'Custom';
  var scriptAuthor = '';
  var townsfolk = [], outsiders = [], minions = [], demons = [], travelers = [];

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (!item) continue;

    // String: offizielle Rollen-ID
    if (typeof item === 'string') {
      var rid = item.toLowerCase().replace(/\s+/g, '_');
      if (!rid) continue;
      var roleData = (typeof ROLES !== 'undefined') ? ROLES[rid] : null;
      if (!roleData) {
        // Try stripping underscores (e.g. "fortuneteller" vs "fortune_teller")
        var ridNoUnderscore = rid.replace(/_/g, '');
        var found = null;
        if (typeof ROLES !== 'undefined') {
          Object.keys(ROLES).forEach(function(k) {
            if (k.replace(/_/g, '') === ridNoUnderscore) found = k;
          });
        }
        if (found) {
          rid = found;
          roleData = ROLES[found];
        } else {
          result.errors.push('Unbekannte Rolle: ' + item + ' (nicht in ROLES gefunden – wird als Townsfolk behandelt)');
          // Still add it – the Phase H stub will handle the ability
          townsfolk.push(rid);
          continue;
        }
      }
      var rtype = String(roleData.type || roleData.team || 'townsfolk').toLowerCase();
      if (rtype === 'townsfolk' || rtype === 'good') townsfolk.push(rid);
      else if (rtype === 'outsider') outsiders.push(rid);
      else if (rtype === 'minion') minions.push(rid);
      else if (rtype === 'demon') demons.push(rid);
      else if (rtype === 'traveler' || rtype === 'traveller') travelers.push(rid);
      else if (rtype === 'fabled') { /* skip fabled – storyteller-only */ }
      else townsfolk.push(rid);
      continue;
    }

    // Objekt
    if (typeof item !== 'object') continue;
    var itemId = String(item.id || '').trim();

    // _meta: Script-Metadaten
    if (itemId === '_meta') {
      if (item.name) scriptName = String(item.name);
      if (item.author) scriptAuthor = String(item.author);
      continue;
    }

    if (!itemId) {
      result.errors.push('Objekt ohne ID übersprungen: ' + JSON.stringify(item).slice(0, 60));
      continue;
    }

    var hid = itemId.toLowerCase().replace(/\s+/g, '_');

    // Bekannte Rolle? Zuerst in ROLES nachschlagen (wie bei String-IDs), damit
    // Standard-Script-JSONs mit {"id":"spy"} (kein team-Feld) korrekt einsortiert werden.
    var objExistingRole = (typeof ROLES !== 'undefined') ? ROLES[hid] : null;
    if (!objExistingRole && typeof ROLES !== 'undefined') {
      var objHidNoUnderscore = hid.replace(/_/g, '');
      Object.keys(ROLES).forEach(function(k) {
        if (!objExistingRole && k.replace(/_/g, '') === objHidNoUnderscore) {
          objExistingRole = ROLES[k]; hid = k;
        }
      });
    }
    if (objExistingRole) {
      var objRtype = String(objExistingRole.type || objExistingRole.team || 'townsfolk').toLowerCase();
      if (objRtype === 'townsfolk' || objRtype === 'good') townsfolk.push(hid);
      else if (objRtype === 'outsider') outsiders.push(hid);
      else if (objRtype === 'minion') minions.push(hid);
      else if (objRtype === 'demon') demons.push(hid);
      else if (objRtype === 'traveler' || objRtype === 'traveller') travelers.push(hid);
      else if (objRtype === 'fabled') { /* skip */ }
      else townsfolk.push(hid);
      continue;
    }

    // Homebrew-Charakter-Objekt (nicht in ROLES bekannt)
    var hteam = String(item.team || 'townsfolk').toLowerCase();
    var htype = hteam;

    // In ROLES registrieren (mergeRoleFromJson-kompatibel)
    if (typeof ROLES !== 'undefined') {
      var firstNightOrder = (typeof item.firstNight === 'number' && item.firstNight > 0) ? item.firstNight : 0;
      var otherNightOrder = (typeof item.otherNight === 'number' && item.otherNight > 0) ? item.otherNight : 0;
      var teamGoodEvil = (htype === 'townsfolk' || htype === 'outsider') ? 'good' : 'evil';
      var typeLabel = htype.charAt(0).toUpperCase() + htype.slice(1);

      ROLES[hid] = {
        n: String(item.name || hid),
        name: String(item.name || hid),
        team: teamGoodEvil,
        type: typeLabel,
        ability: String(item.ability || ''),
        firstNightReminder: String(item.firstNightReminder || ''),
        otherNightReminder: String(item.otherNightReminder || ''),
        reminders: Array.isArray(item.reminders) ? item.reminders : [],
        nightOrder: {
          firstNight: firstNightOrder > 0 ? [{ order: firstNightOrder, key: 'ability', label: String(item.name || hid), phase: 'first' }] : [],
          otherNights: otherNightOrder > 0 ? [{ order: otherNightOrder, key: 'ability', label: String(item.name || hid), phase: 'other' }] : []
        },
        homebrew: true
      };
    }

    if (htype === 'townsfolk' || htype === 'good') townsfolk.push(hid);
    else if (htype === 'outsider') outsiders.push(hid);
    else if (htype === 'minion') minions.push(hid);
    else if (htype === 'demon') demons.push(hid);
    else if (htype === 'traveler' || htype === 'traveller') travelers.push(hid);
    else if (htype === 'fabled') { /* skip */ }
    else townsfolk.push(hid);
  }

  // Script registrieren
  var customScript = {
    townsfolk: townsfolk,
    outsiders: outsiders,
    minions: minions,
    demons: demons,
    travelers: travelers
  };
  if (typeof SCRIPTS !== 'undefined') SCRIPTS['custom'] = customScript;
  if (typeof SCRIPT_ROLES !== 'undefined') SCRIPT_ROLES['custom'] = customScript;

  // Custom Script Name im Label speichern
  if (typeof SCRIPT_LABELS !== 'undefined' && scriptName !== 'Custom') {
    // Keep key 'custom' but update display label
    window._botcCustomScriptLabel = scriptName + (scriptAuthor ? ' (' + scriptAuthor + ')' : '');
  } else {
    window._botcCustomScriptLabel = null;
  }

  // Phase H Stubs für neue Homebrew-Rollen
  if (typeof window.BOTC_applyPhaseHStubs === 'function') {
    window.BOTC_applyPhaseHStubs();
  }

  result.ok = true;
  result.name = scriptName;
  result.author = scriptAuthor;
  result.roleCount = townsfolk.length + outsiders.length + minions.length + demons.length + travelers.length;
  return result;
}
if (typeof window !== 'undefined') window.botcImportCustomScriptJSON = botcImportCustomScriptJSON;

/** Phase I: einheitlicher Projekt-Snapshot für den Leiter (Konsole). */
function runPhaseIReport() {
  var lines = ['═══ Phase I — Projekt-Status ═══'];
  try {
    if (typeof location !== 'undefined') {
      lines.push('Protokoll: ' + location.protocol);
    }
    if (typeof ROLES === 'object' && ROLES) {
      lines.push('Rollen (ROLES): ' + Object.keys(ROLES).length);
    } else {
      lines.push('Rollen (ROLES): (noch nicht geladen)');
    }
    if (typeof SCRIPT_ROLES === 'object' && SCRIPT_ROLES) {
      Object.keys(SCRIPT_ROLES).forEach(function (sk) {
        var s = SCRIPT_ROLES[sk];
        if (!s || typeof s !== 'object') return;
        var n = 0;
        BOTC_SCRIPT_ROLE_KEYS.forEach(function (k) {
          var a = s[k];
          if (Array.isArray(a)) n += a.length;
        });
        var label = sk === 'custom' ? 'custom (Long List)' : sk;
        lines.push('  Script ' + label + ': ' + n + ' Slots');
      });
    }
    lines.push('Jinx-Paare indexiert: ' + (typeof JINX_REASONS_BY_PAIR !== 'undefined' ? JINX_REASONS_BY_PAIR.size : '—'));
    if (typeof window.BOTC_runPhaseHSelfCheck === 'function') {
      var ph = window.BOTC_runPhaseHSelfCheck();
      if (ph && ph.error) {
        lines.push('Ability-Check: ' + ph.error);
      } else if (ph) {
        lines.push('Phase P — Abilities: ' + ph.fullHandlerCount + ' mit Logik · ' + ph.stubCount + ' Stubs · ' + ph.playableRoles + ' spielbare Rollen (ohne Fabled) · fehlende Handler: ' + (ph.missingHandlers ? ph.missingHandlers.length : 0));
      }
    } else {
      lines.push('Ability-Check: botc-abilities.js fehlt noch — Seite vollständig laden, dann erneut aufrufen.');
    }
    lines.push('Rollenbilder: .cursor/rules/botc-token-images-frozen.mdc (nicht ändern ohne Absprache).');
    if (window.BOTC && window.BOTC.StoryLog && typeof window.BOTC.StoryLog.getEntries === 'function') {
      lines.push('Protokoll (Phase J): ' + window.BOTC.StoryLog.getEntries().length + ' Einträge · Panel „Protokoll“');
    }
    lines.push('Phase K: Panel „Kern“ — Rollen am Tisch kompakt');
    if (typeof botcCountGrimoireByTokenSlot === 'function' && typeof seats !== 'undefined') {
      const c = botcCountGrimoireByTokenSlot();
      lines.push('Phase L (Ist): T' + c.townsfolk + ' O' + c.outsider + ' M' + c.minion + ' D' + c.demon +
        (c.traveler ? ' Tr' + c.traveler : '') + (c.unset ? ' ?' + c.unset : '') + ' · ' + seats.length + ' Sitze');
    }
    if (typeof botcCountSeatsWithMarkerActivity === 'function' && typeof seats !== 'undefined') {
      lines.push('Phase M: ' + botcCountSeatsWithMarkerActivity() + ' Sitze mit Marker/Erinnerung/Notiz — Panel „Marker“');
    }
  } catch (e) {
    lines.push('Fehler: ' + (e && e.message ? e.message : e));
  }
  var out = lines.join('\n');
  if (typeof console !== 'undefined' && console.log) console.log(out);
  return lines;
}
if (typeof window !== 'undefined') window.BOTC_runPhaseIReport = runPhaseIReport;

async function loadRoles() {
  if (ROLES_DATA && ROLES_DATA.roles && ROLES_DATA.scripts) {
    ROLES = ROLES_DATA.roles;
    SCRIPTS = ROLES_DATA.scripts;
    SCRIPT_ROLES = ROLES_DATA.scripts;
    console.log('[LOAD] Rollen geladen:', Object.keys(ROLES).length, 'SCRIPTS:', Object.keys(SCRIPTS));
  } else {
    console.error('[LOAD] ROLES_DATA fehlt!');
  }
  await loadJinxesFromFile();
  if (typeof window !== 'undefined' && typeof window.BOTC_applyPhaseHStubs === 'function') {
    var ph = window.BOTC_applyPhaseHStubs();
    if (ph && ph.ok && typeof console !== 'undefined' && console.log && ph.stubsAdded > 0) {
      console.log('[Phase H] Ability-Stubs ergänzt:', ph.stubsAdded);
    }
  }
  if (typeof popupId !== 'undefined' && popupId && typeof refreshRoleSelect === 'function') refreshRoleSelect();
  if (typeof console !== 'undefined' && console.log) {
    console.log('[Phase M aktiv] Protokoll · Kern · Limits · Marker — BOTC_runPhaseIReport()');
  }
}

function refreshRoleSelect() {
  const s = seats.find(x => x.id === popupId);
  if (!s) return;
  const sel = document.getElementById('popupRoleSel');
  populateRoleSelectElement(sel, s.role, getActiveScriptKey());
  const cb = document.getElementById('popupAllowOutsideRoles');
  if (cb) cb.checked = botcAllowOutsideScriptRoles();
}

// team → colour mapping
const TEAM_COLOR = {
  good:     { ring:'rgba(93,150,223,.9)',  glow:'rgba(58,111,175,.55)',  dim:'rgba(58,111,175,.3)'  },
  evil:     { ring:'rgba(212,64,64,.9)',   glow:'rgba(158,32,32,.55)',   dim:'rgba(158,32,32,.3)'   },
  minion:   { ring:'rgba(154,80,200,.9)',  glow:'rgba(107,46,140,.55)',  dim:'rgba(107,46,140,.3)'  },
  outsider: { ring:'rgba(64,184,130,.9)',  glow:'rgba(42,122,90,.55)',   dim:'rgba(42,122,90,.3)'   },
  unknown:  { ring:'rgba(201,168,76,.6)',  glow:'rgba(201,168,76,.25)',  dim:'rgba(201,168,76,.12)' },
};

const ICON_BASE = './icons/';
const TOKEN_ASSETS_BASE = './assets/tokens/';
const ICON_ALIASES = { fortune_teller: 'fortuneteller', scarlet_woman: 'scarletwoman' };
function iconKey(roleId) { return String(roleId || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }

/** Dateiname unter assets/tokens/ (identisch zu scripts/download-role-tokens.js) */
function tokenFileKey(roleId) {
  return String(roleId || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
}

/** Zwei Kandidaten: zuerst .webp (häufig lokal), dann .png (npm run assets:tokens). */
function roleLocalTokenUrls(roleId) {
  const fk = tokenFileKey(roleId);
  if (!fk) return [];
  return [TOKEN_ASSETS_BASE + fk + '.webp', TOKEN_ASSETS_BASE + fk + '.png'];
}

function roleRemoteImageUrl(roleId) {
  if (!roleId || typeof ROLES === 'undefined' || !ROLES[roleId]) return '';
  const u = ROLES[roleId].remoteImage;
  return typeof u === 'string' ? u : '';
}

/**
 * Bild-URLs — POLITIK EINVERNEHMLICH GEFROREN (.cursor/rules/botc-token-images-frozen.mdc).
 * Nicht ändern ohne ausdrückliche Nutzeranweisung.
 *
 * - file://: ./icons zuerst → assets/tokens → CDN (SVG+file://: CDN meist wirkungslos).
 * - http(s): CDN zuerst → assets/tokens → ./icons/.
 * - BOTC_LOCAL_TOKEN_FIRST / BOTC_SEAT_LOCAL_TOKEN_FIRST: assets/tokens zuerst.
 */
function roleLocalPathsBeforeRemote() {
  if (typeof window === 'undefined') return false;
  return window.BOTC_LOCAL_TOKEN_FIRST === true || window.BOTC_SEAT_LOCAL_TOKEN_FIRST === true;
}

function botcIsFileProtocol() {
  return typeof location !== 'undefined' && location.protocol === 'file:';
}

function roleImageUrlList(roleId) {
  if (!roleId) return [];
  const locals = roleLocalTokenUrls(roleId);
  const remote = roleRemoteImageUrl(roleId);
  const k = ICON_ALIASES[roleId] || iconKey(roleId);
  const legacy = k ? (ICON_BASE + k + '.webp') : '';
  if (roleLocalPathsBeforeRemote()) {
    return [...locals, remote, legacy].filter(Boolean);
  }
  // file:// und http(s)://: icons/*.webp (volle Token-Karten) zuerst
  return [legacy, ...locals, remote].filter(Boolean);
}

/** Gleiche Reihenfolge wie roleImageUrlList (Sitze + Popups). */
function roleImageUrlListForSeat(roleId) {
  return roleImageUrlList(roleId);
}

function iconHref(roleId) {
  const list = roleImageUrlList(roleId);
  return list.length ? list[0] : '';
}

function getRoleIconPath(roleId) {
  return iconHref(roleId);
}

if (typeof window !== 'undefined') {
  window.roleImageUrlList = roleImageUrlList;
  window.roleImageUrlListForSeat = roleImageUrlListForSeat;
  window.tokenFileKey = tokenFileKey;
  window.roleRemoteImageUrl = roleRemoteImageUrl;
  window.BOTC_PHASE_ACTIVE = 'M';
  window.botcTokenTableLimitsForPlayerCount = botcTokenTableLimitsForPlayerCount;
  window.botcCountGrimoireByTokenSlot = botcCountGrimoireByTokenSlot;
  window.botcCountSeatsWithMarkerActivity = botcCountSeatsWithMarkerActivity;
}

/** type: 'townsfolk'|'outsider'|'minion'|'demon' (oder Plural). Liefert ROLES.type-String. */
function normalizeRoleTypeForFilter(type) {
  const t = String(type || '').toLowerCase();
  if (t === 'townsfolk') return 'Townsfolk';
  if (t === 'outsider' || t === 'outsiders') return 'Outsider';
  if (t === 'minion') return 'Minion';
  if (t === 'demon' || t === 'demons') return 'Dämon';
  return type;
}

/** Rollen, die aktuell wirklich auf Sitzen verteilt sind (aus globalem seats), gefiltert nach Typ. Duplikate möglich. */
function getRolesActuallyInPlayByType(type) {
  const list = (typeof seats !== 'undefined' && Array.isArray(seats)) ? seats : [];
  const roleType = normalizeRoleTypeForFilter(type);
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const r = list[i].roleId || list[i].role;
    if (!r) continue;
    const R = typeof ROLES !== 'undefined' ? ROLES[r] : null;
    if (R && R.type === roleType) out.push(r);
  }
  return out;
}

/** Eindeutige Rollen-IDs in der Runde für den gegebenen Typ (snake_case wie in seats). */
function getUniqueRolesActuallyInPlayByType(type) {
  const arr = getRolesActuallyInPlayByType(type);
  const seen = {};
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const id = String(arr[i]).toLowerCase();
    if (!seen[id]) { seen[id] = true; out.push(arr[i]); }
  }
  return out;
}

function getPlayfieldRect() {
  const root = document.getElementById('town') || document.body;
  const r = root.getBoundingClientRect();
  const W = r.width || window.innerWidth || 900;
  const H = r.height || window.innerHeight || 700;

  const topBar = document.getElementById('topBar') || document.querySelector('.topbar, header');
  const sidePanel = document.getElementById('sidePanel') || document.querySelector('.sidepanel, #rightPanel');

  const margin = 12;

  // Top offset: bottom edge of floating top bar + margin
  let topOffset = margin;
  if (topBar) {
    const br = topBar.getBoundingClientRect();
    topOffset = Math.max(topOffset, br.bottom - r.top + margin);
  }

  // Right panel width: use offsetWidth (reliable, not affected by CSS transitions)
  let panelWidth = 0;
  if (sidePanel && !sidePanel.classList.contains('collapsed')) {
    panelWidth = sidePanel.offsetWidth || 300;
  }

  const x0 = margin;
  const y0 = topOffset;
  // Available area excludes left margin and right panel (+ its margin)
  const w = Math.max(1, W - x0 - panelWidth - margin);
  const h = Math.max(1, H - y0 - margin);

  // Center is exactly 50% of the available area
  const cx = x0 + w / 2;
  const cy = y0 + h / 2;

  const minDim = Math.min(w, h);
  return { x0, y0, w, h, cx, cy, margin, W, H, minDim };
}
function getSeatSizeScale() {
  const el = document.getElementById('seatSizeRange');
  if (!el) return 1;
  const v = parseInt(el.value, 10);
  return (isNaN(v) ? 100 : v) / 100;
}
function getCircleSizeScale() {
  const el = document.getElementById('circleSizeRange');
  if (!el) return 1.3;
  const v = parseInt(el.value, 10);
  return (isNaN(v) ? 130 : v) / 100;
}
function getCircleWidthScale() {
  const el = document.getElementById('circleWidthRange');
  if (!el) return 1.7;
  const v = parseInt(el.value, 10);
  return (isNaN(v) ? 170 : v) / 100;
}
function getLayoutRxRy(pf, seatR) {
  const maxRy = Math.max(0, pf.h / 2 - seatR - pf.margin);
  const maxRx = Math.max(0, pf.w / 2 - seatR - pf.margin);
  const size = getCircleSizeScale();
  const width = getCircleWidthScale();
  const ry = Math.min(Math.max(maxRy * size, 0), maxRy);
  const rx = Math.min(Math.max(ry * width, 0), maxRx);
  return { rx, ry };
}

function teamOf(seat) {
  if (!seat.role || !ROLES[seat.role]) return 'unknown';
  const t = ROLES[seat.role].team;
  const ty = ROLES[seat.role].type;
  if (t === 'evil') return ty === 'Minion' || ty === 'Dämon' ? (ty === 'Dämon' ? 'evil' : 'minion') : 'evil';
  if (t === 'good' && ty === 'Outsider') return 'outsider';
  return t === 'good' ? 'good' : 'unknown';
}

// ═══════════════ STATE ═══════════════
let seats = [];
let selectedId = null;
let popupId = null;
/** Dämnon-Bluffs (3 gültige Townsfolk-IDs, snake_case) — Spy-Ansicht & Clocktracker-Export */
let demonBluffRoleIds = [];
/** Spieler-sichtbare Claims — öffentliche Notiz, getrennt von ST-Notizen */
let spyViewMode = false;

// Token Limits basierend auf Spieler-Anzahl (offizielle BotC Rules)
// Token Limits basierend auf Spieler-Anzahl (Official BotC Rules - siehe Token Table)
const TOKEN_LIMITS = {
  5:  { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
  6:  { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
  7:  { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
  8:  { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
  9:  { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
  10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
  11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
  12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
  13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
  14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
  15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 }
};

/** Phase L: offizielle Token-Tabelle für Spielerzahl (5–15), sonst null. */
function botcTokenTableLimitsForPlayerCount(n) {
  const p = parseInt(n, 10);
  if (isNaN(p) || p < 5 || p > 15) return null;
  return TOKEN_LIMITS[p];
}

/** Zählt Grimoire-Sitze nach Token-Slot (T/O/M/D/Traveller/leer). */
function botcCountGrimoireByTokenSlot() {
  const o = { townsfolk: 0, outsider: 0, minion: 0, demon: 0, traveler: 0, unset: 0 };
  const list = typeof seats !== 'undefined' && Array.isArray(seats) ? seats : [];
  for (let i = 0; i < list.length; i++) {
    const id = list[i] && (list[i].role || list[i].roleId);
    if (!id) {
      o.unset++;
      continue;
    }
    const r = typeof ROLES !== 'undefined' ? ROLES[id] : null;
    if (!r) {
      o.unset++;
      continue;
    }
    const ty = String(r.type || '');
    if (ty === 'Townsfolk') o.townsfolk++;
    else if (ty === 'Outsider') o.outsider++;
    else if (ty === 'Minion') o.minion++;
    else if (ty === 'Dämon' || ty === 'Demon') o.demon++;
    else if (ty === 'Traveler') o.traveler++;
    else o.unset++;
  }
  return o;
}

/** Phase M: Anzahl Sitze mit mindestens einem Grimoire-Marker, einer Erinnerung oder einer Leiter-Notiz. */
function botcCountSeatsWithMarkerActivity() {
  const list = typeof seats !== 'undefined' && Array.isArray(seats) ? seats : [];
  let n = 0;
  for (let i = 0; i < list.length; i++) {
    const s = list[i];
    if (!s) continue;
    const m = Array.isArray(s.markers) ? s.markers.length : 0;
    const r = Array.isArray(s.reminder) ? s.reminder.length : 0;
    const note = s.notes != null && String(s.notes).trim();
    if (m || r || note) n++;
  }
  return n;
}

const LEGION_DISTRIBUTION = {
  5: { legions: 3, good: 2 },
  6: { legions: 4, good: 2 },
  7: { legions: 5, good: 2 },
  8: { legions: 6, good: 2 },
  9: { legions: 7, good: 2 },
  10: { legions: 7, good: 3 },
  11: { legions: 8, good: 3 },
  12: { legions: 9, good: 3 },
  13: { legions: 9, good: 4 },
  14: { legions: 10, good: 4 },
  15: { legions: 11, good: 4 }
};

// Setup Phase Tracking
let setupPhase = 0; // 0 = Script+Count, 1 = Names, 2 = Token Draft, 3 = Bluffs
let gameSetup = {
  script: null,
  playerCount: null,
  gameStarted: false,
  seats: [], // [{ id, name, roleId, team, alive, drunk?, bluff? }]
  selectedTokens: {},
  baseLimits: null,
  effectiveLimits: null,
  allRoles: { townsfolk: [], outsider: [], minion: [], demon: [] },
  demonBluffs: [],
  tokenDistribution: {}, // { seatId: roleId, ... }
  specialRules: {
    drunk_active: false,
    drunk_townsfolk_id: null
  },
  activeFabledIds: [],
  modifiers: {
    baron_active: false,
    fang_gu_active: false,
    vigormortis_active: false,
    lil_monsta_active: false,
    godfather_outsider_effect: undefined,
    marionette_demon_present: null,
    atheist_confirmed: null,
    balloonist_outsider_bonus: undefined,
    hermit_counts_as_outsider: undefined
  },
  specialRoles: {
    choirboy_requires_king: false,
    huntsman_requires_damsel: false,
    bounty_hunter_evil_townsfolk: null,
    village_idiot_extra_count: undefined,
    village_idiot_drunk_id: null,
    marionette_active: false,
    kazali_active: false,
    kazali_outsider_delta: null,
    summoner_active: false,
    legion_active: false,
    legion_count: 0,
    legion_good_count: 0,
    lot_active: false,
    lot_good_count: 0
  }
};

Object.defineProperty(gameSetup, 'selectedScript', {
  get: function() { return gameSetup.script; },
  set: function(v) { gameSetup.script = v; }
});

// ═══════════════════════════════════════════
// ABILITY BRIDGE — required by botc-abilities.js
// ═══════════════════════════════════════════

window.openOverlay = function(title, bodyHtml, buttons) {
  var existing = document.getElementById('abilityOverlay');
  if (existing) existing.remove();

  var btns = Array.isArray(buttons) ? buttons : [];

  // Detect if bodyHtml looks like a raw large result (JA/NEIN/number) to give it special treatment
  var isSimpleResult = !btns.length && bodyHtml && bodyHtml.length < 60 && !bodyHtml.includes('<');
  var bodyDisplay = isSimpleResult
    ? '<div style="font-family:Cinzel Decorative,Cinzel,serif;font-size:clamp(52px,11vw,96px);font-weight:900;color:var(--gold,#c9a84c);letter-spacing:.04em;text-shadow:0 0 40px rgba(201,168,76,.5),0 4px 16px rgba(0,0,0,.8);line-height:1;margin:16px 0 20px;">' + bodyHtml.replace(/</g,'&lt;') + '</div>'
    : (bodyHtml ? '<div style="font-size:17px;line-height:1.6;color:var(--text,#e2d6bc);opacity:.92;margin:0 0 20px;">' + bodyHtml + '</div>' : '');

  var btnHtml = btns.map(function(b, i) {
    return '<button data-idx="' + i + '" type="button" style="flex:0 1 auto;min-width:120px;min-height:48px;padding:10px 18px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.35);border-radius:10px;color:var(--gold,#c9a84c);font-family:Cinzel,serif;font-size:clamp(13px,1.3vw,17px);font-weight:700;letter-spacing:.08em;cursor:pointer;transition:background .15s,box-shadow .15s;" onmouseover="this.style.background=\'rgba(201,168,76,.22)\';this.style.boxShadow=\'0 0 14px rgba(201,168,76,.3)\'" onmouseout="this.style.background=\'rgba(201,168,76,.1)\';this.style.boxShadow=\'\'">' +
           String(b.label || '?') + '</button>';
  }).join('');

  var overlay = document.createElement('div');
  overlay.id = 'abilityOverlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:99999;',
    'background:radial-gradient(ellipse at center, rgba(22,14,40,.97) 0%, rgba(4,2,12,.99) 100%);',
    'display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;',
    'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);'
  ].join('');

  overlay.innerHTML =
    '<div style="' +
      'max-width:min(800px,96vw);width:100%;' +
      'background:linear-gradient(160deg,#1c1430 0%,#0e0b1e 100%);' +
      'border:1px solid rgba(201,168,76,.35);border-radius:18px;' +
      'box-shadow:0 0 0 1px rgba(201,168,76,.08),0 32px 80px rgba(0,0,0,.85),inset 0 1px 0 rgba(201,168,76,.12);' +
      'padding:28px 28px 24px;text-align:center;overflow-y:auto;max-height:calc(100vh - 80px);position:relative;' +
    '">' +
    // Decorative top line
    '<div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:60px;height:2px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.7),transparent);border-radius:99px;"></div>' +
    // Title
    '<div style="font-family:Cinzel,serif;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(201,168,76,.6);margin-bottom:6px;">' + String(title || '').replace(/</g,'&lt;') + '</div>' +
    // Body
    bodyDisplay +
    // Buttons
    (btns.length ? '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;justify-content:center;">' + btnHtml + '</div>' : '') +
    (btns.length === 0 ?
      '<button id="abilityOverlayClose" type="button" style="margin-top:4px;width:100%;padding:15px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.4);border-radius:11px;color:var(--gold,#c9a84c);font-family:Cinzel,serif;font-size:14px;font-weight:700;letter-spacing:.1em;cursor:pointer;transition:background .15s;" onmouseover="this.style.background=\'rgba(201,168,76,.22)\'" onmouseout="this.style.background=\'rgba(201,168,76,.12)\'">OK</button>'
    : '') +
    '</div>';

  document.body.appendChild(overlay);

  btns.forEach(function(b, i) {
    var el = overlay.querySelector('[data-idx="' + i + '"]');
    if (el) el.addEventListener('click', function() { overlay.remove(); if (typeof b.onClick === 'function') b.onClick(); });
  });
  var closeBtn = overlay.querySelector('#abilityOverlayClose');
  if (closeBtn) closeBtn.addEventListener('click', function() { overlay.remove(); });
  overlay.addEventListener('click', function(ev) { if (ev.target === overlay) overlay.remove(); });
};

window.beginPick = function(opts) {
  opts = opts || {};
  var title = String(opts.title || 'Wähle Spieler');
  var count = opts.count || 1;
  var filterFn = typeof opts.filterFn === 'function' ? opts.filterFn : function() { return true; };
  var onDone = typeof opts.onDone === 'function' ? opts.onDone : function() {};

  var pickable = seats.filter(filterFn);
  if (!pickable.length) {
    window.openOverlay(title, 'Keine Spieler verfügbar.');
    onDone([]);
    return;
  }

  // Dynamische Kartengröße je nach Spieleranzahl
  var pCount   = pickable.length;
  var cardMinW = pCount <= 3 ? 280 : pCount <= 5 ? 220 : pCount <= 7 ? 180 : pCount <= 9 ? 155 : pCount <= 12 ? 132 : pCount <= 15 ? 114 : 98;
  var nameFS   = pCount <= 3 ? 26 : pCount <= 5 ? 21 : pCount <= 8 ? 18 : pCount <= 12 ? 16 : 14;
  var roleFS   = pCount <= 5 ? 16 : pCount <= 9 ? 14 : 12;
  var badgeFS  = pCount <= 5 ? 15 : 12;
  var cardPadV = pCount <= 5 ? 22 : pCount <= 9 ? 15 : 11;
  var cardPadH = pCount <= 5 ? 16 : pCount <= 9 ? 11 : 8;
  var dotSz    = pCount <= 5 ? 13 : pCount <= 9 ? 10 : 8;

  var selected = [];

  function getRoleName(roleId) {
    if (!roleId || typeof ROLES === 'undefined') return roleId || '';
    var r = ROLES[roleId];
    return r ? (r.name || r.n || roleId) : roleId;
  }

  function getRoleType(roleId) {
    if (!roleId || typeof ROLES === 'undefined') return 'townsfolk';
    var r = ROLES[roleId];
    return r ? String(r.type || 'townsfolk').toLowerCase() : 'townsfolk';
  }

  var typeColor = { townsfolk: '#6aabf7', outsider: '#b08aec', minion: '#f59a4b', demon: '#e85555', traveler: '#aaa', fabled: '#f0d070' };

  function buildGrid() {
    return pickable.map(function(s) {
      var rid = s.role || s.roleId || '';
      var roleName = rid ? getRoleName(rid) : '';
      var rType = rid ? getRoleType(rid) : 'townsfolk';
      var col = typeColor[rType] || '#aaa';
      var isSelected = selected.some(function(x) { return x.id === s.id; });
      return '<button data-seat-id="' + s.id + '" type="button" style="' +
        'display:flex;flex-direction:column;align-items:center;gap:5px;width:100%;' +
        'padding:' + cardPadV + 'px ' + cardPadH + 'px ' + cardPadH + 'px;' +
        'background:' + (isSelected ? 'rgba(201,168,76,.18)' : 'rgba(255,255,255,.04)') + ';' +
        'border:1px solid ' + (isSelected ? 'rgba(201,168,76,.7)' : 'rgba(255,255,255,.1)') + ';' +
        'border-radius:12px;cursor:pointer;transition:all .15s;' +
        (isSelected ? 'box-shadow:0 0 14px rgba(201,168,76,.3);' : '') +
      '"' +
      ' onmouseover="if(!this.classList.contains(\'sel\')){this.style.background=\'rgba(255,255,255,.08)\';this.style.borderColor=\'rgba(201,168,76,.4)\'}"' +
      ' onmouseout="if(!this.classList.contains(\'sel\')){this.style.background=\'rgba(255,255,255,.04)\';this.style.borderColor=\'rgba(255,255,255,.1)\'}"' +
      '>' +
      // Seat number badge
      '<span style="font-family:Cinzel,serif;font-size:' + badgeFS + 'px;font-weight:700;letter-spacing:.1em;color:rgba(201,168,76,.55);line-height:1;">' + s.id + '</span>' +
      // Role color dot
      (rid ? '<span style="width:' + dotSz + 'px;height:' + dotSz + 'px;border-radius:50%;background:' + col + ';opacity:.8;flex-shrink:0;"></span>' : '') +
      // Player name
      '<span style="font-size:' + nameFS + 'px;font-weight:600;color:#e2d6bc;text-align:center;line-height:1.2;word-break:break-word;max-width:100%;">' + (s.name || ('Sitz ' + s.id)).replace(/</g,'&lt;') + '</span>' +
      // Role name
      (roleName ? '<span style="font-size:' + roleFS + 'px;font-family:Cinzel,serif;color:' + col + ';opacity:.8;letter-spacing:.04em;text-align:center;line-height:1.2;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + roleName.replace(/</g,'&lt;') + '</span>' : '') +
      // Selected checkmark
      (isSelected ? '<span style="font-size:' + (nameFS + 2) + 'px;color:var(--gold,#c9a84c);line-height:1;">✦</span>' : '') +
      '</button>';
    }).join('');
  }

  var overlay = document.createElement('div');
  overlay.id = 'abilityPickOverlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:99999;',
    'background:radial-gradient(ellipse at center, rgba(22,14,40,.97) 0%, rgba(4,2,12,.99) 100%);',
    'display:flex;flex-direction:column;align-items:center;justify-content:flex-start;',
    'padding:env(safe-area-inset-top,16px) 0 0;box-sizing:border-box;overflow:hidden;',
    'backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);'
  ].join('');

  overlay.innerHTML =
    // Header
    '<div style="width:100%;padding:20px clamp(16px,3vw,40px) 0;box-sizing:border-box;flex-shrink:0;">' +
      '<div style="position:relative;text-align:center;margin-bottom:12px;">' +
        '<div style="font-family:Cinzel,serif;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:rgba(201,168,76,.55);margin-bottom:6px;">Spieler auswählen</div>' +
        '<h2 style="margin:0;font-family:Cinzel,serif;font-size:clamp(16px,2.5vw,24px);font-weight:700;color:#e2d6bc;letter-spacing:.02em;line-height:1.3;">' + title.replace(/</g,'&lt;') + '</h2>' +
      '</div>' +
      // Selection counter
      '<div id="pickSelectedInfo" style="text-align:center;font-size:14px;font-family:Cinzel,serif;letter-spacing:.06em;color:rgba(201,168,76,.7);min-height:20px;margin-bottom:12px;"></div>' +
    '</div>' +
    // Scrollable grid
    '<div style="flex:1;overflow-y:auto;width:100%;padding:0 clamp(12px,2.5vw,36px);box-sizing:border-box;">' +
      '<div id="pickSeatGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(' + cardMinW + 'px,1fr));gap:10px;padding:6px 0 16px;width:100%;"></div>' +
    '</div>' +
    // Sticky footer buttons
    '<div style="width:100%;padding:12px clamp(16px,3vw,40px) 24px;box-sizing:border-box;display:flex;gap:12px;flex-shrink:0;border-top:1px solid rgba(255,255,255,.06);background:linear-gradient(to bottom,transparent,rgba(4,2,12,.9));backdrop-filter:blur(8px);">' +
      '<button id="pickCancelBtn" type="button" style="flex:1;padding:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:11px;color:rgba(255,255,255,.55);font-family:Cinzel,serif;font-size:14px;letter-spacing:.1em;cursor:pointer;transition:background .15s;" onmouseover="this.style.background=\'rgba(255,255,255,.1)\'" onmouseout="this.style.background=\'rgba(255,255,255,.06)\'">Abbrechen</button>' +
      '<button id="pickConfirmBtn" type="button" disabled style="flex:2;padding:14px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.3);border-radius:11px;color:rgba(201,168,76,.45);font-family:Cinzel,serif;font-size:15px;font-weight:700;letter-spacing:.1em;cursor:not-allowed;transition:all .15s;">✓ Bestätigen</button>' +
    '</div>';

  document.body.appendChild(overlay);

  var confirmBtn = overlay.querySelector('#pickConfirmBtn');
  var cancelBtn  = overlay.querySelector('#pickCancelBtn');
  var infoEl     = overlay.querySelector('#pickSelectedInfo');
  var grid       = overlay.querySelector('#pickSeatGrid');

  function updateState() {
    var names = selected.map(function(s) { return s.name || ('Sitz ' + s.id); }).join(' · ');
    infoEl.textContent = selected.length
      ? (selected.length + ' / ' + count + ' gewählt' + (names ? ': ' + names : ''))
      : ('Bitte ' + count + ' Spieler wählen');
    var ready = selected.length >= count;
    confirmBtn.disabled = !ready;
    confirmBtn.style.background = ready ? 'rgba(201,168,76,.2)' : 'rgba(201,168,76,.06)';
    confirmBtn.style.borderColor = ready ? 'rgba(201,168,76,.6)' : 'rgba(201,168,76,.2)';
    confirmBtn.style.color = ready ? 'var(--gold,#c9a84c)' : 'rgba(201,168,76,.35)';
    confirmBtn.style.cursor = ready ? 'pointer' : 'not-allowed';
    confirmBtn.style.boxShadow = ready ? '0 0 20px rgba(201,168,76,.2)' : '';
    grid.innerHTML = buildGrid();
    bindGridClicks();
  }

  function bindGridClicks() {
    grid.querySelectorAll('[data-seat-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var sid = parseInt(btn.getAttribute('data-seat-id'), 10);
        var seat = seats.find(function(s) { return s.id === sid; });
        if (!seat) return;
        var idx = selected.findIndex(function(s) { return s.id === sid; });
        if (idx >= 0) {
          selected.splice(idx, 1);
        } else {
          if (selected.length >= count) selected.shift();
          selected.push(seat);
        }
        updateState();
      });
    });
  }

  updateState();

  confirmBtn.addEventListener('click', function() { if (!confirmBtn.disabled) { overlay.remove(); onDone(selected); } });
  cancelBtn.addEventListener('click', function() { overlay.remove(); onDone([]); });
};

window.setFlag = function(seatId, flag, value) {
  var s = seats.find(function(x) { return String(x.id) === String(seatId); });
  if (!s) return;
  if (!s.flags) s.flags = {};
  if (flag === 'dead' && value === true) {
    s.alive = false;
  } else if (flag === 'dead' && value === false) {
    s.alive = true;
  } else {
    s.flags[flag] = value;
  }
  if (typeof scheduleSave === 'function') scheduleSave();
  if (typeof draw === 'function') draw();
};

window.clearFlag = function(seatId, flag) {
  var s = seats.find(function(x) { return String(x.id) === String(seatId); });
  if (!s || !s.flags) return;
  delete s.flags[flag];
  if (typeof scheduleSave === 'function') scheduleSave();
};

// Also expose showToast globally for botc-abilities.js
if (typeof window.showToast !== 'function') {
  window.showToast = function(msg, ms) { showToast(msg, ms); };
}

// ═══════════════════════════════════════════

let dayNumber = 1;
let nightNumber = 1;
let nightSteps = [];
let nominationLog = []; // [{nominatorId, nomineeId}] — resets each day
let panelOpen = true;
let hoverTimeout = null;
let assistantMode = false;
let toastTimer = null;
let currentScript = 'trouble_brewing';
let seatClickCount = 0;
let lastSeatPositions = new Map();
let lastPlayfieldRect = null;

const DEMO_STATE_KEY = 'botc_demo_state_v1';
let saveTimer = null;
