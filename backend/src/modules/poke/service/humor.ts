/**
 * Humor Engine — generates playful, context-aware nudge messages.
 * Tone: witty, encouraging, never toxic.
 */

const GENTLE_NUDGES = [
  "Hey {name}, your IDE misses you. It's been {days} days 🥺",
  "{name}, your streak is feeling lonely. Come back? 🫶",
  "Psst {name}… one problem a day keeps the rejection away 💡",
  "Your future FAANG interviewer just checked — still no new solves 👀",
  "{name}, even O(1) effort > O(0) effort. Solve one today!",
  "Day {days} without coding. Your GitHub graph is turning into a desert 🏜️",
  "{name}, your DSA skills called. They said 'please practice' 📞",
];

const HUMOR_NUDGES = [
  "Your DSA skills are on vacation 🏖️ Time to call them back!",
  "Even binary search is finding you… but you're not coding 🔍",
  "Streak died. Funeral at 9 PM. Bring a solved problem as flowers 💐",
  "{name}, a linked list walks into a bar… and you weren't there to reverse it 🍺",
  "404: {name}'s coding streak not found",
  "Your LeetCode profile just filed a missing person report 🚨",
  "Plot twist: the real bug was {name} not solving problems for {days} days 🐛",
  "Breaking news: {name}'s keyboard confirmed still functional. Use it! ⌨️",
  "{name}, trees aren't going to traverse themselves. Get on it! 🌳",
  "Your stack is empty and so is your solve history. Push something! 📚",
];

const FRIEND_POKES = [
  "{poker} just poked you 👉 — {days} days without a solve!",
  "{poker} says: \"Yo {name}, where are you? We're all grinding!\" 💪",
  "{poker} noticed you've been MIA for {days} days. Time to show up! 🏃",
  "{poker} challenges you: \"Solve one problem before I solve three\" ⚔️",
  "🚨 {poker} activated the shame alarm — {name} hasn't solved in {days} days",
  "{poker} says your spot on the leaderboard is getting cold 🥶",
  "{poker}: \"I solved {poker_count} this week. What's your excuse?\" 😏",
];

const GROUP_NUDGES = [
  "📢 Group alert: {name} hasn't solved a problem in {days} days!",
  "The group leaderboard misses {name}. Last seen {days} days ago 👻",
  "Everyone in {group} is grinding except {name}… just saying 👀",
  "🏟️ {group} roll call! {name}, where you at?",
];

const STREAK_RISK_ALERTS = [
  "⚠️ Your {streak}-day streak will break in {hours} hours! Solve one quick problem!",
  "🔥 {streak}-day streak at risk! You have {hours} hours left. Don't let it die!",
  "Your streak ({streak} days) is hanging by a thread. {hours}h left ⏰",
  "Emergency: {streak}-day streak, {hours} hours to go. Even an easy one counts! 🆘",
];

const RECOVERY_MESSAGES = [
  "Your streak broke 💔 But here's a comeback challenge: solve {target} problems today!",
  "Streak reset to 0. Challenge unlocked: solve {target} to prove you're back 🔥",
  "The streak died, but legends bounce back. Solve {target} problems by midnight! ⚡",
];

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fill(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }
  return result;
}

export const humorEngine = {
  /** Escalation level 1: Gentle reminder */
  gentle(name: string, daysMissed: number): string {
    return fill(pick(GENTLE_NUDGES), { name, days: daysMissed });
  },

  /** Escalation level 2: Humorous nudge */
  humor(name: string, daysMissed: number): string {
    return fill(pick(HUMOR_NUDGES), { name, days: daysMissed });
  },

  /** Escalation level 3: Friend poke */
  friendPoke(name: string, pokerName: string, daysMissed: number, pokerSolveCount?: number): string {
    return fill(pick(FRIEND_POKES), {
      name,
      poker: pokerName,
      days: daysMissed,
      poker_count: pokerSolveCount || 0,
    });
  },

  /** Escalation level 4: Group notification */
  groupNudge(name: string, groupName: string, daysMissed: number): string {
    return fill(pick(GROUP_NUDGES), { name, group: groupName, days: daysMissed });
  },

  /** Streak at risk alert */
  streakRisk(streakDays: number, hoursLeft: number): string {
    return fill(pick(STREAK_RISK_ALERTS), { streak: streakDays, hours: hoursLeft });
  },

  /** Recovery challenge after streak break */
  recovery(targetCount: number): string {
    return fill(pick(RECOVERY_MESSAGES), { target: targetCount });
  },

  /** Get message for a given escalation level */
  forLevel(level: number, vars: { name: string; daysMissed: number; pokerName?: string; groupName?: string; pokerSolveCount?: number }): string {
    switch (level) {
      case 1: return this.gentle(vars.name, vars.daysMissed);
      case 2: return this.humor(vars.name, vars.daysMissed);
      case 3: return vars.pokerName ? this.friendPoke(vars.name, vars.pokerName, vars.daysMissed, vars.pokerSolveCount) : this.humor(vars.name, vars.daysMissed);
      case 4: return vars.groupName ? this.groupNudge(vars.name, vars.groupName, vars.daysMissed) : this.humor(vars.name, vars.daysMissed);
      default: return this.gentle(vars.name, vars.daysMissed);
    }
  },
};
