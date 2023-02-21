parser grammar CourseRequisitesParser;

// parser rules
// http://lab.antlr.org/

// use our defined lexer token rules
options { tokenVocab=CourseRequisitesLexer; }

start : group | LPAREN group RPAREN;

course: COURSE_REQUISITE COURSE_NAME COURSE_GRADE_TEXT
        COURSE_GRADE;

non_course: WORD+;

// an and group after an or group does not necessarily surrounding parentheses

and_requisite: course | non_course | LPAREN and_group RPAREN | and_group;

or_requisite: course | non_course | LPAREN or_group RPAREN;

or_group: and_requisite (OR and_requisite)*;

and_group: or_requisite (AND or_requisite)*;

group: and_group | or_group;
