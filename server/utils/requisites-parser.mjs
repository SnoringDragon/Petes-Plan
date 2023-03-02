import antlr4 from 'antlr4';
import CourseRequisitesLexer from '../grammars/CourseRequisitesLexer.js';
import CourseRequisitesParser from '../grammars/CourseRequisitesParser.js';
import CourseRequirementsParser from '../grammars/CourseRequirementsParser.js';
import CourseRequirementsLexer from '../grammars/CourseRequirementsLexer.js';

class ThrowingErrorListener extends antlr4.error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, msg, err) {
        const e = new Error(msg);
        e.recognizer = recognizer;
        e.offendingSymbol = offendingSymbol;
        e.line = line;
        e.column = column;
        e.err = err;
        throw e;
    }

    static INSTANCE = new ThrowingErrorListener();
}

/**
 * Abstract class representing multiple requisites
 */
export class Group {
    constructor(children, { requiredCredits = null  } = {}) {
        this.children = children;
        /**
         * required number of credits to satisfy this group
         * @type {number|null}
         */
        this.requiredCredits = requiredCredits;
    }

    toJSON() {
        return { children: this.children,
            requiredCredits: this.requiredCredits };
    }
}

/**
 * And group, if a child is not satisfied then this group is not satisfied
 */
export class And extends Group {
    toJSON() {
        return { ...super.toJSON(), type: 'and' };
    }
}

/**
 * Or group, if all children are not satisfied then this group is not satisfied
 */
export class Or extends Group {
    toJSON() {
        return { ...super.toJSON(), type: 'or' };
    }
}

/**
 * PickN group, need to have n or more children satisfied
 */
export class PickN extends Group {
    constructor(children, n, options) {
        super(children, options);
        this.n = n;
    }

    toJSON() {
        return { ...super.toJSON(), type: 'pick_n', n: this.n };
    }
}

/**
 * Requisite that is satisfied by a single course
 */
export class Course {
    constructor({ subject, number, minGrade = null, isCorequisite = false }) {
        this.subject = subject;
        this.courseID = number;
        this.isCorequisite = isCorequisite;
        this.minGrade = minGrade;
    }

    toJSON() {
        return { ...this, type: 'course' };
    }
}

/**
 * Requisite that is satisfied by multiple courses, such as a range of courses, any course of a subject,
 *  or in rare cases multiple credits in one (variable-title) course
 */
export class CourseGroup {
    constructor({ subject, startNumber = null, endNumber = startNumber, minGrade = null, isCorequisite = false, requiredCourses = null, requiredCredits = null }) {
        this.subject = subject;
        this.startCourseID = startNumber;
        this.endCourseID = endNumber;
        this.isCorequisite = isCorequisite;
        this.minGrade = minGrade;
        this.requiredCourses = requiredCourses;
        this.requiredCredits = requiredCredits;
    }

    toJSON() {
        return { ...this, type: 'course_group' };
    }
}

/**
 * Some requisite text that is not a course (for example, a SAT exam)
 */
export class NonCourse {
    constructor(text) {
        this.text = text;
    }

    toJSON() {
        return { text: this.text, type: 'non_course' };
    }
}

// export class StudentAttribute {
//     constructor(attribute) {
//         this.attribute = attribute;
//     }
//
//     toJSON() {
//         return { attribute: this.attribute, type: 'student_attribute' };
//     }
// }

/**
 * A student level, either 'graduate' or 'professional'
 */
export class StudentLevel {
    constructor(level) {
        this.level = level;
    }

    toJSON() {
        return { level: this.level, type: 'student_level' };
    }
}

export class RequisitesParser {
    _getParseTree(lexerClass, parserClass, str, start='start') {
        const chars = new antlr4.InputStream(str);
        const lexer = new lexerClass(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new parserClass(tokens);

        lexer.removeErrorListeners();
        lexer.addErrorListener(ThrowingErrorListener.INSTANCE);

        parser.buildParseTrees = true;
        parser.removeErrorListeners();
        parser.addErrorListener(ThrowingErrorListener.INSTANCE);

        return parser[start]();
    }

    buildPrerequisiteTree(tree) {
        if (!tree?.children) return null;

        // helper context, find the child that has children to traverse
        if (tree instanceof CourseRequisitesParser.Or_requisiteContext ||
            tree instanceof CourseRequisitesParser.And_requisiteContext ||
            tree instanceof CourseRequisitesParser.StartContext ||
            tree instanceof CourseRequisitesParser.GroupContext)
            return this.buildPrerequisiteTree(tree.children.find(c => c.children !== undefined));

        // convert and/or groups to corresponding class
        if (tree instanceof CourseRequisitesParser.Or_groupContext ||
            tree instanceof CourseRequisitesParser.And_groupContext)
            return new (tree instanceof CourseRequisitesParser.Or_groupContext ? Or : And)(
                tree.children.map(child => this.buildPrerequisiteTree(child)).filter(x => x));

        // non course
        if (tree instanceof CourseRequisitesParser.Non_courseContext)
            return new NonCourse(tree.children.map(x => x.getText()).join(' '));

        // course
        if (tree instanceof CourseRequisitesParser.CourseContext) {
            let [, courseName, , minGrade] = tree.children.map(x => x.getText());
            let isCorequisite = false;

            if (minGrade.includes('[may be taken concurrently]')) {
                isCorequisite = true;
                minGrade = minGrade.replace('[may be taken concurrently]', '').trim();
            }

            const [subject, number] = courseName.split(/\s+/);

            return new Course({
                subject,
                number,
                minGrade,
                isCorequisite
            });
        }

        throw new Error(`unknown type ${tree?.constructor?.name}`);
    }

    buildGeneralRequirementsTree(tree) {
        if (!tree?.children) return null;

        // helper context, find child
        if (tree instanceof CourseRequirementsParser.StartContext ||
            tree instanceof CourseRequirementsParser.GroupContext ||
            tree instanceof CourseRequirementsParser.Or_requirementContext ||
            tree instanceof CourseRequirementsParser.And_requirementContext ||
            tree instanceof CourseRequirementsParser.RequirementContext ||
            tree instanceof CourseRequirementsParser.RuleContext ||
            tree instanceof CourseRequirementsParser.Rule_groupContext)
            return this.buildGeneralRequirementsTree(tree.children.find(c => c.children !== undefined));

        // convert or groups to corresponding class
        if (tree instanceof CourseRequirementsParser.Or_groupContext ||
            tree instanceof CourseRequirementsParser.Or_rule_groupContext)
            return new Or(tree.children.map(child => this.buildGeneralRequirementsTree(child))
                .filter(x => x));

        // convert and groups to corresponding class
        if (tree instanceof CourseRequirementsParser.And_groupContext ||
            tree instanceof CourseRequirementsParser.And_rule_groupContext ||
            // single rule with courses separated by ANDs, for now we just consider this an and group
            tree instanceof CourseRequirementsParser.And_ruleContext)
            return new And(tree.children.map(child => this.buildGeneralRequirementsTree(child))
                .filter(x => x));

        // pick n rule
        if (tree instanceof CourseRequirementsParser.Normal_ruleContext) {
            const conditionString = tree.children[0].getText().match(/for a total of.+/)?.[0];
            const n = +(conditionString?.match(/(\d)+/)?.[1] ?? 1);
            const requiredCredits = +conditionString?.match(/(\d+) credits/)?.[1];

            return new PickN(tree.children
                .map(child => this.buildGeneralRequirementsTree(child))
                .filter(x => x), n, {
                requiredCredits: Number.isNaN(requiredCredits) ? null : requiredCredits
            });
        }

        if (tree instanceof CourseRequirementsParser.CourseContext) {
            const courseNameParts = tree.children[0].getText().trim().split(/\s+/g);
            const subject = courseNameParts[0];
            const startNumber = courseNameParts[1];
            const endNumber = courseNameParts[3];

            let minGrade = null;
            let requiredCourses = null;
            let requiredCredits = null;
            let isCorequisite = false;

            tree.children.slice(1).forEach(child => {
                const text = child.getText();
                if (text.includes('Minimum Grade of'))
                    minGrade = text.match(/(?<=Minimum Grade of\s+)[A-Z]+[-+]?/g)?.[0];
                else if (text.includes('Required Credits:'))
                    requiredCredits = +text.match(/(?<=Required Credits:\s+)\d+(?:\.?\d+)?/g)?.[0];
                else if (text.includes('Required Courses:'))
                    requiredCourses = +text.match(/(?<=Required Courses:\s+)\d+/g)?.[0];
                else if (text.includes('May be taken concurrently'))
                    isCorequisite = true;
            });

            // startNumber undefined, this is only a course subject (therefore course range)
            // endNumber not undefined, this is a course range
            if (startNumber === undefined || endNumber !== undefined ||
                requiredCourses !== null || requiredCredits !== null)
                return new CourseGroup({
                    subject, startNumber, endNumber, isCorequisite, minGrade, requiredCourses, requiredCredits
                });

            return new Course({
                subject, number: startNumber, isCorequisite, minGrade
            });
        }

        // student attribute
        if (tree instanceof CourseRequirementsParser.Student_attributeContext) {
            const text = tree.children[0].getText();
            if (text === 'GR')
                return new StudentLevel('graduate');
            if (text === 'PR')
                return new StudentLevel('professional');
            throw new Error(`unknown student attribute ${text}`);
            // return new StudentAttribute(tree.children[0].getText());
        }

        // non course
        if (tree instanceof CourseRequirementsParser.Non_courseContext)
            return new NonCourse(tree.children.map(x => x.getText()).join(' '));


        throw new Error(`unknown type ${tree?.constructor?.name}`);
    }

    simplifyTree(tree) {
        // delete an empty group
        if (tree instanceof Group && tree.children.length === 0)
            return null;

        // replace group with one child with just the child
        if (tree instanceof Group && tree.children.length === 1) {
            const child = this.simplifyTree(tree.children[0]);
            // make sure requiredCredits property is transferred
            if (child instanceof CourseGroup || child instanceof Group) {
                // take max of required credits for CourseGroup and normal Group
                if (typeof child.requiredCredits === 'number' || typeof tree.requiredCredits === 'number')
                    child.requiredCredits = Math.max(child.requiredCredits, tree.requiredCredits);
            } else if (child instanceof Course && typeof tree.requiredCredits === 'number') {
                // convert course to CourseGroup
                return new CourseGroup({
                    subject: child.subject,
                    startNumber: child.number,
                    endNumber: child.number,
                    minGrade: child.minGrade,
                    isCorequisite: child.isCorequisite,
                    requiredCredits: child.requiredCredits
                })
            }
            return child;
        }

        // replace PickN with n = 1 with an Or group
        if (tree instanceof PickN && tree.n === 1)
            return this.simplifyTree(new Or(tree.children,
                { requiredCredits: tree.requiredCredits }));

        // replace PickN with n = numCourse with an And group
        if (tree instanceof PickN && tree.n === tree.children.length)
            return this.simplifyTree(new And(tree.children,
                { requiredCredits: tree.requiredCredits }));

        // simply children
        if (tree instanceof Group) {
            tree.children = tree.children.map(child => this.simplifyTree(child))
                .filter(x => x);
        }

        // apply associative property to flatten nested ORs
        if (tree instanceof Or) {
            tree.children = tree.children.flatMap(child => {
                if (child instanceof Or && child.requiredCredits === null)
                    return child.children;
                return child;
            });
        }

        // apply associative property to flatten nested ANDs
        if (tree instanceof And) {
            tree.children = tree.children.flatMap(child => {
                if (child instanceof And && child.requiredCredits === null)
                    return child.children;
                return child;
            });
        }

        return tree;
    }

    parsePrerequisites(str) {
        if (!str.length) return null;

        const tree = this._getParseTree(CourseRequisitesLexer, CourseRequisitesParser, str);
        return this.buildPrerequisiteTree(tree);
    }

    parseGeneralRequirements(str) {
        if (!str.length) return null;

        const tree = this._getParseTree(CourseRequirementsLexer, CourseRequirementsParser, str);
        return this.buildGeneralRequirementsTree(tree);
    }

    parse(str) {
        str = str.replace(/\u00a0/g, ' ').trim(); // replace non-breaking space
        // can have multiple prerequisites/general requirements sections (see AGRY 51100)
        const prerequisites = (str.match(/(?<=Prerequisites:).+?(?=Prerequisites|General Requirements|$)/gs) ?? [])
            .map(x => x.trim()).filter(x => x.length > 30);
        const generalRequirements = (str.match(/(?<=General Requirements:).+?(?=Prerequisites|General Requirements|$)/gs) ?? [])
            .map(x => x.trim()).filter(x => x.length > 30);

        const tree = new And([
            prerequisites.map(p => this.parsePrerequisites(p)),
            generalRequirements.map(g => this.parseGeneralRequirements(g))
        ].flat(Infinity));

        return this.simplifyTree(tree);
    }
}

export default new RequisitesParser();
