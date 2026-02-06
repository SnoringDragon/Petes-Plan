parser grammar CourseRequirementsParser;

// use our defined lexer token rules
options { tokenVocab=CourseRequirementsLexer; }

// parser rules for parsing General Requirements section found in some course requirements
// http://lab.antlr.org/

start: (group | LPAREN group RPAREN?) EOF;


course: COURSE_NAME COURSE_REQUIRED_CREDITS? COURSE_REQUIRED_COURSES? COURSE_GRADE? COURSE_CONCURRENT;

non_course: WORD+;

student_attribute: STUDENT_ATTRIBUTE;

requirement: (course | student_attribute | non_course) | LPAREN (course | student_attribute | non_course) RPAREN;

// confusingly, the precedence of and/or appears to be switched compared to prerequisites section
// an or group after an and group does not necessarily have surronding parentheses
// example: see CS182 general requirements section

// making RPAREN optional is required to make rule parsing work, since rules get rid of all parentheses
and_requirement: requirement | LPAREN and_group RPAREN?;

or_requirement: requirement | LPAREN or_group RPAREN? | or_group;

or_group: and_requirement (OR and_requirement)*? (OR (LPAREN)? rule_group)?;

and_group: or_requirement (AND or_requirement)*? (AND (LPAREN)? rule_group)?;

group: rule_group | or_group | and_group;

normal_rule: RULE_START (course | LPAREN course RPAREN)+;

// these rules are weirdly formatted
// example: ABE 37000
and_rule: RULE_START (course | LPAREN course RPAREN)? (AND (course | LPAREN course RPAREN))*;

rule: normal_rule | and_rule | course;

or_rule_group: rule (OR (rule | and_rule_group))*;

// rule groups are always flat with no parentheses, therefore we group by or
and_rule_group: rule (AND (rule | or_rule_group))*;

rule_group: or_rule_group | and_rule_group;
