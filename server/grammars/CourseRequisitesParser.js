// Generated from .\CourseRequisitesParser.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';
import CourseRequisitesParserListener from './CourseRequisitesParserListener.js';
const serializedATN = [4,1,11,60,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,1,0,1,0,1,0,1,0,1,0,3,0,20,8,0,1,1,1,1,1,1,1,1,1,1,1,2,4,
2,28,8,2,11,2,12,2,29,1,3,1,3,1,3,1,3,1,3,1,3,3,3,38,8,3,1,4,1,4,1,4,5,4,
43,8,4,10,4,12,4,46,9,4,1,5,1,5,1,5,5,5,51,8,5,10,5,12,5,54,9,5,1,6,1,6,
3,6,58,8,6,1,6,0,0,7,0,2,4,6,8,10,12,0,0,59,0,19,1,0,0,0,2,21,1,0,0,0,4,
27,1,0,0,0,6,37,1,0,0,0,8,39,1,0,0,0,10,47,1,0,0,0,12,57,1,0,0,0,14,20,3,
12,6,0,15,16,5,3,0,0,16,17,3,12,6,0,17,18,5,4,0,0,18,20,1,0,0,0,19,14,1,
0,0,0,19,15,1,0,0,0,20,1,1,0,0,0,21,22,5,5,0,0,22,23,5,8,0,0,23,24,5,9,0,
0,24,25,5,10,0,0,25,3,1,0,0,0,26,28,5,6,0,0,27,26,1,0,0,0,28,29,1,0,0,0,
29,27,1,0,0,0,29,30,1,0,0,0,30,5,1,0,0,0,31,38,3,2,1,0,32,38,3,4,2,0,33,
34,5,3,0,0,34,35,3,12,6,0,35,36,5,4,0,0,36,38,1,0,0,0,37,31,1,0,0,0,37,32,
1,0,0,0,37,33,1,0,0,0,38,7,1,0,0,0,39,44,3,6,3,0,40,41,5,2,0,0,41,43,3,6,
3,0,42,40,1,0,0,0,43,46,1,0,0,0,44,42,1,0,0,0,44,45,1,0,0,0,45,9,1,0,0,0,
46,44,1,0,0,0,47,52,3,6,3,0,48,49,5,1,0,0,49,51,3,6,3,0,50,48,1,0,0,0,51,
54,1,0,0,0,52,50,1,0,0,0,52,53,1,0,0,0,53,11,1,0,0,0,54,52,1,0,0,0,55,58,
3,8,4,0,56,58,3,10,5,0,57,55,1,0,0,0,57,56,1,0,0,0,58,13,1,0,0,0,6,19,29,
37,44,52,57];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class CourseRequisitesParser extends antlr4.Parser {

    static grammarFileName = "CourseRequisitesParser.g4";
    static literalNames = [ null, "'and'", "'or'", "'('", "')'", "'Undergraduate level'", 
                            null, null, null, "'Minimum Grade of'" ];
    static symbolicNames = [ null, "AND", "OR", "LPAREN", "RPAREN", "COURSE_REQUISITE", 
                             "WORD", "WS", "COURSE_NAME", "COURSE_GRADE_TEXT", 
                             "COURSE_GRADE", "COURSE_WS" ];
    static ruleNames = [ "start", "course", "non_course", "requisite", "or_group", 
                         "and_group", "group" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = CourseRequisitesParser.ruleNames;
        this.literalNames = CourseRequisitesParser.literalNames;
        this.symbolicNames = CourseRequisitesParser.symbolicNames;
    }



	start() {
	    let localctx = new StartContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, CourseRequisitesParser.RULE_start);
	    try {
	        this.state = 19;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 14;
	            this.group();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 15;
	            this.match(CourseRequisitesParser.LPAREN);
	            this.state = 16;
	            this.group();
	            this.state = 17;
	            this.match(CourseRequisitesParser.RPAREN);
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	course() {
	    let localctx = new CourseContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, CourseRequisitesParser.RULE_course);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 21;
	        this.match(CourseRequisitesParser.COURSE_REQUISITE);
	        this.state = 22;
	        this.match(CourseRequisitesParser.COURSE_NAME);
	        this.state = 23;
	        this.match(CourseRequisitesParser.COURSE_GRADE_TEXT);
	        this.state = 24;
	        this.match(CourseRequisitesParser.COURSE_GRADE);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	non_course() {
	    let localctx = new Non_courseContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, CourseRequisitesParser.RULE_non_course);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 27; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 26;
	            this.match(CourseRequisitesParser.WORD);
	            this.state = 29; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===6);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	requisite() {
	    let localctx = new RequisiteContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, CourseRequisitesParser.RULE_requisite);
	    try {
	        this.state = 37;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 5:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 31;
	            this.course();
	            break;
	        case 6:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 32;
	            this.non_course();
	            break;
	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 33;
	            this.match(CourseRequisitesParser.LPAREN);
	            this.state = 34;
	            this.group();
	            this.state = 35;
	            this.match(CourseRequisitesParser.RPAREN);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	or_group() {
	    let localctx = new Or_groupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, CourseRequisitesParser.RULE_or_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 39;
	        this.requisite();
	        this.state = 44;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===2) {
	            this.state = 40;
	            this.match(CourseRequisitesParser.OR);
	            this.state = 41;
	            this.requisite();
	            this.state = 46;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	and_group() {
	    let localctx = new And_groupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, CourseRequisitesParser.RULE_and_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 47;
	        this.requisite();
	        this.state = 52;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===1) {
	            this.state = 48;
	            this.match(CourseRequisitesParser.AND);
	            this.state = 49;
	            this.requisite();
	            this.state = 54;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	group() {
	    let localctx = new GroupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, CourseRequisitesParser.RULE_group);
	    try {
	        this.state = 57;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,5,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 55;
	            this.or_group();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 56;
	            this.and_group();
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

CourseRequisitesParser.EOF = antlr4.Token.EOF;
CourseRequisitesParser.AND = 1;
CourseRequisitesParser.OR = 2;
CourseRequisitesParser.LPAREN = 3;
CourseRequisitesParser.RPAREN = 4;
CourseRequisitesParser.COURSE_REQUISITE = 5;
CourseRequisitesParser.WORD = 6;
CourseRequisitesParser.WS = 7;
CourseRequisitesParser.COURSE_NAME = 8;
CourseRequisitesParser.COURSE_GRADE_TEXT = 9;
CourseRequisitesParser.COURSE_GRADE = 10;
CourseRequisitesParser.COURSE_WS = 11;

CourseRequisitesParser.RULE_start = 0;
CourseRequisitesParser.RULE_course = 1;
CourseRequisitesParser.RULE_non_course = 2;
CourseRequisitesParser.RULE_requisite = 3;
CourseRequisitesParser.RULE_or_group = 4;
CourseRequisitesParser.RULE_and_group = 5;
CourseRequisitesParser.RULE_group = 6;

class StartContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_start;
    }

	group() {
	    return this.getTypedRuleContext(GroupContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequisitesParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(CourseRequisitesParser.RPAREN, 0);
	};

	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterStart(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitStart(this);
		}
	}


}



class CourseContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_course;
    }

	COURSE_REQUISITE() {
	    return this.getToken(CourseRequisitesParser.COURSE_REQUISITE, 0);
	};

	COURSE_NAME() {
	    return this.getToken(CourseRequisitesParser.COURSE_NAME, 0);
	};

	COURSE_GRADE_TEXT() {
	    return this.getToken(CourseRequisitesParser.COURSE_GRADE_TEXT, 0);
	};

	COURSE_GRADE() {
	    return this.getToken(CourseRequisitesParser.COURSE_GRADE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterCourse(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitCourse(this);
		}
	}


}



class Non_courseContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_non_course;
    }

	WORD = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequisitesParser.WORD);
	    } else {
	        return this.getToken(CourseRequisitesParser.WORD, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterNon_course(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitNon_course(this);
		}
	}


}



class RequisiteContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_requisite;
    }

	course() {
	    return this.getTypedRuleContext(CourseContext,0);
	};

	non_course() {
	    return this.getTypedRuleContext(Non_courseContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequisitesParser.LPAREN, 0);
	};

	group() {
	    return this.getTypedRuleContext(GroupContext,0);
	};

	RPAREN() {
	    return this.getToken(CourseRequisitesParser.RPAREN, 0);
	};

	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterRequisite(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitRequisite(this);
		}
	}


}



class Or_groupContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_or_group;
    }

	requisite = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(RequisiteContext);
	    } else {
	        return this.getTypedRuleContext(RequisiteContext,i);
	    }
	};

	OR = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequisitesParser.OR);
	    } else {
	        return this.getToken(CourseRequisitesParser.OR, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterOr_group(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitOr_group(this);
		}
	}


}



class And_groupContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_and_group;
    }

	requisite = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(RequisiteContext);
	    } else {
	        return this.getTypedRuleContext(RequisiteContext,i);
	    }
	};

	AND = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequisitesParser.AND);
	    } else {
	        return this.getToken(CourseRequisitesParser.AND, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterAnd_group(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitAnd_group(this);
		}
	}


}



class GroupContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_group;
    }

	or_group() {
	    return this.getTypedRuleContext(Or_groupContext,0);
	};

	and_group() {
	    return this.getTypedRuleContext(And_groupContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.enterGroup(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof CourseRequisitesParserListener ) {
	        listener.exitGroup(this);
		}
	}


}




CourseRequisitesParser.StartContext = StartContext; 
CourseRequisitesParser.CourseContext = CourseContext; 
CourseRequisitesParser.Non_courseContext = Non_courseContext; 
CourseRequisitesParser.RequisiteContext = RequisiteContext; 
CourseRequisitesParser.Or_groupContext = Or_groupContext; 
CourseRequisitesParser.And_groupContext = And_groupContext; 
CourseRequisitesParser.GroupContext = GroupContext; 
