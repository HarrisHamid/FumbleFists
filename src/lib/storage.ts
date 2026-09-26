export type Profile = {
  name: string;
  major: string;
  year: string;
  gpa: string;
  failed: string;
  bio: string;
};

export type MatchRecord = {
  name: string;
  major: string;
  gpa: string;
  record: string;
  failed: string;
  when: string;
};

const PROFILE_KEY = "fumblefists-profile";
const MATCHES_KEY = "fumblefists-matches";

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function loadMatches(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(MATCHES_KEY);
    return raw ? (JSON.parse(raw) as MatchRecord[]) : [];
  } catch {
    return [];
  }
}

export function addMatch(m: MatchRecord) {
  const all = loadMatches();
  all.unshift(m);
  localStorage.setItem(MATCHES_KEY, JSON.stringify(all.slice(0, 50)));
}

export function clearMatches() {
  localStorage.removeItem(MATCHES_KEY);
}
