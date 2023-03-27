//input: categories and their weights: homework, exam, essay, 
//quiz, project, extra cred, discussion, activity, mischellaneous
//input: assignments & weights & grades

exports.calculateGrade = async (req, res) => {
    //labels format: ['label', percentVal]
    let grade = 0;
    let labelsPlaceHolder = new Map();
    let extraCred = 0;
    //assignments format: ['label', 'name', numberGrade, extraCredCapIfPresent]
    let assignmentsPlaceholder = []
    for (let i = 0; i < length(assignments); i++) {
        if (labelsPlaceHolder.has(assignments[i][0])) {
            if (assignments[i][0].localeCompare("extra credit")) {
                grade += assignments[i][2]*labelsPlaceHolder[assignments[i][0]];
            } else {
                if (assignments[i][2] > assignments[i][3]) { //if entered extra credit exceeds cap
                    grade += assignments[i][3]; //add the capped amount
                } else {
                    grade += assignments[i][3]; //add the capped amount
                }
            }
        } else {
            throw new Error(`Unexpected label name.`);
        }
    }
    return grade, getLetterGrade(grade);
}


async function getLetterGrade(numberGrade) {
    if (numberGrade >= 97) {
        return 'A+';
    } else if (numberGrade >= 93) {
        return 'A';
    } else if (numberGrade >= 90) {
        return 'A-';
    } else if (numberGrade >= 87) {
        return 'B+';
    } else if (numberGrade >= 83) {
        return 'B';
    } else if (numberGrade >= 80) {
        return 'B-';
    } else if (numberGrade >= 77) {
        return 'C+';
    } else if (numberGrade >= 73) {
        return 'C';
    } else if (numberGrade >= 70) {
        return 'C-';
    } else if (numberGrade >= 67) {
        return 'D+';
    } else if (numberGrade >= 63) {
        return 'D'
    } else if (numberGrade >= 60) {
        return 'D-'
    } else {
        return 'F';
    }   
}
