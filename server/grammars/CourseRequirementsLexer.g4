lexer grammar CourseRequirementsLexer;

// lexer rules for parsing General Requirements section found in some course requirements
// http://lab.antlr.org/

fragment Ws : [\t\r\n ];
fragment Course : [A-Z0-9]+' '[A-Z0-9]+;
fragment CourseGrade : [A-Z]+[-+]?;
fragment MinGrade : 'Minimum Grade of';
fragment Concurrent : 'May' ' not'? ' be taken concurrently.';
fragment RuleNumber : [A-Z0-9]+ '.';
fragment Rule : 'Rule: ' RuleNumber ':' [\t A-Z0-9a-z]+ 'for a total of ' [0-9]+ ' conditions' (Ws? [0-9]+' course')? Ws* (')' Ws+ 'and')?;

AND: 'and';
OR: 'or';
LPAREN: '(';
RPAREN: ')';

STUDENT_ATTRIBUTE_START: 'Student Attribute:' -> skip, mode(STUDENT_ATTRIBUTE_MODE);

COURSE_START: 'Course or Test:' -> skip, mode(COURSE_MODE);

RULE_START: Rule -> mode(RULE_MODE);

WS0: Ws -> skip;

mode STUDENT_ATTRIBUTE_MODE;
STUDENT_ATTRIBUTE: [A-Z0-9]+;
ATTRIBUTE_CONCURRENT: Concurrent -> skip, mode(DEFAULT_MODE);
WS1: Ws -> skip;

mode COURSE_MODE;
COURSE_NAME: Course;
COURSE_GRADE_TEXT: MinGrade;
COURSE_GRADE: CourseGrade;
COURSE_CONCURRENT: Concurrent -> mode(DEFAULT_MODE);
WS2: Ws -> skip;

mode PRE_RULE_MODE;
PRE_RULE_AND: 'and' -> type(AND);
PRE_RULE_START: Rule -> type(RULE_START), mode(RULE_MODE);

mode RULE_MODE;
RULE_AND: 'and' -> type(AND);
RULE_LPAREN: '(' -> type(LPAREN);
RULE_RPAREN: ')' -> type(RPAREN);
RULE_GRADE_TEXT: MinGrade;
RULE_CONCURRENT: Concurrent;
RULE_GRADE: CourseGrade;
RULE_COURSE_NAME: Course;
RULE_END: 'End of rule ' RuleNumber '.' -> skip, mode(PRE_RULE_MODE);
WS3: Ws -> skip;
