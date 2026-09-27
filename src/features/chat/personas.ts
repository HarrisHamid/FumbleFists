/**
 * How each fictional fighter talks. Lines can use these slots, filled from
 * your card: {me} (your first name), {major}, {gpa}, {failed}.
 */
export type Topic =
  | "greeting"
  | "gpa"
  | "exam"
  | "when"
  | "where"
  | "taunt"
  | "scared"
  | "rules"
  | "nice"
  | "question";

export type Persona = {
  /** Sent the moment you match. */
  opener: string;
  /** Default replies in their voice when nothing more specific fits. */
  lines: string[];
  /** Their own take on a topic; falls back to the shared lines below. */
  topics?: Partial<Record<Topic, string[]>>;
};

/** How to spot a topic in what you typed. First match wins. */
export const TOPIC_PATTERNS: [Topic, RegExp][] = [
  ["scared", /\b(scared|afraid|nervous|chicken|forfeit|back out|quit|mercy)\b/i],
  ["gpa", /\b(gpa|grades?|transcript|4\.0|dean'?s list)\b/i],
  ["exam", /\b(exam|test|final|midterm|failed|fail|class|course|professor|prof)\b/i],
  ["when", /\b(when|time|tonight|tomorrow|today|weekend|o'?clock|\d{1,2}\s?(am|pm))\b/i],
  ["where", /\b(where|gym|ring|court|quad|library|rec|place|meet)\b/i],
  ["rules", /\b(rules?|gloves|headgear|rounds?|tap|ref|referee|safe)\b/i],
  ["taunt", /\b(lose|losing|beat|destroy|smoke|wreck|cook|easy|weak|trash|down|ko|knock)\b/i],
  ["nice", /\b(gg|good luck|respect|nice|cool|thanks|thank you|love)\b/i],
  ["greeting", /^\s*(hi|hey|hello|yo|sup|what'?s up|howdy)\b/i],
  ["question", /\?\s*$/],
];

export const SHARED_TOPICS: Record<Topic, string[]> = {
  greeting: ["Yo {me}.", "Oh, you actually texted. Brave.", "Hey. Stretch first, talk later."],
  gpa: [
    "A {gpa}? I've seen higher numbers on a parking ticket.",
    "We don't talk GPAs in the ring. Mostly because of yours.",
    "My GPA is lower than yours and my hands are faster. Balance.",
  ],
  exam: [
    "{failed} took you out? I'll finish the job.",
    "Don't bring up exams. I'm still grieving.",
    "Everyone here failed something. That's the whole point.",
  ],
  when: [
    "Tonight. 9pm. Don't be late.",
    "Tomorrow morning. Before you've had time to think.",
    "Whenever you stop stalling. Book it in Bouts when it's live.",
  ],
  where: [
    "Rec center, mat 2. Neutral ground.",
    "The gym. Somewhere with a ref and a first-aid kit.",
    "Behind the library is a lawsuit. Rec center.",
  ],
  taunt: [
    "Big words for someone who failed {failed}.",
    "Save it for the ring.",
    "Screenshotting this for after.",
    "You type tough. Let's see the footwork.",
  ],
  scared: [
    "Too late, you swiped right.",
    "Relax. Gloves, headgear, tap out any time. You'll live.",
    "Scared is fine. Showing up is the flex.",
  ],
  rules: [
    "Gloves, headgear, three rounds, tap out any time.",
    "Light sparring. We're fighting our grades, not each other. Mostly.",
    "Ref's word is final. Loser buys food.",
  ],
  nice: [
    "Respect. Still gonna win though.",
    "Appreciate it. See you on the mat.",
    "Good energy. Bring it Friday.",
  ],
  question: [
    "Ask me after round three.",
    "Maybe. Depends how you fight.",
    "Wrong question. Right answer: yes.",
  ],
};

export const PERSONAS: Record<string, Persona> = {
  "jade-okafor": {
    opener: "You swiped right on 14-3. Bold for a {major} major.",
    lines: [
      "I don't do small talk. I do combos.",
      "Organic chem didn't break me. Neither will you.",
      "Keep typing. I'm warming up.",
      "Fourteen wins. Want to be fifteen?",
    ],
    topics: {
      exam: ["ORGA was a crime scene. I'm the sequel.", "Don't say 'mechanism' near me."],
      scared: ["You should be. But I'll go easy for one round."],
    },
  },
  "kofi-mensah": {
    opener: "Match! Loser buys dining hall nuggets. Non-negotiable.",
    lines: [
      "Entropy always increases. So does my hunger.",
      "I'm 1-2 but those two losses were close. Emotionally.",
      "Nuggets are on the line, {me}.",
      "Thermodynamically, you're already losing heat.",
    ],
    topics: {
      when: ["After lunch. Actually before lunch. I fight better hungry."],
      exam: ["Thermo taught me one thing: everything falls apart. Including you."],
      nice: ["You're alright. Still buying nuggets though."],
    },
  },
  "mara-voss": {
    opener: "4-0 and fully rested. You sure about this?",
    lines: [
      "I slept nine hours. Did you?",
      "Undefeated isn't a stat, it's a lifestyle.",
      "I'll be at the gym at 6am. You'll be asleep.",
      "Hydrate. You'll need it.",
    ],
    topics: {
      when: ["6am. Non-negotiable. Winners wake up early."],
      taunt: ["Cute. I've heard that four times. Four wins."],
    },
  },
  "theo-park": {
    opener: "Statistically, one of us loses. My money's on you.",
    lines: [
      "My confidence interval says I win.",
      "Correlation isn't causation, but my jab is.",
      "Null hypothesis: you last one round.",
      "I'd run a regression on your chances but I'm not a sadist.",
    ],
    topics: {
      gpa: ["Your {gpa} is an outlier. On the low side."],
      question: ["Sample size of one says yes."],
    },
  },
  "priya-nair": {
    opener: "Match found in O(1). Your defeat is O(n).",
    lines: [
      "I've already memoized your weaknesses.",
      "Failed algorithms. Now optimizing for violence.",
      "Your game plan has a bug. It's you.",
      "I'll greedy-algorithm this: take every opening.",
    ],
    topics: {
      exam: ["Dynamic programming broke me. Now I break things."],
      taunt: ["Talk is cheap. Runtime is not."],
      greeting: ["Hello, world. Goodbye, {me}."],
    },
  },
  "diego-alvarez": {
    opener: "My final project collapsed. Your guard's next.",
    lines: [
      "Load-bearing trash talk incoming.",
      "I study structures. Yours is questionable.",
      "Every good design has a weak point. Found yours.",
      "I'm 3-5 but my form is architectural.",
    ],
    topics: {
      where: ["Somewhere with good sightlines. The rec center has great beams."],
      nice: ["Thanks. You've got solid foundations. For losing."],
    },
  },
  "hana-sato": {
    opener: "One B-minus and I snapped. You're my therapy.",
    lines: [
      "12-0. I don't lose. I don't get B-minuses either. Usually.",
      "Pre-med means I know exactly where it'll hurt.",
      "Light rounds only. Kidding.",
      "I scheduled you between organic lab and a nap.",
    ],
    topics: {
      gpa: ["{gpa}? I cried over a 3.7 once. Perspective."],
      scared: ["I know first aid. Technically you're in good hands."],
    },
  },
  "marcus-bell": {
    opener: "0-7 and I've never been more ready. LET'S GO.",
    lines: [
      "Win number one starts with you.",
      "Debits on the left, fists on the right.",
      "I don't lose. I just haven't won yet.",
      "My accountant says this is a bad investment. Fired him.",
    ],
    topics: {
      taunt: ["Everybody says that. Then I lose. But not this time."],
      scared: ["Don't be scared. I'm 0-7. You're basically safe."],
      nice: ["Man, you're the nicest opponent I've had. Still going for the W."],
    },
  },
  "ines-ferreira": {
    opener: "If a match happens and no one spars, did it happen?",
    lines: [
      "I think, therefore I jab.",
      "The unexamined fighter is not worth sparring.",
      "Losing is a social construct. Winning is not.",
      "Socrates would have swiped left on you. I didn't. Grateful?",
    ],
    topics: {
      question: ["Define 'question'. Kidding. Yes."],
      exam: ["Formal logic: If you fight me, you lose. You'll fight me. Therefore."],
    },
  },
  "sam-whitaker": {
    opener: "I wrote a 12-page essay on why I'll beat you. Got a C.",
    lines: [
      "Your trash talk lacks a thesis.",
      "I'd call this a tragedy but it's more of a comedy.",
      "Cite your sources for that confidence.",
      "Ending this fight with a strong conclusion.",
    ],
    topics: {
      taunt: ["Bold claim. Weak evidence.", "Show, don't tell."],
      greeting: ["Salutations. Also, prepare."],
    },
  },
  "lena-kowalski": {
    opener: "Reynolds number of my rage: highly turbulent. Hi.",
    lines: [
      "Pressure's building. Mostly on you.",
      "I flow like water. Specifically, a burst pipe.",
      "Failed fluids, mastered friction.",
      "You're in the laminar zone. It won't last.",
    ],
    topics: {
      exam: ["Fluids exam went down the drain. So will you."],
    },
  },
  "omar-haddad": {
    opener: "Proof by contradiction: assume you win. Contradiction.",
    lines: [
      "QED. Quite Easily Defeated.",
      "Let epsilon be your chance of winning. It's small.",
      "I'll show you a real limit.",
      "Your strategy is not well-defined.",
    ],
    topics: {
      gpa: ["{gpa} is bounded above. So is your ceiling."],
      question: ["Left as an exercise to the reader."],
    },
  },
};
