//input: categories and their weights: homework, exam, essay, 
//quiz, project, extra cred, discussion, activity, mischellaneous
//input: assignments & weights & grades
                        //str    //str   //double   
    //assignments format: [['label', 'name', numberGrade], [...], [...], ...]
    //weights format: Map() with key category "label" and value [label_weight, label_cap]
//Note: label_cap is a 0 or 1 for any category label except for for extra credit. for extra_cred, it can be an int cap 
// exports.calculateGrade = (weights, assignments) => {
function calculateGrade(weights, assignments, capped = False) {
    let grade = 0.0;
    //weights is a map of type (str, int) = (label, weight). Ex: ("homework", "20") 
    let extraCred = 0;    
    
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
            let uncappedGrade = category_pts * weights.get(key)[0] * 0.01;
            if (weights.get(key)[1]) {
                if (grade > weights.get(key)[0]) {
                    grade += weights.get(key)[0];
                } else {
                    grade += uncappedGrade;
                }
            } else {
                grade += uncappedGrade;
            }
        } else {
            uncappedGrade = value.reduce((a, b) => a + b, 0);
            if (weights.get(key)[1]) {
                if (weights.get(key)[1] < category_pts) {
                    grade += weights.get(key)[1];
                } 
            } else {
                grade += uncappedGrade;
            }
        }
        // } else {
        //     //if it is extra credit and capped is true, then set grade to 100 (maxgGade)
        //     sum = value.reduce((a, b) => a + b, 0)
        //     if (capped) {
        //         if (grade > 100) {
        //             grade = 100;
        //         }
        //     }
        // }
        
    }
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

// let weights = new Map();
// let labels = ["homework", "quiz", "exam", "extra credit"];
//extra cred has default weight of 100
// let label_weights = [30, 40, 30, 100];
// let label_caps = [0, 0, 1, 1];
// capped = 1;
// for (let i = 0; i < (label_weights.length); i++) {
//     weights.set(labels[i], [label_weights[i], label_caps[i]]);
// }
// assignments = [["homework", "Assignment 1", 90], ["homework", "Assignment 2", 80], ["homework", "Assignment 2", 70], ["quiz", "Quiz 1", 90], ["quiz", "Quiz 2", 100], ["exam", "Exam 1", 105], ["exam", "Exam 1", 100], ["extra credit", "ec 1", 6],];
// console.log(calculateGrade(weights, assignments, capped));