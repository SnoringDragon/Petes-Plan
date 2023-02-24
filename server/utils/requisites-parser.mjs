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

export class Group {
    constructor(children, { requiredCredits = null  } = {}) {
        this.children = children;
        this.requiredCredits = requiredCredits;
    }

    toJSON() {
        return { children: this.children,
            requiredCredits: this.requiredCredits };
    }
}

export class And extends Group {
    toJSON() {
        return { ...super.toJSON(), type: 'and' };
    }
}

export class Or extends Group {
    toJSON() {
        return { ...super.toJSON(), type: 'or' };
    }
}

export class PickN extends Group {
    constructor(children, n, options) {
        super(children, options);
        this.n = n;
    }

    toJSON() {
        return { ...super.toJSON(), type: 'pick_n', n: this.n };
    }
}

export class Course {
    constructor({ department, startNumber, endNumber = startNumber, minGrade, isCorequisite = false, requiredCourses = null, requiredCredits = null }) {
        this.department = department;
        this.startNumber = startNumber;
        this.endNumber = endNumber;
        this.isCorequisite = isCorequisite;
        this.minGrade = minGrade;
        this.requiredCourses = requiredCourses;
        this.requiredCredits = requiredCredits;
    }

    toJSON() {
        return { ...this, type: 'course' };
    }
}

export class NonCourse {
    constructor(text) {
        this.text = text;
    }

    toJSON() {
        return { text: this.text, type: 'non_course' };
    }
}

export class StudentAttribute {
    constructor(attribute) {
        this.attribute = attribute;
    }

    toJSON() {
        return { attribute: this.attribute, type: 'student_attribute' };
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

            const [department, name] = courseName.split(/\s+/);

            return new Course({
                department,
                startNumber: name,
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
            const courseNameParts = tree.children[0].getText().split(/\s+/g);
            const department = courseNameParts[0];
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

            return new Course({
                department, startNumber, endNumber, isCorequisite, minGrade, requiredCourses, requiredCredits
            });
        }

        // student attribute
        if (tree instanceof CourseRequirementsParser.Student_attributeContext)
            return new StudentAttribute(tree.children[0].getText());

        // non course
        if (tree instanceof CourseRequirementsParser.Non_courseContext)
            return new NonCourse(tree.children.map(x => x.getText()).join(' '));


        throw new Error(`unknown type ${tree?.constructor?.name}`);
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

        prerequisites.map(p => this.parsePrerequisites(p));
        generalRequirements.map(g => this.parseGeneralRequirements(g));

        return null;
    }
}

export default new RequisitesParser();
