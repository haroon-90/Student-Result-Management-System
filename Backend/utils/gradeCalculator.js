const getGrade = (marks) => {
    if (marks >= 84.5) return 'A+';
    else if (marks >= 79.5) return 'A';
    else if (marks >= 74.5) return 'B+';
    else if (marks >= 69.5) return 'B';
    else if (marks >= 64.5) return 'B-';
    else if (marks >= 59.5) return 'C+';
    else if (marks >= 54.5) return 'C';
    else if (marks >= 49.5) return 'D';
    else return 'F';
};
