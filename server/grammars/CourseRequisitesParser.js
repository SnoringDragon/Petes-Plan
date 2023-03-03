// Generated from CourseRequisitesParser.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';
const serializedATN = [4,1,11,73,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,
2,5,7,5,2,6,7,6,2,7,7,7,1,0,1,0,1,0,1,0,1,0,3,0,22,8,0,1,0,1,0,1,1,1,1,1,
1,1,1,1,1,1,2,4,2,32,8,2,11,2,12,2,33,1,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,43,
8,3,1,4,1,4,1,4,1,4,1,4,1,4,3,4,51,8,4,1,5,1,5,1,5,5,5,56,8,5,10,5,12,5,
59,9,5,1,6,1,6,1,6,5,6,64,8,6,10,6,12,6,67,9,6,1,7,1,7,3,7,71,8,7,1,7,0,
0,8,0,2,4,6,8,10,12,14,0,0,74,0,21,1,0,0,0,2,25,1,0,0,0,4,31,1,0,0,0,6,42,
1,0,0,0,8,50,1,0,0,0,10,52,1,0,0,0,12,60,1,0,0,0,14,70,1,0,0,0,16,22,3,14,
7,0,17,18,5,3,0,0,18,19,3,14,7,0,19,20,5,4,0,0,20,22,1,0,0,0,21,16,1,0,0,
0,21,17,1,0,0,0,22,23,1,0,0,0,23,24,5,0,0,1,24,1,1,0,0,0,25,26,5,5,0,0,26,
27,5,8,0,0,27,28,5,9,0,0,28,29,5,10,0,0,29,3,1,0,0,0,30,32,5,6,0,0,31,30,
1,0,0,0,32,33,1,0,0,0,33,31,1,0,0,0,33,34,1,0,0,0,34,5,1,0,0,0,35,43,3,2,
1,0,36,43,3,4,2,0,37,38,5,3,0,0,38,39,3,12,6,0,39,40,5,4,0,0,40,43,1,0,0,
0,41,43,3,12,6,0,42,35,1,0,0,0,42,36,1,0,0,0,42,37,1,0,0,0,42,41,1,0,0,0,
43,7,1,0,0,0,44,51,3,2,1,0,45,51,3,4,2,0,46,47,5,3,0,0,47,48,3,10,5,0,48,
49,5,4,0,0,49,51,1,0,0,0,50,44,1,0,0,0,50,45,1,0,0,0,50,46,1,0,0,0,51,9,
1,0,0,0,52,57,3,6,3,0,53,54,5,2,0,0,54,56,3,6,3,0,55,53,1,0,0,0,56,59,1,
0,0,0,57,55,1,0,0,0,57,58,1,0,0,0,58,11,1,0,0,0,59,57,1,0,0,0,60,65,3,8,
4,0,61,62,5,1,0,0,62,64,3,8,4,0,63,61,1,0,0,0,64,67,1,0,0,0,65,63,1,0,0,
0,65,66,1,0,0,0,66,13,1,0,0,0,67,65,1,0,0,0,68,71,3,12,6,0,69,71,3,10,5,
0,70,68,1,0,0,0,70,69,1,0,0,0,71,15,1,0,0,0,7,21,33,42,50,57,65,70];


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
    static ruleNames = [ "start", "course", "non_course", "and_requisite", 
                         "or_requisite", "or_group", "and_group", "group" ];

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
	        this.enterOuterAlt(localctx, 1);
	        this.state = 21;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 16;
	            this.group();
	            break;

	        case 2:
	            this.state = 17;
	            this.match(CourseRequisitesParser.LPAREN);
	            this.state = 18;
	            this.group();
	            this.state = 19;
	            this.match(CourseRequisitesParser.RPAREN);
	            break;

	        }
	        this.state = 23;
	        this.match(CourseRequisitesParser.EOF);
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
	        this.state = 25;
	        this.match(CourseRequisitesParser.COURSE_REQUISITE);
	        this.state = 26;
	        this.match(CourseRequisitesParser.COURSE_NAME);
	        this.state = 27;
	        this.match(CourseRequisitesParser.COURSE_GRADE_TEXT);
	        this.state = 28;
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
	        this.state = 31; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 30;
	            this.match(CourseRequisitesParser.WORD);
	            this.state = 33; 
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



	and_requisite() {
	    let localctx = new And_requisiteContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, CourseRequisitesParser.RULE_and_requisite);
	    try {
	        this.state = 42;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,2,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 35;
	            this.course();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 36;
	            this.non_course();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 37;
	            this.match(CourseRequisitesParser.LPAREN);
	            this.state = 38;
	            this.and_group();
	            this.state = 39;
	            this.match(CourseRequisitesParser.RPAREN);
	            break;

	        case 4:
	            this.enterOuterAlt(localctx, 4);
	            this.state = 41;
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



	or_requisite() {
	    let localctx = new Or_requisiteContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, CourseRequisitesParser.RULE_or_requisite);
	    try {
	        this.state = 50;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 5:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 44;
	            this.course();
	            break;
	        case 6:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 45;
	            this.non_course();
	            break;
	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 46;
	            this.match(CourseRequisitesParser.LPAREN);
	            this.state = 47;
	            this.or_group();
	            this.state = 48;
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
	    this.enterRule(localctx, 10, CourseRequisitesParser.RULE_or_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 52;
	        this.and_requisite();
	        this.state = 57;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===2) {
	            this.state = 53;
	            this.match(CourseRequisitesParser.OR);
	            this.state = 54;
	            this.and_requisite();
	            this.state = 59;
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
	    this.enterRule(localctx, 12, CourseRequisitesParser.RULE_and_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 60;
	        this.or_requisite();
	        this.state = 65;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        while(_la===1) {
	            this.state = 61;
	            this.match(CourseRequisitesParser.AND);
	            this.state = 62;
	            this.or_requisite();
	            this.state = 67;
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
	    this.enterRule(localctx, 14, CourseRequisitesParser.RULE_group);
	    try {
	        this.state = 70;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 68;
	            this.and_group();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 69;
	            this.or_group();
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
CourseRequisitesParser.RULE_and_requisite = 3;
CourseRequisitesParser.RULE_or_requisite = 4;
CourseRequisitesParser.RULE_or_group = 5;
CourseRequisitesParser.RULE_and_group = 6;
CourseRequisitesParser.RULE_group = 7;

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

	EOF() {
	    return this.getToken(CourseRequisitesParser.EOF, 0);
	};

	group() {
	    return this.getTypedRuleContext(GroupContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequisitesParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(CourseRequisitesParser.RPAREN, 0);
	};


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



}



class And_requisiteContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_and_requisite;
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

	and_group() {
	    return this.getTypedRuleContext(And_groupContext,0);
	};

	RPAREN() {
	    return this.getToken(CourseRequisitesParser.RPAREN, 0);
	};


}



class Or_requisiteContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequisitesParser.RULE_or_requisite;
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

	or_group() {
	    return this.getTypedRuleContext(Or_groupContext,0);
	};

	RPAREN() {
	    return this.getToken(CourseRequisitesParser.RPAREN, 0);
	};


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

	and_requisite = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(And_requisiteContext);
	    } else {
	        return this.getTypedRuleContext(And_requisiteContext,i);
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

	or_requisite = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Or_requisiteContext);
	    } else {
	        return this.getTypedRuleContext(Or_requisiteContext,i);
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

	and_group() {
	    return this.getTypedRuleContext(And_groupContext,0);
	};

	or_group() {
	    return this.getTypedRuleContext(Or_groupContext,0);
	};


}




CourseRequisitesParser.StartContext = StartContext; 
CourseRequisitesParser.CourseContext = CourseContext; 
CourseRequisitesParser.Non_courseContext = Non_courseContext; 
CourseRequisitesParser.And_requisiteContext = And_requisiteContext; 
CourseRequisitesParser.Or_requisiteContext = Or_requisiteContext; 
CourseRequisitesParser.Or_groupContext = Or_groupContext; 
CourseRequisitesParser.And_groupContext = And_groupContext; 
CourseRequisitesParser.GroupContext = GroupContext; 
