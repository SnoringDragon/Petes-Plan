lexer grammar CourseRequirementsLexer;

// lexer rules for parsing General Requirements section found in some course requirements
// http://lab.antlr.org/

fragment Ws : [\t\r\n ];
fragment Course : [A-Z0-9]+ Ws+ [A-Z0-9]+;
fragment CourseGrade : [A-Z]+[-+]?;
fragment MinGrade : 'Minimum Grade of';
fragment Concurrent : 'May' ' not'? ' be taken concurrently.';
fragment RuleNumber : [A-Z0-9]+ '.'?;
fragment Rule : 'Rule: ' RuleNumber ':'
        (([\t !-~]+? 'for a total of ' [0-9]+ ' conditions' (Ws? [0-9]+' course')? Ws* (')' Ws+)?) |
        ([\t !-'*-~]+? Ws* (')' | [\t ]* [\r\n]+))); // doesnt always have conditions text, see CS515

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
COURSE_CONCURRENT: Concurrent -> mode(DEFAULT_MODE);
COURSE_NAME: Course;
COURSE_GRADE: MinGrade Ws+ CourseGrade;
WS2: Ws -> skip;

mode PRE_RULE_MODE;
PRE_RULE_AND: 'and' -> type(AND);
PRE_RULE_OR: 'or' -> type(OR);
PRE_RULE_START: Rule -> type(RULE_START), mode(RULE_MODE);
WS4: Ws -> skip;

mode RULE_MODE;
RULE_AND: 'and' -> type(AND);
RULE_LPAREN: '(' -> type(LPAREN);
RULE_RPAREN: ')' -> type(RPAREN);
RULE_CONCURRENT: Concurrent -> type(COURSE_CONCURRENT);
RULE_GRADE: MinGrade Ws+ CourseGrade -> type(COURSE_GRADE);
RULE_COURSE_NAME: Course -> type(COURSE_NAME);
RULE_END: 'End of rule ' RuleNumber -> skip, mode(PRE_RULE_MODE);
WS3: Ws -> skip;
