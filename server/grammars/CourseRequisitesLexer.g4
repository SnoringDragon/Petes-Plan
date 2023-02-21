lexer grammar CourseRequisitesLexer;

// lexer rules
// http://lab.antlr.org/

fragment Ws : [\t\r\n ];

AND : 'and';
OR : 'or';
LPAREN: '(';
RPAREN: ')';
COURSE_REQUISITE : 'Undergraduate level' -> mode(COURSE_MODE);
WORD: [a-zA-Z0-9]+;
WS: Ws -> skip;

mode COURSE_MODE;
COURSE_NAME: [A-Z0-9]+' '[A-Z0-9]+;
COURSE_GRADE_TEXT: 'Minimum Grade of';
COURSE_GRADE: [A-Z]+[-+]?' [may be taken concurrently]'? -> mode(DEFAULT_MODE);
COURSE_WS: Ws -> skip;

