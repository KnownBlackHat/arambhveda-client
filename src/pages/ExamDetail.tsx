import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  Users,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Clock,
  Award,
  GraduationCap,
  HelpCircle,
} from "lucide-react";

interface ExamData {
  name: string;
  fullName: string;
  category: string;
  conductedBy: string;
  overview: string;
  eligibility: string[];
  importantDates: { event: string; date: string }[];
  syllabus: string[];
  examPattern: { parameter: string; detail: string }[];
  applicationProcess: string[];
  counselling: string[];
  cutoffTrends: { year: string; general: string; obc: string; sc: string }[];
  faqs: { q: string; a: string }[];
  relatedColleges: string[];
  relatedCourses: string[];
}

const examsData: Record<string, ExamData> = {
  "jee-main": {
    name: "JEE Main 2026",
    fullName: "Joint Entrance Examination Main",
    category: "Engineering",
    conductedBy: "National Testing Agency (NTA)",
    overview: "JEE Main is the national-level entrance exam for admission to NITs, IIITs, and other centrally funded technical institutions across India. It also serves as the qualifying exam for JEE Advanced.",
    eligibility: [
      "Passed or appearing in Class 12 with Physics, Chemistry, and Mathematics",
      "No age limit as per recent NTA guidelines",
      "Maximum 3 consecutive attempts allowed",
      "Minimum 75% in Class 12 (65% for reserved categories) or top 20 percentile",
    ],
    importantDates: [
      { event: "Registration Start", date: "November 2025" },
      { event: "Registration Deadline", date: "December 2025" },
      { event: "Admit Card Release", date: "January 2026" },
      { event: "Session 1 Exam", date: "January 22–31, 2026" },
      { event: "Session 1 Results", date: "February 2026" },
      { event: "Session 2 Exam", date: "April 2026" },
      { event: "Final Results", date: "May 2026" },
    ],
    syllabus: ["Physics: Mechanics, Thermodynamics, Electrodynamics, Optics, Modern Physics", "Chemistry: Physical Chemistry, Organic Chemistry, Inorganic Chemistry", "Mathematics: Algebra, Calculus, Coordinate Geometry, Trigonometry, Statistics"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test (CBT)" },
      { parameter: "Duration", detail: "3 hours" },
      { parameter: "Total Questions", detail: "90 (75 to attempt)" },
      { parameter: "Total Marks", detail: "300" },
      { parameter: "Subjects", detail: "Physics, Chemistry, Mathematics" },
      { parameter: "Marking", detail: "+4 for correct, -1 for incorrect" },
    ],
    applicationProcess: [
      "Visit the official NTA JEE Main website",
      "Register with valid email and mobile number",
      "Fill the application form with personal, academic, and exam details",
      "Upload photograph, signature, and category certificate (if applicable)",
      "Pay the application fee online",
      "Download confirmation page for future reference",
    ],
    counselling: [
      "JoSAA Counselling for NITs, IIITs, and GFTIs",
      "Based on JEE Main All India Rank (AIR)",
      "Multiple rounds of seat allotment",
      "Document verification at reporting center",
      "Fee payment and seat confirmation",
    ],
    cutoffTrends: [
      { year: "2025", general: "93.2", obc: "78.1", sc: "52.4" },
      { year: "2024", general: "90.7", obc: "75.6", sc: "50.1" },
      { year: "2023", general: "91.1", obc: "76.3", sc: "48.7" },
    ],
    faqs: [
      { q: "How many times can I attempt JEE Main?", a: "You can attempt JEE Main for 3 consecutive years from the year of passing Class 12." },
      { q: "Is there negative marking in JEE Main?", a: "Yes, 1 mark is deducted for each wrong answer in MCQ type questions. No negative marking for numerical type." },
      { q: "Can I write JEE Main in my regional language?", a: "Yes, JEE Main is available in 13 languages including Hindi, English, and regional languages." },
      { q: "What is the difference between JEE Main and JEE Advanced?", a: "JEE Main is for admission to NITs and IIITs. JEE Advanced (for top 2.5 lakh JEE Main qualifiers) is for admission to IITs." },
    ],
    relatedColleges: ["NIT Trichy", "NIT Warangal", "IIIT Hyderabad", "NIT Surathkal"],
    relatedCourses: ["B.Tech Computer Science", "B.Tech Electronics", "B.Tech Mechanical"],
  },
  "jee-advanced": {
    name: "JEE Advanced 2026",
    fullName: "Joint Entrance Examination Advanced",
    category: "Engineering",
    conductedBy: "One of the IITs (rotational basis)",
    overview: "JEE Advanced is the gateway to the Indian Institutes of Technology (IITs). Only the top 2,50,000 JEE Main qualifiers are eligible to appear for this exam.",
    eligibility: [
      "Must qualify JEE Main and be in the top 2,50,000 candidates",
      "Age limit: Should have been born on or after October 1, 2001 (5 years relaxation for SC/ST/PwD)",
      "Maximum 2 consecutive attempts",
      "Should not have accepted admission at any IIT before",
    ],
    importantDates: [
      { event: "Registration Start", date: "April 2026" },
      { event: "Registration Deadline", date: "May 2026" },
      { event: "Admit Card", date: "May 2026" },
      { event: "Exam Date", date: "May 25, 2026" },
      { event: "Results", date: "June 2026" },
    ],
    syllabus: ["Physics: All topics from JEE Main + advanced level problems", "Chemistry: Physical, Organic and Inorganic Chemistry at advanced level", "Mathematics: Advanced Calculus, Algebra, Geometry, and Combinatorics"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test (CBT)" },
      { parameter: "Duration", detail: "3 hours per paper (2 papers)" },
      { parameter: "Papers", detail: "Paper 1 & Paper 2 (both compulsory)" },
      { parameter: "Subjects", detail: "Physics, Chemistry, Mathematics" },
      { parameter: "Question Types", detail: "MCQ, Numerical, Matching" },
      { parameter: "Marking", detail: "Varies by question type; partial marking available" },
    ],
    applicationProcess: [
      "Qualify JEE Main with rank within top 2,50,000",
      "Register on the JEE Advanced portal",
      "Fill application form and upload documents",
      "Pay registration fee",
      "Download admit card",
    ],
    counselling: [
      "JoSAA Counselling (joint with JEE Main)",
      "Choice filling for IITs, NITs, IIITs",
      "Seat allotment based on category rank",
      "Reporting to allotted institute",
    ],
    cutoffTrends: [
      { year: "2025", general: "52", obc: "45", sc: "25" },
      { year: "2024", general: "50", obc: "43", sc: "23" },
      { year: "2023", general: "48", obc: "41", sc: "22" },
    ],
    faqs: [
      { q: "Who conducts JEE Advanced?", a: "JEE Advanced is conducted by one of the IITs on a rotational basis every year." },
      { q: "Is JEE Advanced tougher than JEE Main?", a: "Yes, JEE Advanced is significantly more challenging and tests deeper conceptual understanding." },
      { q: "How many IITs accept JEE Advanced scores?", a: "All 23 IITs in India accept JEE Advanced scores for BTech admissions." },
    ],
    relatedColleges: ["IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur"],
    relatedCourses: ["B.Tech CS at IIT", "B.Tech EE at IIT", "Dual Degree Programs"],
  },
  "neet": {
    name: "NEET UG 2026",
    fullName: "National Eligibility cum Entrance Test",
    category: "Medical",
    conductedBy: "National Testing Agency (NTA)",
    overview: "NEET UG is the single national-level entrance exam for admission to MBBS, BDS, AYUSH, BSc Nursing, and veterinary courses across all medical colleges in India.",
    eligibility: [
      "Passed or appearing in Class 12 with Physics, Chemistry, Biology/Biotechnology",
      "Minimum 50% marks in PCB (40% for reserved categories)",
      "Minimum age: 17 years at the time of admission",
      "No upper age limit (as per Supreme Court ruling)",
    ],
    importantDates: [
      { event: "Registration", date: "February 2026" },
      { event: "Last Date to Apply", date: "March 2026" },
      { event: "Admit Card", date: "April 2026" },
      { event: "Exam Date", date: "May 4, 2026" },
      { event: "Results", date: "June 2026" },
      { event: "Counselling Starts", date: "July 2026" },
    ],
    syllabus: ["Physics: Mechanics, Thermodynamics, Optics, Electrostatics, Modern Physics", "Chemistry: Physical, Organic, Inorganic Chemistry (Class 11 & 12 NCERT)", "Biology: Botany & Zoology – Genetics, Ecology, Human Physiology, Cell Biology"],
    examPattern: [
      { parameter: "Mode", detail: "Pen & Paper (Offline OMR)" },
      { parameter: "Duration", detail: "3 hours 20 minutes" },
      { parameter: "Total Questions", detail: "200 (180 to attempt)" },
      { parameter: "Total Marks", detail: "720" },
      { parameter: "Subjects", detail: "Physics, Chemistry, Biology (Botany + Zoology)" },
      { parameter: "Marking", detail: "+4 for correct, -1 for incorrect" },
    ],
    applicationProcess: [
      "Register on NTA NEET official website",
      "Fill personal, academic, and qualification details",
      "Upload photo, signature, and documents",
      "Select exam city preferences",
      "Pay application fee",
      "Download confirmation page",
    ],
    counselling: [
      "MCC (Medical Counselling Committee) for All India Quota seats",
      "State-level counselling for state quota seats",
      "Multiple rounds of seat allotment",
      "Choice filling and locking",
      "Document verification and admission",
    ],
    cutoffTrends: [
      { year: "2025", general: "720-137", obc: "136-107", sc: "136-107" },
      { year: "2024", general: "720-137", obc: "136-107", sc: "136-107" },
      { year: "2023", general: "720-137", obc: "136-107", sc: "136-107" },
    ],
    faqs: [
      { q: "Is NEET the only exam for MBBS admission in India?", a: "Yes, NEET UG is the single entrance test for all medical, dental, and AYUSH courses in India (except AIIMS & JIPMER which are now merged into NEET)." },
      { q: "How many attempts are allowed for NEET?", a: "There is no limit on the number of attempts for NEET as per current guidelines." },
      { q: "Is NEET conducted online or offline?", a: "NEET is conducted in offline (pen and paper) mode using OMR sheets." },
    ],
    relatedColleges: ["AIIMS Delhi", "CMC Vellore", "MAHE Manipal", "JIPMER"],
    relatedCourses: ["MBBS", "BDS", "BSc Nursing", "BAMS", "BHMS"],
  },
  "cat": {
    name: "CAT 2026",
    fullName: "Common Admission Test",
    category: "Management",
    conductedBy: "IIMs (rotational basis)",
    overview: "CAT is the premier management entrance exam in India conducted by the IIMs for admission to MBA/PGDM programs at IIMs and over 1,200 other B-schools across India.",
    eligibility: [
      "Bachelor's degree with minimum 50% marks (45% for reserved categories)",
      "Final year graduates can also apply",
      "No age limit",
      "No limit on number of attempts",
    ],
    importantDates: [
      { event: "Registration Start", date: "August 2026" },
      { event: "Registration End", date: "September 2026" },
      { event: "Admit Card", date: "October 2026" },
      { event: "Exam Date", date: "November 24, 2026" },
      { event: "Results", date: "January 2027" },
    ],
    syllabus: ["Verbal Ability & Reading Comprehension (VARC)", "Data Interpretation & Logical Reasoning (DILR)", "Quantitative Ability (QA)"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test (CBT)" },
      { parameter: "Duration", detail: "2 hours" },
      { parameter: "Total Questions", detail: "66" },
      { parameter: "Sections", detail: "3 (VARC, DILR, QA)" },
      { parameter: "Marking", detail: "+3 correct, -1 incorrect (MCQ)" },
      { parameter: "Sectional Time Limit", detail: "40 minutes per section" },
    ],
    applicationProcess: [
      "Register on the official CAT website",
      "Fill application form with academic details",
      "Select test city preferences (up to 6)",
      "Upload photo and signature",
      "Pay application fee",
      "Download confirmation",
    ],
    counselling: [
      "Each IIM has its own selection process",
      "Shortlisting based on CAT score + profile",
      "Written Ability Test (WAT) and Personal Interview (PI)",
      "Final selection based on composite score",
    ],
    cutoffTrends: [
      { year: "2025", general: "99+", obc: "95+", sc: "85+" },
      { year: "2024", general: "99+", obc: "95+", sc: "85+" },
      { year: "2023", general: "98+", obc: "94+", sc: "84+" },
    ],
    faqs: [
      { q: "What is a good CAT score?", a: "A percentile of 99+ is considered excellent. For top IIMs, you typically need 99+ percentile." },
      { q: "Can working professionals take CAT?", a: "Yes, there is no restriction. Many working professionals take CAT each year." },
      { q: "How many IIMs are there in India?", a: "There are 21 IIMs across India as of 2026." },
    ],
    relatedColleges: ["IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "ISB Hyderabad", "XLRI"],
    relatedCourses: ["MBA", "PGDM", "Executive MBA"],
  },
  "gate": {
    name: "GATE 2026",
    fullName: "Graduate Aptitude Test in Engineering",
    category: "Engineering/PG",
    conductedBy: "IITs and IISc (rotational basis)",
    overview: "GATE is a national-level exam for admission to M.Tech/ME/PhD programs in IITs, NITs, and IISc. It is also used by PSUs for recruitment.",
    eligibility: [
      "Bachelor's degree in Engineering/Technology/Architecture or Master's in Science",
      "Final year students can apply",
      "No age limit",
      "No limit on number of attempts",
    ],
    importantDates: [
      { event: "Registration Start", date: "August 2025" },
      { event: "Registration End", date: "October 2025" },
      { event: "Admit Card", date: "January 2026" },
      { event: "Exam Dates", date: "February 1–16, 2026" },
      { event: "Results", date: "March 2026" },
    ],
    syllabus: ["Engineering Mathematics", "General Aptitude", "Subject-specific syllabus (29 papers available)", "Core engineering subjects based on chosen paper"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test (CBT)" },
      { parameter: "Duration", detail: "3 hours" },
      { parameter: "Total Questions", detail: "65" },
      { parameter: "Total Marks", detail: "100" },
      { parameter: "Question Types", detail: "MCQ + MSQ + NAT" },
      { parameter: "Sections", detail: "General Aptitude (15 marks) + Subject (85 marks)" },
    ],
    applicationProcess: [
      "Register on GOAPS (GATE Online Application Processing System)",
      "Fill application form with academic details",
      "Select exam paper and center preferences",
      "Upload documents",
      "Pay application fee",
    ],
    counselling: [
      "CCMT (Centralized Counselling for M.Tech) for NITs and IIITs",
      "COAP for IITs",
      "Individual institute counselling",
      "PSU recruitment based on GATE score",
    ],
    cutoffTrends: [
      { year: "2025", general: "29.5", obc: "26.5", sc: "19.7" },
      { year: "2024", general: "28.1", obc: "25.3", sc: "18.7" },
      { year: "2023", general: "27.5", obc: "24.7", sc: "18.3" },
    ],
    faqs: [
      { q: "Is GATE score valid for PSU jobs?", a: "Yes, many PSUs like IOCL, BHEL, NTPC recruit based on GATE scores." },
      { q: "How long is GATE score valid?", a: "GATE score is valid for 3 years from the date of announcement of results." },
      { q: "Can non-engineers take GATE?", a: "Yes, GATE offers papers in Science subjects like Physics, Chemistry, Mathematics, and others." },
    ],
    relatedColleges: ["IISc Bangalore", "IIT Bombay", "IIT Delhi", "IIT Madras", "NIT Trichy"],
    relatedCourses: ["M.Tech", "ME", "PhD", "MS by Research"],
  },
  "clat": {
    name: "CLAT 2026",
    fullName: "Common Law Admission Test",
    category: "Law",
    conductedBy: "Consortium of National Law Universities",
    overview: "CLAT is the centralized national-level entrance test for admission to 24 National Law Universities (NLUs) across India for undergraduate (LLB) and postgraduate (LLM) law programs.",
    eligibility: [
      "Passed or appearing in Class 12 from a recognized board",
      "No minimum percentage for general category (from 2024 onwards)",
      "No upper age limit",
      "For LLM: LLB or equivalent degree",
    ],
    importantDates: [
      { event: "Registration Start", date: "July 2026" },
      { event: "Registration End", date: "October 2026" },
      { event: "Admit Card", date: "November 2026" },
      { event: "Exam Date", date: "December 2026" },
      { event: "Results", date: "December 2026" },
    ],
    syllabus: ["English Language", "Current Affairs & General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
    examPattern: [
      { parameter: "Mode", detail: "Pen & Paper (Offline)" },
      { parameter: "Duration", detail: "2 hours" },
      { parameter: "Total Questions", detail: "150" },
      { parameter: "Total Marks", detail: "150" },
      { parameter: "Sections", detail: "5 sections" },
      { parameter: "Marking", detail: "+1 for correct, -0.25 for incorrect" },
    ],
    applicationProcess: [
      "Register on the official CLAT website (consortiumofnlus.ac.in)",
      "Fill the application form with personal and academic details",
      "Select NLU preferences",
      "Upload required documents",
      "Pay application fee",
    ],
    counselling: [
      "Centralized counselling by the Consortium of NLUs",
      "Choice filling and locking of NLU preferences",
      "Seat allotment based on CLAT rank and preferences",
      "Multiple rounds of allotment",
      "Reporting to allotted NLU for admission",
    ],
    cutoffTrends: [
      { year: "2025", general: "110+", obc: "95+", sc: "75+" },
      { year: "2024", general: "108+", obc: "93+", sc: "73+" },
      { year: "2023", general: "105+", obc: "90+", sc: "70+" },
    ],
    faqs: [
      { q: "Is CLAT for 3-year or 5-year LLB?", a: "CLAT UG is primarily for the 5-year integrated BA LLB / BBA LLB / BSc LLB programs at NLUs." },
      { q: "How many NLUs accept CLAT scores?", a: "24 National Law Universities accept CLAT scores for admission." },
      { q: "Is there a sectional cutoff in CLAT?", a: "No, there is no sectional cutoff. The overall score is considered." },
    ],
    relatedColleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "NUJS Kolkata"],
    relatedCourses: ["BA LLB", "BBA LLB", "LLM"],
  },
  "cuet": {
    name: "CUET UG 2026",
    fullName: "Common University Entrance Test",
    category: "Undergraduate",
    conductedBy: "National Testing Agency (NTA)",
    overview: "CUET is the national-level entrance exam for admission to undergraduate programs in all Central Universities and many other participating universities across India.",
    eligibility: [
      "Passed or appearing in Class 12 from a recognized board",
      "Eligibility criteria varies by university and program",
      "No age limit",
    ],
    importantDates: [
      { event: "Registration Start", date: "February 2026" },
      { event: "Registration End", date: "March 2026" },
      { event: "Exam Dates", date: "May 2026" },
      { event: "Results", date: "June 2026" },
    ],
    syllabus: ["Section IA & IB: Languages (13 + 20 options)", "Section II: Domain-specific subjects (27 options)", "Section III: General Test"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test (CBT)" },
      { parameter: "Duration", detail: "Varies by sections chosen" },
      { parameter: "Question Type", detail: "MCQ" },
      { parameter: "Marking", detail: "+5 for correct, -1 for incorrect" },
      { parameter: "Sections", detail: "Up to 6 sections can be chosen" },
    ],
    applicationProcess: [
      "Register on NTA CUET portal",
      "Select universities and programs",
      "Choose test subjects and languages",
      "Upload documents and photo",
      "Pay fee and download confirmation",
    ],
    counselling: [
      "Each university conducts its own counselling",
      "CSAS (Common Seat Allocation System) for Delhi University",
      "Merit-based allocation using CUET scores",
    ],
    cutoffTrends: [
      { year: "2025", general: "Varies by university", obc: "–", sc: "–" },
    ],
    faqs: [
      { q: "Is CUET mandatory for all central universities?", a: "Yes, CUET scores are mandatory for admission to most UG programs at central universities." },
      { q: "How many subjects can I choose in CUET?", a: "You can choose up to 6 domain subjects along with language and general test sections." },
    ],
    relatedColleges: ["Delhi University", "JNU", "BHU", "AMU"],
    relatedCourses: ["BA", "BSc", "BCom", "BBA"],
  },
  "xat": {
    name: "XAT 2026",
    fullName: "Xavier Aptitude Test",
    category: "Management",
    conductedBy: "XLRI Jamshedpur",
    overview: "XAT is one of the top MBA entrance exams in India, conducted by XLRI Jamshedpur. It is accepted by over 160 B-schools for admission to MBA/PGDM programs.",
    eligibility: [
      "Bachelor's degree from a recognized university",
      "Final year students can apply",
      "No age limit or attempt restrictions",
    ],
    importantDates: [
      { event: "Registration Start", date: "July 2026" },
      { event: "Registration End", date: "November 2026" },
      { event: "Exam Date", date: "January 2027" },
      { event: "Results", date: "February 2027" },
    ],
    syllabus: ["Verbal & Logical Ability", "Decision Making", "Quantitative Ability & Data Interpretation", "General Knowledge"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test" },
      { parameter: "Duration", detail: "3 hours" },
      { parameter: "Sections", detail: "4 (including GK)" },
      { parameter: "Marking", detail: "+1 correct, -0.25 incorrect; +0.10 penalty for unanswered (after 8)" },
    ],
    applicationProcess: ["Register on XAT website", "Fill application form", "Select XLRI programs if interested", "Pay fee and confirm"],
    counselling: ["XLRI conducts its own selection process", "WAT + GD + PI rounds", "Other XAT-accepting colleges have separate processes"],
    cutoffTrends: [
      { year: "2025", general: "95+", obc: "–", sc: "–" },
    ],
    faqs: [
      { q: "Is XAT only for XLRI?", a: "No, over 160 B-schools accept XAT scores." },
    ],
    relatedColleges: ["XLRI Jamshedpur", "IMT Ghaziabad", "XIMB"],
    relatedCourses: ["MBA HRM", "MBA BM", "PGDM"],
  },
  "snap": {
    name: "SNAP 2026",
    fullName: "Symbiosis National Aptitude Test",
    category: "Management",
    conductedBy: "Symbiosis International University",
    overview: "SNAP is the entrance exam for MBA programs at Symbiosis institutes across India including SIBM Pune, SCMHRD, and SIIB.",
    eligibility: ["Graduation with minimum 50% marks", "Final year students can apply"],
    importantDates: [
      { event: "Registration", date: "August–November 2026" },
      { event: "Exam Dates", date: "December 2026 (3 attempts)" },
      { event: "Results", date: "January 2027" },
    ],
    syllabus: ["General English", "Analytical & Logical Reasoning", "Quantitative, Data Interpretation & Data Sufficiency"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test" },
      { parameter: "Duration", detail: "1 hour" },
      { parameter: "Total Questions", detail: "60" },
      { parameter: "Marking", detail: "+1 correct, -0.25 incorrect" },
    ],
    applicationProcess: ["Register on SNAP website", "Fill form and select Symbiosis institutes", "Pay fee"],
    counselling: ["GE-PI-WAT at respective Symbiosis institutes", "Merit list based on composite score"],
    cutoffTrends: [{ year: "2025", general: "95+", obc: "–", sc: "–" }],
    faqs: [{ q: "How many attempts for SNAP?", a: "You can take SNAP up to 3 times in a season and the best score is considered." }],
    relatedColleges: ["SIBM Pune", "SCMHRD", "SIIB"],
    relatedCourses: ["MBA", "PGDM"],
  },
  "bitsat": {
    name: "BITSAT 2026",
    fullName: "BITS Admission Test",
    category: "Engineering",
    conductedBy: "BITS Pilani",
    overview: "BITSAT is the entrance exam for all integrated first degree programs at BITS campuses in Pilani, Goa, and Hyderabad.",
    eligibility: ["Passed Class 12 with Physics, Chemistry, and Mathematics", "Minimum 75% aggregate in PCM", "Minimum 60% in each subject"],
    importantDates: [
      { event: "Registration", date: "January–April 2026" },
      { event: "Exam Dates", date: "May–June 2026" },
      { event: "Results & Admission", date: "June–July 2026" },
    ],
    syllabus: ["Physics", "Chemistry", "Mathematics / Biology", "English Proficiency", "Logical Reasoning"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test" },
      { parameter: "Duration", detail: "3 hours" },
      { parameter: "Total Questions", detail: "130" },
      { parameter: "Total Marks", detail: "390" },
      { parameter: "Marking", detail: "+3 correct, -1 incorrect" },
      { parameter: "Bonus", detail: "12 extra questions if all 130 attempted in time" },
    ],
    applicationProcess: ["Register on BITS Admission website", "Fill application form", "Select exam slot and center", "Pay fee"],
    counselling: ["Direct admission based on BITSAT score", "Iteration-based seat allotment", "Multiple rounds"],
    cutoffTrends: [{ year: "2025", general: "290+", obc: "–", sc: "–" }],
    faqs: [{ q: "Is BITSAT adaptive?", a: "No, but if you finish all 130 questions early, you get 12 bonus questions." }],
    relatedColleges: ["BITS Pilani", "BITS Goa", "BITS Hyderabad"],
    relatedCourses: ["B.Tech", "B.Pharm", "MSc"],
  },
  "viteee": {
    name: "VITEEE 2026",
    fullName: "VIT Engineering Entrance Examination",
    category: "Engineering",
    conductedBy: "VIT University",
    overview: "VITEEE is conducted by VIT University for admission to B.Tech programs across its campuses in Vellore, Chennai, Bhopal, and AP.",
    eligibility: ["Passed Class 12 with minimum 60% in PCM/PCB", "Born on or after July 1, 2004"],
    importantDates: [
      { event: "Registration", date: "November 2025 – March 2026" },
      { event: "Exam Dates", date: "April 2026" },
      { event: "Results", date: "May 2026" },
    ],
    syllabus: ["Mathematics / Biology", "Physics", "Chemistry", "English", "Aptitude"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test" },
      { parameter: "Duration", detail: "2 hours 30 minutes" },
      { parameter: "Total Questions", detail: "125" },
      { parameter: "Marking", detail: "+1 correct, no negative marking" },
    ],
    applicationProcess: ["Register on VIT website", "Fill form", "Select exam slot", "Pay fee"],
    counselling: ["VIT conducts its own counselling", "Based on VITEEE rank", "Online choice filling"],
    cutoffTrends: [{ year: "2025", general: "Rank-based", obc: "–", sc: "–" }],
    faqs: [{ q: "Is there negative marking in VITEEE?", a: "No, there is no negative marking in VITEEE." }],
    relatedColleges: ["VIT Vellore", "VIT Chennai", "VIT Bhopal"],
    relatedCourses: ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical"],
  },
  "nift": {
    name: "NIFT Entrance 2026",
    fullName: "National Institute of Fashion Technology Entrance Exam",
    category: "Design",
    conductedBy: "NIFT",
    overview: "NIFT Entrance Exam is for admission to Bachelor and Master design programs at all NIFT campuses across India.",
    eligibility: ["Class 12 pass for BDes", "Graduation for MDes", "No age limit"],
    importantDates: [
      { event: "Registration", date: "October–December 2025" },
      { event: "Exam Date", date: "January–February 2026" },
      { event: "Results", date: "March 2026" },
    ],
    syllabus: ["Creative Ability Test (CAT)", "General Ability Test (GAT)", "Situation Test (for BDes shortlisted)"],
    examPattern: [
      { parameter: "Parts", detail: "CAT (Drawing) + GAT (MCQ)" },
      { parameter: "GAT Duration", detail: "2 hours" },
      { parameter: "CAT Duration", detail: "3 hours" },
    ],
    applicationProcess: ["Register on NIFT website", "Fill form", "Upload documents", "Pay fee"],
    counselling: ["NIFT conducts centralized counselling", "Based on combined CAT + GAT + Situation Test score"],
    cutoffTrends: [{ year: "2025", general: "Varies by campus", obc: "–", sc: "–" }],
    faqs: [{ q: "What is the Situation Test?", a: "It's a hands-on test where shortlisted candidates create a 3D model from given materials." }],
    relatedColleges: ["NIFT Delhi", "NIFT Mumbai", "NIFT Bangalore"],
    relatedCourses: ["BDes", "MDes", "MFM"],
  },
  "nid-dat": {
    name: "NID DAT 2026",
    fullName: "National Institute of Design - Design Aptitude Test",
    category: "Design",
    conductedBy: "NID Ahmedabad",
    overview: "NID DAT is the entrance exam for admission to BDes and MDes programs at all NID campuses in India.",
    eligibility: ["Class 12 pass for BDes", "Graduation for MDes"],
    importantDates: [
      { event: "Registration", date: "October–December 2025" },
      { event: "Prelims", date: "January 2026" },
      { event: "Mains (Studio Test)", date: "April 2026" },
    ],
    syllabus: ["Design Aptitude", "Drawing & Visualization", "Observation & Analytical Skills", "Creative Writing"],
    examPattern: [
      { parameter: "Stage 1", detail: "Prelims (Pen & Paper / CBT)" },
      { parameter: "Stage 2", detail: "Mains – Studio Test + Interview" },
      { parameter: "Duration", detail: "3 hours (Prelims)" },
    ],
    applicationProcess: ["Register on NID Admissions portal", "Fill form and pay fee", "Appear for Prelims", "Shortlisted candidates appear for Mains"],
    counselling: ["Merit list based on combined Prelims + Mains score", "Direct admission offer"],
    cutoffTrends: [{ year: "2025", general: "Varies", obc: "–", sc: "–" }],
    faqs: [{ q: "Is NID DAT for all NID campuses?", a: "Yes, NID DAT score is valid for all NID campuses across India." }],
    relatedColleges: ["NID Ahmedabad", "NID Bangalore", "NID Haryana"],
    relatedCourses: ["BDes", "MDes"],
  },
  "cmat": {
    name: "CMAT 2026",
    fullName: "Common Management Admission Test",
    category: "Management",
    conductedBy: "NTA",
    overview: "CMAT is a national-level MBA entrance exam accepted by AICTE-approved B-schools across India.",
    eligibility: ["Graduation with minimum 50% marks", "Final year students eligible"],
    importantDates: [
      { event: "Registration", date: "January 2026" },
      { event: "Exam Date", date: "March 2026" },
      { event: "Results", date: "April 2026" },
    ],
    syllabus: ["Quantitative Techniques & Data Interpretation", "Logical Reasoning", "Language Comprehension", "General Awareness", "Innovation & Entrepreneurship"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Based Test" },
      { parameter: "Duration", detail: "3 hours" },
      { parameter: "Total Questions", detail: "100" },
      { parameter: "Total Marks", detail: "400" },
      { parameter: "Marking", detail: "+4 correct, -1 incorrect" },
    ],
    applicationProcess: ["Register on NTA CMAT portal", "Fill form", "Pay fee", "Download admit card"],
    counselling: ["Individual B-schools conduct their own counselling", "Based on CMAT score + GD/PI"],
    cutoffTrends: [{ year: "2025", general: "300+", obc: "–", sc: "–" }],
    faqs: [{ q: "Which colleges accept CMAT?", a: "Over 1,000 AICTE-approved B-schools accept CMAT scores." }],
    relatedColleges: ["JBIMS Mumbai", "SIMSREE Mumbai", "GIM Goa"],
    relatedCourses: ["MBA", "PGDM"],
  },
  "mat": {
    name: "MAT 2026",
    fullName: "Management Aptitude Test",
    category: "Management",
    conductedBy: "AIMA",
    overview: "MAT is one of the most popular MBA entrance exams in India, conducted 4 times a year by AIMA, accepted by over 600 B-schools.",
    eligibility: ["Graduation from a recognized university", "Final year students eligible"],
    importantDates: [
      { event: "Conducted", date: "February, May, September, December 2026" },
    ],
    syllabus: ["Language Comprehension", "Mathematical Skills", "Data Analysis & Sufficiency", "Intelligence & Critical Reasoning", "Indian & Global Environment"],
    examPattern: [
      { parameter: "Mode", detail: "PBT / CBT / IBT" },
      { parameter: "Duration", detail: "2 hours 30 minutes" },
      { parameter: "Total Questions", detail: "200" },
      { parameter: "Total Marks", detail: "200" },
      { parameter: "Marking", detail: "+1 correct, -0.25 incorrect" },
    ],
    applicationProcess: ["Register on AIMA MAT website", "Select test mode and date", "Pay fee"],
    counselling: ["Individual colleges conduct their own counselling"],
    cutoffTrends: [{ year: "2025", general: "700+ (composite score)", obc: "–", sc: "–" }],
    faqs: [{ q: "How many times a year is MAT conducted?", a: "MAT is conducted 4 times a year – February, May, September, and December." }],
    relatedColleges: ["Christ University", "Amity University"],
    relatedCourses: ["MBA", "PGDM"],
  },
  "gmat": {
    name: "GMAT 2026",
    fullName: "Graduate Management Admission Test",
    category: "Management (Global)",
    conductedBy: "GMAC",
    overview: "GMAT is a globally recognized test for admission to MBA and business programs worldwide, including top Indian B-schools like ISB and IIMs (for executive programs).",
    eligibility: ["Bachelor's degree (no specific minimum marks)", "Minimum age 18", "No upper age limit"],
    importantDates: [
      { event: "Available", date: "Year-round (schedule at your convenience)" },
    ],
    syllabus: ["Quantitative Reasoning", "Verbal Reasoning", "Data Insights", "Analytical Writing (optional)"],
    examPattern: [
      { parameter: "Mode", detail: "Computer Adaptive / Online" },
      { parameter: "Duration", detail: "2 hours 15 minutes (Focus Edition)" },
      { parameter: "Score Range", detail: "205–805" },
      { parameter: "Sections", detail: "3 scored sections" },
    ],
    applicationProcess: ["Create account on mba.com", "Schedule exam at a test center or online", "Pay fee ($275 USD)"],
    counselling: ["Apply directly to business schools with GMAT score", "Each school has its own admission process"],
    cutoffTrends: [{ year: "2025", general: "700+ (top schools)", obc: "–", sc: "–" }],
    faqs: [{ q: "Is GMAT accepted in India?", a: "Yes, ISB, IIMs (executive programs), XLRI, and many others accept GMAT scores." }],
    relatedColleges: ["ISB Hyderabad", "IIM Ahmedabad", "IIM Bangalore"],
    relatedCourses: ["MBA", "PGPX", "Executive MBA"],
  },
};

export default function ExamDetail() {
  const { slug } = useParams();
  const exam = slug ? examsData[slug] : null;

  if (!exam) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Exam Not Found</h1>
          <p className="text-muted-foreground mb-6">The exam page you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="max-w-4xl">
            <Badge className="mb-3">{exam.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{exam.name}</h1>
            <p className="text-lg text-muted-foreground mb-1">{exam.fullName}</p>
            <p className="text-sm text-muted-foreground mb-6">Conducted by: {exam.conductedBy}</p>
            <p className="text-muted-foreground max-w-3xl">{exam.overview}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
            <TabsTrigger value="dates">Important Dates</TabsTrigger>
            <TabsTrigger value="syllabus">Syllabus & Pattern</TabsTrigger>
            <TabsTrigger value="apply">How to Apply</TabsTrigger>
            <TabsTrigger value="counselling">Counselling</TabsTrigger>
            <TabsTrigger value="cutoff">Cut-off Trends</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> About {exam.name}
              </h2>
              <p className="text-muted-foreground mb-4">{exam.overview}</p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Related Colleges</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {exam.relatedColleges.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3 text-primary" />
                        <Link to="/colleges" className="hover:text-primary transition-colors">{c}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Related Courses</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {exam.relatedCourses.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <BookOpen className="w-3 h-3 text-primary" />
                        <Link to="/courses" className="hover:text-primary transition-colors">{c}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="eligibility">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" /> Eligibility Criteria
              </h2>
              <ul className="space-y-3">
                {exam.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="dates">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Important Dates
              </h2>
              <div className="space-y-4">
                {exam.importantDates.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.event}</div>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="syllabus" className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Syllabus
              </h2>
              <ul className="space-y-2">
                {exam.syllabus.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground p-2 bg-secondary/30 rounded-lg">
                    <Award className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Exam Pattern
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Parameter</th>
                      <th className="text-left p-3 font-semibold">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.examPattern.map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="p-3 font-medium">{row.parameter}</td>
                        <td className="p-3 text-muted-foreground">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apply">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Application Process
              </h2>
              <div className="space-y-4">
                {exam.applicationProcess.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="pt-1 text-muted-foreground">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="counselling">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Counselling Process
              </h2>
              <ul className="space-y-3">
                {exam.counselling.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="cutoff">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Cut-off Trends
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Year</th>
                      <th className="text-left p-3 font-semibold">General</th>
                      <th className="text-left p-3 font-semibold">OBC</th>
                      <th className="text-left p-3 font-semibold">SC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exam.cutoffTrends.map((row, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="p-3 font-medium">{row.year}</td>
                        <td className="p-3 text-muted-foreground">{row.general}</td>
                        <td className="p-3 text-muted-foreground">{row.obc}</td>
                        <td className="p-3 text-muted-foreground">{row.sc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {exam.faqs.map((faq, i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <h3 className="font-medium text-foreground mb-2">Q: {faq.q}</h3>
                    <p className="text-muted-foreground text-sm">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
