export const getGradeScore = (grade: any) => {
    const gradingScale = [
        { letterGrade: 'A+', gradeScore: 4 },
        { letterGrade: 'A', gradeScore: 4 },
        { letterGrade: 'A-', gradeScore: 3.67 },
        { letterGrade: 'B+', gradeScore: 3.33 },
        { letterGrade: 'B', gradeScore: 3 },
        { letterGrade: 'B-', gradeScore: 2.67 },
        { letterGrade: 'C+', gradeScore: 2.33 },
        { letterGrade: 'C', gradeScore: 2 },
        { letterGrade: 'D', gradeScore: 1 },
        { letterGrade: 'F', gradeScore: 0 },
    ];

    const found = gradingScale.find(g => g.letterGrade === grade);
    return found ? found.gradeScore : 0;
};