export type UserRole = "student" | "company" | "mentor";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organization?: string;
  avatarColor?: string;
}

export type WorkType = "Uzaktan" | "Hibrit" | "Ofis";
export type EmploymentType = "Staj" | "Tam Zamanlı" | "Yarı Zamanlı";

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyShort: string;
  logoColor: string;
  location: string;
  workType: WorkType;
  employmentType: EmploymentType;
  industry: string;
  companySize: "Startup" | "Orta Ölçek" | "Büyük Kurumsal";
  experienceLevel: "Öğrenci" | "Yeni Mezun" | "Junior";
  skills: string[];
  niceToHave?: string[];
  matchScore: number;
  stipend?: string;
  duration?: string;
  deadline?: string;
  postedAt: string;
  description: string;
  responsibilities: string[];
  learnings: string[];
  about: string;
  matchReasons: string[];
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "reviewed"
  | "interview"
  | "offer"
  | "rejected";

export interface Application {
  id: string;
  internshipId: string;
  status: ApplicationStatus;
  appliedAt: string;
  nextAction?: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  avatarColor: string;
  rating: number;
  sessions: number;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  openings: number;
  rating: number;
  logoColor: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: "Recruiter" | "Mentor" | "Öğrenci";
  company?: string;
  avatarColor: string;
  online: boolean;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  type: "skill" | "course" | "project" | "milestone";
  meta?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "match" | "interview" | "message" | "system";
}

export interface Candidate {
  id: string;
  name: string;
  university: string;
  program: string;
  skills: string[];
  matchScore: number;
  availability: string;
  avatarColor: string;
  appliedRole: string;
  status: ApplicationStatus;
}
