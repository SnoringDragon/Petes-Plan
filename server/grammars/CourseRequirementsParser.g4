parser grammar CourseRequirementsParser;

// use our defined lexer token rules
options { tokenVocab=CourseRequirementsLexer; }

// parser rules for parsing General Requirements section found in some course requirements
// http://lab.antlr.org/

start: (group | LPAREN group RPAREN?) EOF;

course: COURSE_NAME (COURSE_GRADE)? COURSE_CONCURRENT;

student_attribute: STUDENT_ATTRIBUTE;

course_or_attribute: (course | student_attribute) | LPAREN (course | student_attribute) RPAREN;

// confusingly, the precedence of and/or appears to be switched compared to prerequisites section
// an or group after an and group does not necessarily have surronding parentheses
// example: see CS182 general requirements section

and_requirement: course_or_attribute | LPAREN and_group RPAREN?;

or_requirement: course_or_attribute | LPAREN or_group RPAREN? | or_group;

or_group: and_requirement (OR and_requirement)*? (OR (LPAREN)? rule_group)?;

and_group: or_requirement (AND or_requirement)*? (AND (LPAREN)? rule_group)?;

group: rule_group | or_group | and_group;

normal_rule: RULE_START (course | LPAREN course RPAREN)+;

// these rules are weirdly formatted
// example: ABE 37000
and_rule: RULE_START (AND (course | LPAREN course RPAREN))+;

rule: normal_rule | and_rule;

or_rule_group: rule (OR rule)*;

// rule groups are always flat with no parentheses, therefore we group by or
rule_group: rule (AND (rule | or_rule_group))*;
