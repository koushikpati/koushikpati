export type Metric = { value: string; label: string };

export type Contact = {
  email?: string;
  github?: string;
  linkedin?: string;
  mobile?: string;
};

export type SkillGroups = Record<string, string[]>;

export type Preferences = {
  workEnvironment?: string;
  "prefered role"?: string;
  "prefered location"?: string;
  workType?: string;
  noticePeriod?: string;
};

export type Resume = {
  name?: string;
  title?: string;
  tagline?: string;
  summary?: string;
  contact?: Contact;
  metrics?: Metric[];
  skills?: string[];
  skill?: SkillGroups;
  Preferences?: Preferences;
  experience?: unknown[]; // still a placeholder, see below
};

export type Project = {
  id: number;
  name: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  category?: string;
};