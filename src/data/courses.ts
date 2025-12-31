export interface Course {
  id: string;
  name: string;
  code: string;
  principleId: string;
  clusterPoints: number;
  meanGrade: string;
  duration: string;
  mode: string;
  description: string;
  institutions: Institution[];
  requirements: SubjectRequirement[];
  careers: string[];
}

export interface Institution {
  id: string;
  name: string;
  campus: string;
  type: 'university' | 'college';
}

export interface SubjectRequirement {
  subject: string;
  minimumGrade: string;
  alternatives?: string[];
}

export interface Principle {
  id: string;
  name: string;
  icon: string;
  description: string;
  courseCount: number;
}

export const principles: Principle[] = [
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    icon: '⚙️',
    description: 'Build the future with cutting-edge engineering and technology programs',
    courseCount: 85,
  },
  {
    id: 'medicine',
    name: 'Medical Sciences',
    icon: '🏥',
    description: 'Save lives and improve health outcomes through medical education',
    courseCount: 62,
  },
  {
    id: 'business',
    name: 'Business & Commerce',
    icon: '📊',
    description: 'Master the art of business, finance, and entrepreneurship',
    courseCount: 94,
  },
  {
    id: 'arts',
    name: 'Arts & Humanities',
    icon: '🎨',
    description: 'Explore creativity, culture, and human expression',
    courseCount: 73,
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    description: 'Shape future generations through teaching and educational research',
    courseCount: 56,
  },
  {
    id: 'ict',
    name: 'ICT & Computer Science',
    icon: '💻',
    description: 'Drive innovation in computing, software, and digital technologies',
    courseCount: 78,
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Veterinary',
    icon: '🌾',
    description: 'Feed the nation through agricultural sciences and animal care',
    courseCount: 45,
  },
  {
    id: 'law',
    name: 'Law & Legal Studies',
    icon: '⚖️',
    description: 'Uphold justice and shape legal frameworks',
    courseCount: 28,
  },
  {
    id: 'science',
    name: 'Pure & Applied Sciences',
    icon: '🔬',
    description: 'Discover the fundamental laws of nature through scientific inquiry',
    courseCount: 67,
  },
  {
    id: 'social',
    name: 'Social Sciences',
    icon: '🌍',
    description: 'Understand society, politics, and human behavior',
    courseCount: 54,
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    icon: '🏨',
    description: 'Excel in the dynamic world of hospitality and travel',
    courseCount: 32,
  },
  {
    id: 'media',
    name: 'Media & Communication',
    icon: '📺',
    description: 'Tell stories and shape public discourse through media',
    courseCount: 41,
  },
];

export const institutions: Institution[] = [
  { id: 'uon', name: 'University of Nairobi', campus: 'Main Campus', type: 'university' },
  { id: 'ku', name: 'Kenyatta University', campus: 'Main Campus', type: 'university' },
  { id: 'jkuat', name: 'JKUAT', campus: 'Juja', type: 'university' },
  { id: 'moi', name: 'Moi University', campus: 'Main Campus', type: 'university' },
  { id: 'egerton', name: 'Egerton University', campus: 'Njoro', type: 'university' },
  { id: 'maseno', name: 'Maseno University', campus: 'Main Campus', type: 'university' },
  { id: 'strathmore', name: 'Strathmore University', campus: 'Madaraka', type: 'university' },
  { id: 'usiu', name: 'USIU-Africa', campus: 'Nairobi', type: 'university' },
  { id: 'kemu', name: 'Kenya Methodist University', campus: 'Meru', type: 'university' },
  { id: 'daystar', name: 'Daystar University', campus: 'Nairobi', type: 'university' },
];

export const courses: Course[] = [
  {
    id: '1',
    name: 'Bachelor of Medicine and Bachelor of Surgery (MBChB)',
    code: 'MED001',
    principleId: 'medicine',
    clusterPoints: 47,
    meanGrade: 'A',
    duration: '6 years',
    mode: 'Full-time',
    description: 'A comprehensive medical program that prepares students for a career in medicine, covering all aspects of human health, disease diagnosis, and treatment.',
    institutions: [institutions[0], institutions[1], institutions[3]],
    requirements: [
      { subject: 'Biology', minimumGrade: 'A-' },
      { subject: 'Chemistry', minimumGrade: 'A-' },
      { subject: 'Mathematics/Physics', minimumGrade: 'B+' },
      { subject: 'English/Kiswahili', minimumGrade: 'B+' },
    ],
    careers: ['Medical Doctor', 'Surgeon', 'Specialist Physician', 'Medical Researcher'],
  },
  {
    id: '2',
    name: 'Bachelor of Science in Computer Science',
    code: 'CS001',
    principleId: 'ict',
    clusterPoints: 42,
    meanGrade: 'A-',
    duration: '4 years',
    mode: 'Full-time',
    description: 'A rigorous program covering software development, algorithms, artificial intelligence, and computer systems.',
    institutions: [institutions[0], institutions[1], institutions[2], institutions[6]],
    requirements: [
      { subject: 'Mathematics', minimumGrade: 'B+' },
      { subject: 'Physics', minimumGrade: 'B', alternatives: ['Computer Studies'] },
      { subject: 'English/Kiswahili', minimumGrade: 'C+' },
    ],
    careers: ['Software Engineer', 'Data Scientist', 'Systems Architect', 'AI Researcher'],
  },
  {
    id: '3',
    name: 'Bachelor of Laws (LLB)',
    code: 'LAW001',
    principleId: 'law',
    clusterPoints: 44,
    meanGrade: 'A-',
    duration: '4 years',
    mode: 'Full-time',
    description: 'A comprehensive legal education covering constitutional law, criminal law, civil law, and legal practice.',
    institutions: [institutions[0], institutions[1], institutions[6]],
    requirements: [
      { subject: 'English', minimumGrade: 'B+' },
      { subject: 'Kiswahili', minimumGrade: 'B' },
      { subject: 'History/Government', minimumGrade: 'B+' },
    ],
    careers: ['Advocate', 'Judge', 'Legal Counsel', 'State Prosecutor'],
  },
  {
    id: '4',
    name: 'Bachelor of Architecture',
    code: 'ARCH001',
    principleId: 'engineering',
    clusterPoints: 40,
    meanGrade: 'B+',
    duration: '5 years',
    mode: 'Full-time',
    description: 'An innovative program combining art, science, and technology to design sustainable built environments.',
    institutions: [institutions[0], institutions[2]],
    requirements: [
      { subject: 'Mathematics', minimumGrade: 'B+' },
      { subject: 'Physics', minimumGrade: 'B' },
      { subject: 'Art & Design', minimumGrade: 'B', alternatives: ['Technical Drawing'] },
    ],
    careers: ['Architect', 'Urban Planner', 'Interior Designer', 'Construction Manager'],
  },
  {
    id: '5',
    name: 'Bachelor of Commerce (BCOM)',
    code: 'BUS001',
    principleId: 'business',
    clusterPoints: 36,
    meanGrade: 'B',
    duration: '4 years',
    mode: 'Full-time',
    description: 'A versatile business program covering accounting, finance, marketing, and management.',
    institutions: institutions.slice(0, 8),
    requirements: [
      { subject: 'Mathematics', minimumGrade: 'B' },
      { subject: 'English', minimumGrade: 'C+' },
      { subject: 'Business Studies', minimumGrade: 'B', alternatives: ['Economics'] },
    ],
    careers: ['Accountant', 'Financial Analyst', 'Marketing Manager', 'Business Consultant'],
  },
  {
    id: '6',
    name: 'Bachelor of Science in Nursing',
    code: 'NUR001',
    principleId: 'medicine',
    clusterPoints: 38,
    meanGrade: 'B+',
    duration: '4 years',
    mode: 'Full-time',
    description: 'A comprehensive nursing program preparing students for healthcare careers in hospitals, clinics, and community settings.',
    institutions: [institutions[0], institutions[1], institutions[8]],
    requirements: [
      { subject: 'Biology', minimumGrade: 'B' },
      { subject: 'Chemistry', minimumGrade: 'B' },
      { subject: 'Mathematics/Physics', minimumGrade: 'C+' },
    ],
    careers: ['Registered Nurse', 'Nurse Educator', 'Clinical Nurse Specialist', 'Nurse Manager'],
  },
  {
    id: '7',
    name: 'Bachelor of Science in Civil Engineering',
    code: 'ENG001',
    principleId: 'engineering',
    clusterPoints: 41,
    meanGrade: 'A-',
    duration: '5 years',
    mode: 'Full-time',
    description: 'Design and build infrastructure including roads, bridges, buildings, and water systems.',
    institutions: [institutions[0], institutions[2], institutions[3]],
    requirements: [
      { subject: 'Mathematics', minimumGrade: 'A-' },
      { subject: 'Physics', minimumGrade: 'B+' },
      { subject: 'Chemistry', minimumGrade: 'B' },
    ],
    careers: ['Civil Engineer', 'Structural Engineer', 'Construction Manager', 'Urban Developer'],
  },
  {
    id: '8',
    name: 'Bachelor of Education (Science)',
    code: 'EDU001',
    principleId: 'education',
    clusterPoints: 34,
    meanGrade: 'B',
    duration: '4 years',
    mode: 'Full-time',
    description: 'Train to become a secondary school science teacher with expertise in teaching methodologies.',
    institutions: [institutions[1], institutions[3], institutions[4]],
    requirements: [
      { subject: 'Two Science Subjects', minimumGrade: 'B' },
      { subject: 'Mathematics', minimumGrade: 'C+' },
      { subject: 'English/Kiswahili', minimumGrade: 'C+' },
    ],
    careers: ['Secondary School Teacher', 'Education Officer', 'Curriculum Developer', 'School Administrator'],
  },
  {
    id: '9',
    name: 'Bachelor of Journalism and Mass Communication',
    code: 'MED001',
    principleId: 'media',
    clusterPoints: 35,
    meanGrade: 'B',
    duration: '4 years',
    mode: 'Full-time',
    description: 'Learn storytelling, media production, and communication theory for careers in journalism and broadcasting.',
    institutions: [institutions[0], institutions[1], institutions[9]],
    requirements: [
      { subject: 'English', minimumGrade: 'B' },
      { subject: 'Kiswahili', minimumGrade: 'C+' },
      { subject: 'Any Humanities', minimumGrade: 'C+' },
    ],
    careers: ['Journalist', 'TV/Radio Presenter', 'Content Producer', 'PR Specialist'],
  },
  {
    id: '10',
    name: 'Bachelor of Science in Agriculture',
    code: 'AGR001',
    principleId: 'agriculture',
    clusterPoints: 32,
    meanGrade: 'B',
    duration: '4 years',
    mode: 'Full-time',
    description: 'Study crop production, soil science, and agricultural economics to contribute to food security.',
    institutions: [institutions[4], institutions[2], institutions[3]],
    requirements: [
      { subject: 'Biology', minimumGrade: 'B' },
      { subject: 'Chemistry', minimumGrade: 'C+' },
      { subject: 'Mathematics/Agriculture', minimumGrade: 'C+' },
    ],
    careers: ['Agricultural Officer', 'Farm Manager', 'Agribusiness Consultant', 'Research Scientist'],
  },
  {
    id: '11',
    name: 'Bachelor of Hospitality Management',
    code: 'HOS001',
    principleId: 'hospitality',
    clusterPoints: 30,
    meanGrade: 'C+',
    duration: '4 years',
    mode: 'Full-time',
    description: 'Prepare for leadership roles in hotels, restaurants, and tourism enterprises.',
    institutions: [institutions[1], institutions[5], institutions[8]],
    requirements: [
      { subject: 'English', minimumGrade: 'C+' },
      { subject: 'Mathematics', minimumGrade: 'C' },
      { subject: 'Business Studies/Geography', minimumGrade: 'C+' },
    ],
    careers: ['Hotel Manager', 'Event Coordinator', 'Tourism Officer', 'Restaurant Manager'],
  },
  {
    id: '12',
    name: 'Bachelor of Arts in Economics',
    code: 'ECO001',
    principleId: 'social',
    clusterPoints: 37,
    meanGrade: 'B',
    duration: '4 years',
    mode: 'Full-time',
    description: 'Analyze economic systems, policies, and markets to understand and shape economic outcomes.',
    institutions: [institutions[0], institutions[1], institutions[6]],
    requirements: [
      { subject: 'Mathematics', minimumGrade: 'B' },
      { subject: 'Economics/Business', minimumGrade: 'B' },
      { subject: 'English', minimumGrade: 'C+' },
    ],
    careers: ['Economist', 'Policy Analyst', 'Financial Consultant', 'Research Analyst'],
  },
];

export const getCoursesByPrinciple = (principleId: string): Course[] => {
  return courses.filter(course => course.principleId === principleId);
};

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getPrincipleById = (id: string): Principle | undefined => {
  return principles.find(principle => principle.id === id);
};

export const searchCourses = (query: string): Course[] => {
  const lowerQuery = query.toLowerCase();
  return courses.filter(
    course =>
      course.name.toLowerCase().includes(lowerQuery) ||
      course.code.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery)
  );
};
