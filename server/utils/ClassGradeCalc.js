//input: categories and their weights: homework, exam, essay, 
//quiz, project, extra cred, discussion, activity, mischellaneous
//input: assignments & weights & grades

// exports.calculateGrade = (weights, assignments) => {
function calculateGrade(weights, assignments, extraCred_cap = 0) {
    //labels format: ['label', percentVal]
    let grade = 0.0;
    //weights is a map of type (str, int) = (label, weight). Ex: ("homework", "20") 
    let extraCred = 0;    
                            //str    //str   //double        //double  
    //assignments format: [['label', 'name', numberGrade, extraCredCapIfPresent], [...], [...], ...]
    let grades = new Map(); 
    for (let i = 0; i < (assignments.length); i++) {
        if (grades.has(assignments[i][0])) {
            let current = grades.get(assignments[i][0]);
            current.push(assignments[i][2]);
            grades.set(assignments[i][0], current);
        } else {
            grades.set(assignments[i][0], [assignments[i][2]]);
        }
    }
    for (let [key, value] of grades) {
        //if label is not extra credit
        if (key.localeCompare("extra credit")) {
            category_pts = value.reduce((a, b) => a + b, 0) / value.length;
            grade += category_pts * weights.get(key) * 0.01;
        } else {
            sum = value.reduce((a, b) => a + b, 0)
            if (sum > extraCred_cap) {
                sum = extraCred_cap;
            }
            grade += sum;
        }
    }
        
    //     if (labelsPlaceHolder.has(assignments[i][0])) {
    //         if (extraCred) {
    //             //if cap exists  
    //             if (assignments[i][4] > 0) {
    //                 //if label is not extra credit
    //                 if (assignments[i][0].localeCompare("extra credit")) {
    //                     if assignments[i][2]*0.01*labelsPlaceHolder.get(assignments[i][0])
    //                     extraCred = assignments[i][2]*0.01*labelsPlaceHolder.get(assignments[i][0]);
                        
    //                 } else {
    //                     extraCred = assignments[i][2] + extraCred;
    //                     if (extraCred > assignments[i][4]) {
    //                         extraCred = assignments[i][4];
    //                     }
    //                 }
    //             }
    //             // if (assignments[i][3] > 0 & assignments[i][2] > assignments[i][3]) { //if entered extra credit exceeds cap
    //             //     grade += assignments[i][3]; //add the capped amount
    //             // } else {
    //             //     grade += assignments[i][3]; //add the capped amount
    //             // }
    //         } else {
    //             grade += assignments[i][2]*0.01*labelsPlaceHolder.get(assignments[i][0]);
    //         }
    //     } else {
    //         throw new Error(`Unexpected label name.`);
    //     }
    // }
    return [grade, getLetterGrade(grade)];
}

function getLetterGrade(numberGrade) {
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

let weights = new Map();
let labels = ["homework", "quiz", "exam", "extra credit"];
let label_weights = [30, 40, 30];
for (let i = 0; i < (labels.length); i++) {
    weights.set(labels[i], label_weights[i]);
}
assignments = [["homework", "Assignment 1", 90, 0], ["homework", "Assignment 2", 80, 0], ["homework", "Assignment 2", 70, 0], ["quiz", "Quiz 1", 90, 0], ["quiz", "Quiz 2", 100, 0], ["exam", "Exam 1", 60, 0], ["exam", "Exam 1", 90, 0], ["extra credit", "Lab EC", 5, 4]];
console.log(calculateGrade(weights, assignments));