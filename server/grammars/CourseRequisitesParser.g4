parser grammar CourseRequisitesParser;

// parser rules
// http://lab.antlr.org/

// use our defined lexer token rules
options { tokenVocab=CourseRequisitesLexer; }

start : group | LPAREN group RPAREN;

course: COURSE_REQUISITE COURSE_NAME COURSE_GRADE_TEXT
        COURSE_GRADE;

non_course: WORD+;

requisite: course | non_course | LPAREN group RPAREN;

or_group: requisite (OR requisite)*;

and_group: requisite (AND requisite)*;

group: or_group | and_group;
