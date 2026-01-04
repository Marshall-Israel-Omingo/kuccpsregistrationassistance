// Grade points mapping (KCSE grading system)
export const gradePoints: Record<string, number> = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7,
  'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};

// Mean grade ranges (total points for 7 subjects)
export const meanGradeRanges = [
  { grade: 'A', min: 84, max: 84 },
  { grade: 'A-', min: 80, max: 83 },
  { grade: 'B+', min: 76, max: 79 },
  { grade: 'B', min: 72, max: 75 },
  { grade: 'B-', min: 68, max: 71 },
  { grade: 'C+', min: 64, max: 67 },
  { grade: 'C', min: 60, max: 63 },
  { grade: 'C-', min: 56, max: 59 },
  { grade: 'D+', min: 52, max: 55 },
  { grade: 'D', min: 48, max: 51 },
  { grade: 'D-', min: 44, max: 47 },
  { grade: 'E', min: 0, max: 43 }
];

export interface SubjectGrade {
  subject: string;
  grade: string;
}

export const calculateMeanGrade = (subjects: SubjectGrade[]): { meanGrade: string; totalPoints: number } => {
  if (subjects.length < 7) return { meanGrade: '-', totalPoints: 0 };

  // Get language subject (English or Kiswahili - best one)
  const languages = subjects.filter(s => 
    s.subject === 'English' || s.subject === 'Kiswahili'
  );
  
  // Get mathematics
  const maths = subjects.filter(s => 
    s.subject === 'Mathematics Alternative A' || s.subject === 'Mathematics Alternative B'
  );

  if (languages.length === 0 || maths.length === 0) {
    return { meanGrade: '-', totalPoints: 0 };
  }

  // Select best language
  const bestLanguage = languages.reduce((best, curr) => 
    gradePoints[curr.grade] > gradePoints[best.grade] ? curr : best
  );

  // Select best math
  const bestMath = maths.reduce((best, curr) => 
    gradePoints[curr.grade] > gradePoints[best.grade] ? curr : best
  );

  // Get remaining subjects (exclude selected language and math)
  const otherSubjects = subjects.filter(s => 
    s.subject !== bestLanguage.subject && s.subject !== bestMath.subject
  );

  // Sort by points and take best 5
  const best5 = otherSubjects
    .sort((a, b) => gradePoints[b.grade] - gradePoints[a.grade])
    .slice(0, 5);

  // Calculate total points
  const totalPoints = 
    gradePoints[bestLanguage.grade] +
    gradePoints[bestMath.grade] +
    best5.reduce((sum, s) => sum + gradePoints[s.grade], 0);

  // Determine mean grade
  const meanGradeObj = meanGradeRanges.find(range => 
    totalPoints >= range.min && totalPoints <= range.max
  );

  return {
    meanGrade: meanGradeObj ? meanGradeObj.grade : 'E',
    totalPoints
  };
};

export const validateSubjects = (subjects: SubjectGrade[]): { isValid: boolean; error: string | null } => {
  if (subjects.length < 8) {
    return { isValid: false, error: 'Minimum 8 subjects required' };
  }

  const hasLanguage = subjects.some(s => 
    s.subject === 'English' || s.subject === 'Kiswahili'
  );
  
  if (!hasLanguage) {
    return { isValid: false, error: 'English or Kiswahili is required' };
  }

  const hasMath = subjects.some(s => 
    s.subject === 'Mathematics Alternative A' || s.subject === 'Mathematics Alternative B'
  );
  
  if (!hasMath) {
    return { isValid: false, error: 'Mathematics is required' };
  }

  return { isValid: true, error: null };
};
