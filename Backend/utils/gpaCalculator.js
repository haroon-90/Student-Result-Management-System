function calculateGpaAndGrade(marks) {
  const total = Object.values(marks).reduce((a, b) => a + b, 0);
  const avg = total / Object.keys(marks).length;
  let gpa = 0, grade = '';
  if (avg >= 84.5) { grade = 'A+'; gpa = 4.0; }
  else if (avg >= 79.5) { grade = 'A'; gpa = 3.7; }
  else if (avg >= 74.5) { grade = 'B+'; gpa = 3.4; }
  else if (avg >= 69.5) { grade = 'B'; gpa = 3.0; }
  else if (avg >= 64.5) { grade = 'B-'; gpa = 2.5; }
  else if (avg >= 59.5) { grade = 'C+'; gpa = 2.0; }
  else if (avg >= 54.5) { grade = 'C'; gpa = 1.5; }
  else if (avg >= 49.5) { grade = 'D'; gpa = 1.0; }
  else { grade = 'F'; gpa = 0.0; }
  return { gpa, grade, percentage: avg };
}

export default calculateGpaAndGrade;