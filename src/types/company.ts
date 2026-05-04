export type PostingStatus = "active" | "draft" | "paused" | "closed";
export type PipelineStage = "new" | "screening" | "interview" | "offer" | "hired" | "rejected";

export interface CompanyPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  workType: "Uzaktan" | "Hibrit" | "Ofis";
  employmentType: "Staj" | "Tam Zamanlı" | "Yarı Zamanlı";
  level: "Öğrenci" | "Yeni Mezun" | "Junior" | "Mid" | "Senior";
  status: PostingStatus;
  postedAt: string;
  deadline: string;
  applicants: number;
  views: number;
  matches: number;
  interviewed: number;
  hires: number;
  description: string;
  skills: string[];
  salaryMin?: number;
  salaryMax?: number;
}

export interface TalentCandidate {
  id: string;
  name: string;
  headline: string;
  university: string;
  program: string;
  city: string;
  experienceYears: number;
  matchScore: number;
  skills: string[];
  availability: string;
  salaryExpectation?: string;
  workType: "Uzaktan" | "Hibrit" | "Ofis";
  appliedRoleId?: string;
  stage: PipelineStage;
  avatarColor: string;
  starred: boolean;
  notes?: string;
  email: string;
  appliedAt?: string;
  lastActivity: string;
  source: "Eşleşme" | "Başvuru" | "Davet";
}

export interface CompanyInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateColor: string;
  postingTitle: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  duration: number; // minutes
  type: "İlk Görüşme" | "Teknik Mülakat" | "Vaka Çalışması" | "Final Görüşme";
  mode: "Online" | "Yüz Yüze";
  interviewers: string[];
  location?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Recruiter" | "Hiring Manager" | "Interviewer";
  department: string;
  avatarColor: string;
  status: "active" | "invited" | "inactive";
  lastActive: string;
  hires: number;
}

export interface CompanyConversation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateColor: string;
  candidateHeadline: string;
  postingTitle?: string;
  online: boolean;
  unread: number;
  lastMessage: string;
  lastTime: string;
  starred: boolean;
  stage: PipelineStage;
  messages: { id: string; from: "me" | "them"; text: string; time: string }[];
}

export interface InvoiceRow {
  id: string;
  number: string;
  date: string;
  amount: string;
  plan: string;
  status: "paid" | "pending" | "failed";
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  industry: string;
  size: string;
  founded: string;
  website: string;
  headquarters: string;
  about: string;
  perks: string[];
  techStack: string[];
  brandColor: string;
  rating: number;
  followers: number;
  hires: number;
}

export interface AnalyticsBucket {
  label: string;
  value: number;
}

export interface CompanyAnalytics {
  funnel: { stage: string; value: number; color: string }[];
  hiresOverTime: AnalyticsBucket[];
  applicantsByDepartment: AnalyticsBucket[];
  topSkills: { skill: string; demand: number }[];
  sources: { name: string; value: number; color: string }[];
}
