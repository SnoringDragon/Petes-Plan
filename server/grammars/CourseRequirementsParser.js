// Generated from CourseRequirementsParser.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';
const serializedATN = [4,1,18,158,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,1,0,1,0,1,0,1,0,3,0,33,8,0,3,0,35,8,0,1,0,1,0,1,1,1,1,3,1,41,8,
1,1,1,1,1,1,2,1,2,1,3,1,3,3,3,49,8,3,1,3,1,3,1,3,3,3,54,8,3,1,3,1,3,3,3,
58,8,3,1,4,1,4,1,4,1,4,3,4,64,8,4,3,4,66,8,4,1,5,1,5,1,5,1,5,3,5,72,8,5,
1,5,3,5,75,8,5,1,6,1,6,1,6,5,6,80,8,6,10,6,12,6,83,9,6,1,6,1,6,3,6,87,8,
6,1,6,3,6,90,8,6,1,7,1,7,1,7,5,7,95,8,7,10,7,12,7,98,9,7,1,7,1,7,3,7,102,
8,7,1,7,3,7,105,8,7,1,8,1,8,1,8,3,8,110,8,8,1,9,1,9,1,9,1,9,1,9,1,9,4,9,
118,8,9,11,9,12,9,119,1,10,1,10,1,10,1,10,1,10,1,10,1,10,3,10,129,8,10,4,
10,131,8,10,11,10,12,10,132,1,11,1,11,3,11,137,8,11,1,12,1,12,1,12,5,12,
142,8,12,10,12,12,12,145,9,12,1,13,1,13,1,13,1,13,3,13,151,8,13,5,13,153,
8,13,10,13,12,13,156,9,13,1,13,2,81,96,0,14,0,2,4,6,8,10,12,14,16,18,20,
22,24,26,0,0,170,0,34,1,0,0,0,2,38,1,0,0,0,4,44,1,0,0,0,6,57,1,0,0,0,8,65,
1,0,0,0,10,74,1,0,0,0,12,76,1,0,0,0,14,91,1,0,0,0,16,109,1,0,0,0,18,111,
1,0,0,0,20,121,1,0,0,0,22,136,1,0,0,0,24,138,1,0,0,0,26,146,1,0,0,0,28,35,
3,16,8,0,29,30,5,3,0,0,30,32,3,16,8,0,31,33,5,4,0,0,32,31,1,0,0,0,32,33,
1,0,0,0,33,35,1,0,0,0,34,28,1,0,0,0,34,29,1,0,0,0,35,36,1,0,0,0,36,37,5,
0,0,1,37,1,1,0,0,0,38,40,5,13,0,0,39,41,5,14,0,0,40,39,1,0,0,0,40,41,1,0,
0,0,41,42,1,0,0,0,42,43,5,12,0,0,43,3,1,0,0,0,44,45,5,9,0,0,45,5,1,0,0,0,
46,49,3,2,1,0,47,49,3,4,2,0,48,46,1,0,0,0,48,47,1,0,0,0,49,58,1,0,0,0,50,
53,5,3,0,0,51,54,3,2,1,0,52,54,3,4,2,0,53,51,1,0,0,0,53,52,1,0,0,0,54,55,
1,0,0,0,55,56,5,4,0,0,56,58,1,0,0,0,57,48,1,0,0,0,57,50,1,0,0,0,58,7,1,0,
0,0,59,66,3,6,3,0,60,61,5,3,0,0,61,63,3,14,7,0,62,64,5,4,0,0,63,62,1,0,0,
0,63,64,1,0,0,0,64,66,1,0,0,0,65,59,1,0,0,0,65,60,1,0,0,0,66,9,1,0,0,0,67,
75,3,6,3,0,68,69,5,3,0,0,69,71,3,12,6,0,70,72,5,4,0,0,71,70,1,0,0,0,71,72,
1,0,0,0,72,75,1,0,0,0,73,75,3,12,6,0,74,67,1,0,0,0,74,68,1,0,0,0,74,73,1,
0,0,0,75,11,1,0,0,0,76,81,3,8,4,0,77,78,5,2,0,0,78,80,3,8,4,0,79,77,1,0,
0,0,80,83,1,0,0,0,81,82,1,0,0,0,81,79,1,0,0,0,82,89,1,0,0,0,83,81,1,0,0,
0,84,86,5,2,0,0,85,87,5,3,0,0,86,85,1,0,0,0,86,87,1,0,0,0,87,88,1,0,0,0,
88,90,3,26,13,0,89,84,1,0,0,0,89,90,1,0,0,0,90,13,1,0,0,0,91,96,3,10,5,0,
92,93,5,1,0,0,93,95,3,10,5,0,94,92,1,0,0,0,95,98,1,0,0,0,96,97,1,0,0,0,96,
94,1,0,0,0,97,104,1,0,0,0,98,96,1,0,0,0,99,101,5,1,0,0,100,102,5,3,0,0,101,
100,1,0,0,0,101,102,1,0,0,0,102,103,1,0,0,0,103,105,3,26,13,0,104,99,1,0,
0,0,104,105,1,0,0,0,105,15,1,0,0,0,106,110,3,26,13,0,107,110,3,12,6,0,108,
110,3,14,7,0,109,106,1,0,0,0,109,107,1,0,0,0,109,108,1,0,0,0,110,17,1,0,
0,0,111,117,5,7,0,0,112,118,3,2,1,0,113,114,5,3,0,0,114,115,3,2,1,0,115,
116,5,4,0,0,116,118,1,0,0,0,117,112,1,0,0,0,117,113,1,0,0,0,118,119,1,0,
0,0,119,117,1,0,0,0,119,120,1,0,0,0,120,19,1,0,0,0,121,130,5,7,0,0,122,128,
5,1,0,0,123,129,3,2,1,0,124,125,5,3,0,0,125,126,3,2,1,0,126,127,5,4,0,0,
127,129,1,0,0,0,128,123,1,0,0,0,128,124,1,0,0,0,129,131,1,0,0,0,130,122,
1,0,0,0,131,132,1,0,0,0,132,130,1,0,0,0,132,133,1,0,0,0,133,21,1,0,0,0,134,
137,3,18,9,0,135,137,3,20,10,0,136,134,1,0,0,0,136,135,1,0,0,0,137,23,1,
0,0,0,138,143,3,22,11,0,139,140,5,2,0,0,140,142,3,22,11,0,141,139,1,0,0,
0,142,145,1,0,0,0,143,141,1,0,0,0,143,144,1,0,0,0,144,25,1,0,0,0,145,143,
1,0,0,0,146,154,3,22,11,0,147,150,5,1,0,0,148,151,3,22,11,0,149,151,3,24,
12,0,150,148,1,0,0,0,150,149,1,0,0,0,151,153,1,0,0,0,152,147,1,0,0,0,153,
156,1,0,0,0,154,152,1,0,0,0,154,155,1,0,0,0,155,27,1,0,0,0,156,154,1,0,0,
0,25,32,34,40,48,53,57,63,65,71,74,81,86,89,96,101,104,109,117,119,128,132,
136,143,150,154];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class CourseRequirementsParser extends antlr4.Parser {

    static grammarFileName = "CourseRequirementsParser.g4";
    static literalNames = [ null, null, null, null, null, "'Student Attribute:'", 
                            "'Course or Test:'" ];
    static symbolicNames = [ null, "AND", "OR", "LPAREN", "RPAREN", "STUDENT_ATTRIBUTE_START", 
                             "COURSE_START", "RULE_START", "WS0", "STUDENT_ATTRIBUTE", 
                             "ATTRIBUTE_CONCURRENT", "WS1", "COURSE_CONCURRENT", 
                             "COURSE_NAME", "COURSE_GRADE", "WS2", "WS4", 
                             "RULE_END", "WS3" ];
    static ruleNames = [ "start", "course", "student_attribute", "course_or_attribute", 
                         "and_requirement", "or_requirement", "or_group", 
                         "and_group", "group", "normal_rule", "and_rule", 
                         "rule", "or_rule_group", "rule_group" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = CourseRequirementsParser.ruleNames;
        this.literalNames = CourseRequirementsParser.literalNames;
        this.symbolicNames = CourseRequirementsParser.symbolicNames;
    }



	start() {
	    let localctx = new StartContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, CourseRequirementsParser.RULE_start);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 34;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 28;
	            this.group();
	            break;

	        case 2:
	            this.state = 29;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 30;
	            this.group();
	            this.state = 32;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===4) {
	                this.state = 31;
	                this.match(CourseRequirementsParser.RPAREN);
	            }

	            break;

	        }
	        this.state = 36;
	        this.match(CourseRequirementsParser.EOF);
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
	    this.enterRule(localctx, 2, CourseRequirementsParser.RULE_course);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 38;
	        this.match(CourseRequirementsParser.COURSE_NAME);
	        this.state = 40;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===14) {
	            this.state = 39;
	            this.match(CourseRequirementsParser.COURSE_GRADE);
	        }

	        this.state = 42;
	        this.match(CourseRequirementsParser.COURSE_CONCURRENT);
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



	student_attribute() {
	    let localctx = new Student_attributeContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, CourseRequirementsParser.RULE_student_attribute);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 44;
	        this.match(CourseRequirementsParser.STUDENT_ATTRIBUTE);
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



	course_or_attribute() {
	    let localctx = new Course_or_attributeContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, CourseRequirementsParser.RULE_course_or_attribute);
	    try {
	        this.state = 57;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 9:
	        case 13:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 48;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 13:
	                this.state = 46;
	                this.course();
	                break;
	            case 9:
	                this.state = 47;
	                this.student_attribute();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            break;
	        case 3:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 50;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 53;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 13:
	                this.state = 51;
	                this.course();
	                break;
	            case 9:
	                this.state = 52;
	                this.student_attribute();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 55;
	            this.match(CourseRequirementsParser.RPAREN);
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



	and_requirement() {
	    let localctx = new And_requirementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, CourseRequirementsParser.RULE_and_requirement);
	    try {
	        this.state = 65;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,7,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 59;
	            this.course_or_attribute();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 60;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 61;
	            this.and_group();
	            this.state = 63;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
	            if(la_===1) {
	                this.state = 62;
	                this.match(CourseRequirementsParser.RPAREN);

	            }
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



	or_requirement() {
	    let localctx = new Or_requirementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, CourseRequirementsParser.RULE_or_requirement);
	    try {
	        this.state = 74;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 67;
	            this.course_or_attribute();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 68;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 69;
	            this.or_group();
	            this.state = 71;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,8,this._ctx);
	            if(la_===1) {
	                this.state = 70;
	                this.match(CourseRequirementsParser.RPAREN);

	            }
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 73;
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



	or_group() {
	    let localctx = new Or_groupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, CourseRequirementsParser.RULE_or_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 76;
	        this.and_requirement();
	        this.state = 81;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,10,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 77;
	                this.match(CourseRequirementsParser.OR);
	                this.state = 78;
	                this.and_requirement(); 
	            }
	            this.state = 83;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,10,this._ctx);
	        }

	        this.state = 89;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
	        if(la_===1) {
	            this.state = 84;
	            this.match(CourseRequirementsParser.OR);
	            this.state = 86;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===3) {
	                this.state = 85;
	                this.match(CourseRequirementsParser.LPAREN);
	            }

	            this.state = 88;
	            this.rule_group();

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
	    this.enterRule(localctx, 14, CourseRequirementsParser.RULE_and_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 91;
	        this.or_requirement();
	        this.state = 96;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,13,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 92;
	                this.match(CourseRequirementsParser.AND);
	                this.state = 93;
	                this.or_requirement(); 
	            }
	            this.state = 98;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,13,this._ctx);
	        }

	        this.state = 104;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	        if(la_===1) {
	            this.state = 99;
	            this.match(CourseRequirementsParser.AND);
	            this.state = 101;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===3) {
	                this.state = 100;
	                this.match(CourseRequirementsParser.LPAREN);
	            }

	            this.state = 103;
	            this.rule_group();

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
	    this.enterRule(localctx, 16, CourseRequirementsParser.RULE_group);
	    try {
	        this.state = 109;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,16,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 106;
	            this.rule_group();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 107;
	            this.or_group();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 108;
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



	normal_rule() {
	    let localctx = new Normal_ruleContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, CourseRequirementsParser.RULE_normal_rule);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 111;
	        this.match(CourseRequirementsParser.RULE_START);
	        this.state = 117; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 117;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 13:
	                this.state = 112;
	                this.course();
	                break;
	            case 3:
	                this.state = 113;
	                this.match(CourseRequirementsParser.LPAREN);
	                this.state = 114;
	                this.course();
	                this.state = 115;
	                this.match(CourseRequirementsParser.RPAREN);
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 119; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===3 || _la===13);
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



	and_rule() {
	    let localctx = new And_ruleContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 20, CourseRequirementsParser.RULE_and_rule);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 121;
	        this.match(CourseRequirementsParser.RULE_START);
	        this.state = 130; 
	        this._errHandler.sync(this);
	        var _alt = 1;
	        do {
	        	switch (_alt) {
	        	case 1:
	        		this.state = 122;
	        		this.match(CourseRequirementsParser.AND);
	        		this.state = 128;
	        		this._errHandler.sync(this);
	        		switch(this._input.LA(1)) {
	        		case 13:
	        		    this.state = 123;
	        		    this.course();
	        		    break;
	        		case 3:
	        		    this.state = 124;
	        		    this.match(CourseRequirementsParser.LPAREN);
	        		    this.state = 125;
	        		    this.course();
	        		    this.state = 126;
	        		    this.match(CourseRequirementsParser.RPAREN);
	        		    break;
	        		default:
	        		    throw new antlr4.error.NoViableAltException(this);
	        		}
	        		break;
	        	default:
	        		throw new antlr4.error.NoViableAltException(this);
	        	}
	        	this.state = 132; 
	        	this._errHandler.sync(this);
	        	_alt = this._interp.adaptivePredict(this._input,20, this._ctx);
	        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
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



	rule_() {
	    let localctx = new RuleContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 22, CourseRequirementsParser.RULE_rule);
	    try {
	        this.state = 136;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,21,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 134;
	            this.normal_rule();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 135;
	            this.and_rule();
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



	or_rule_group() {
	    let localctx = new Or_rule_groupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, CourseRequirementsParser.RULE_or_rule_group);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 138;
	        this.rule_();
	        this.state = 143;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,22,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 139;
	                this.match(CourseRequirementsParser.OR);
	                this.state = 140;
	                this.rule_(); 
	            }
	            this.state = 145;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,22,this._ctx);
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



	rule_group() {
	    let localctx = new Rule_groupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 26, CourseRequirementsParser.RULE_rule_group);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 146;
	        this.rule_();
	        this.state = 154;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,24,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 147;
	                this.match(CourseRequirementsParser.AND);
	                this.state = 150;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,23,this._ctx);
	                switch(la_) {
	                case 1:
	                    this.state = 148;
	                    this.rule_();
	                    break;

	                case 2:
	                    this.state = 149;
	                    this.or_rule_group();
	                    break;

	                } 
	            }
	            this.state = 156;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,24,this._ctx);
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

CourseRequirementsParser.EOF = antlr4.Token.EOF;
CourseRequirementsParser.AND = 1;
CourseRequirementsParser.OR = 2;
CourseRequirementsParser.LPAREN = 3;
CourseRequirementsParser.RPAREN = 4;
CourseRequirementsParser.STUDENT_ATTRIBUTE_START = 5;
CourseRequirementsParser.COURSE_START = 6;
CourseRequirementsParser.RULE_START = 7;
CourseRequirementsParser.WS0 = 8;
CourseRequirementsParser.STUDENT_ATTRIBUTE = 9;
CourseRequirementsParser.ATTRIBUTE_CONCURRENT = 10;
CourseRequirementsParser.WS1 = 11;
CourseRequirementsParser.COURSE_CONCURRENT = 12;
CourseRequirementsParser.COURSE_NAME = 13;
CourseRequirementsParser.COURSE_GRADE = 14;
CourseRequirementsParser.WS2 = 15;
CourseRequirementsParser.WS4 = 16;
CourseRequirementsParser.RULE_END = 17;
CourseRequirementsParser.WS3 = 18;

CourseRequirementsParser.RULE_start = 0;
CourseRequirementsParser.RULE_course = 1;
CourseRequirementsParser.RULE_student_attribute = 2;
CourseRequirementsParser.RULE_course_or_attribute = 3;
CourseRequirementsParser.RULE_and_requirement = 4;
CourseRequirementsParser.RULE_or_requirement = 5;
CourseRequirementsParser.RULE_or_group = 6;
CourseRequirementsParser.RULE_and_group = 7;
CourseRequirementsParser.RULE_group = 8;
CourseRequirementsParser.RULE_normal_rule = 9;
CourseRequirementsParser.RULE_and_rule = 10;
CourseRequirementsParser.RULE_rule = 11;
CourseRequirementsParser.RULE_or_rule_group = 12;
CourseRequirementsParser.RULE_rule_group = 13;

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
        this.ruleIndex = CourseRequirementsParser.RULE_start;
    }

	EOF() {
	    return this.getToken(CourseRequirementsParser.EOF, 0);
	};

	group() {
	    return this.getTypedRuleContext(GroupContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequirementsParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(CourseRequirementsParser.RPAREN, 0);
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
        this.ruleIndex = CourseRequirementsParser.RULE_course;
    }

	COURSE_NAME() {
	    return this.getToken(CourseRequirementsParser.COURSE_NAME, 0);
	};

	COURSE_CONCURRENT() {
	    return this.getToken(CourseRequirementsParser.COURSE_CONCURRENT, 0);
	};

	COURSE_GRADE() {
	    return this.getToken(CourseRequirementsParser.COURSE_GRADE, 0);
	};


}



class Student_attributeContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_student_attribute;
    }

	STUDENT_ATTRIBUTE() {
	    return this.getToken(CourseRequirementsParser.STUDENT_ATTRIBUTE, 0);
	};


}



class Course_or_attributeContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_course_or_attribute;
    }

	course() {
	    return this.getTypedRuleContext(CourseContext,0);
	};

	student_attribute() {
	    return this.getTypedRuleContext(Student_attributeContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequirementsParser.LPAREN, 0);
	};

	RPAREN() {
	    return this.getToken(CourseRequirementsParser.RPAREN, 0);
	};


}



class And_requirementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_and_requirement;
    }

	course_or_attribute() {
	    return this.getTypedRuleContext(Course_or_attributeContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequirementsParser.LPAREN, 0);
	};

	and_group() {
	    return this.getTypedRuleContext(And_groupContext,0);
	};

	RPAREN() {
	    return this.getToken(CourseRequirementsParser.RPAREN, 0);
	};


}



class Or_requirementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_or_requirement;
    }

	course_or_attribute() {
	    return this.getTypedRuleContext(Course_or_attributeContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequirementsParser.LPAREN, 0);
	};

	or_group() {
	    return this.getTypedRuleContext(Or_groupContext,0);
	};

	RPAREN() {
	    return this.getToken(CourseRequirementsParser.RPAREN, 0);
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
        this.ruleIndex = CourseRequirementsParser.RULE_or_group;
    }

	and_requirement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(And_requirementContext);
	    } else {
	        return this.getTypedRuleContext(And_requirementContext,i);
	    }
	};

	OR = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.OR);
	    } else {
	        return this.getToken(CourseRequirementsParser.OR, i);
	    }
	};


	rule_group() {
	    return this.getTypedRuleContext(Rule_groupContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequirementsParser.LPAREN, 0);
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
        this.ruleIndex = CourseRequirementsParser.RULE_and_group;
    }

	or_requirement = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Or_requirementContext);
	    } else {
	        return this.getTypedRuleContext(Or_requirementContext,i);
	    }
	};

	AND = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.AND);
	    } else {
	        return this.getToken(CourseRequirementsParser.AND, i);
	    }
	};


	rule_group() {
	    return this.getTypedRuleContext(Rule_groupContext,0);
	};

	LPAREN() {
	    return this.getToken(CourseRequirementsParser.LPAREN, 0);
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
        this.ruleIndex = CourseRequirementsParser.RULE_group;
    }

	rule_group() {
	    return this.getTypedRuleContext(Rule_groupContext,0);
	};

	or_group() {
	    return this.getTypedRuleContext(Or_groupContext,0);
	};

	and_group() {
	    return this.getTypedRuleContext(And_groupContext,0);
	};


}



class Normal_ruleContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_normal_rule;
    }

	RULE_START() {
	    return this.getToken(CourseRequirementsParser.RULE_START, 0);
	};

	course = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(CourseContext);
	    } else {
	        return this.getTypedRuleContext(CourseContext,i);
	    }
	};

	LPAREN = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.LPAREN);
	    } else {
	        return this.getToken(CourseRequirementsParser.LPAREN, i);
	    }
	};


	RPAREN = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.RPAREN);
	    } else {
	        return this.getToken(CourseRequirementsParser.RPAREN, i);
	    }
	};



}



class And_ruleContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_and_rule;
    }

	RULE_START() {
	    return this.getToken(CourseRequirementsParser.RULE_START, 0);
	};

	AND = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.AND);
	    } else {
	        return this.getToken(CourseRequirementsParser.AND, i);
	    }
	};


	course = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(CourseContext);
	    } else {
	        return this.getTypedRuleContext(CourseContext,i);
	    }
	};

	LPAREN = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.LPAREN);
	    } else {
	        return this.getToken(CourseRequirementsParser.LPAREN, i);
	    }
	};


	RPAREN = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.RPAREN);
	    } else {
	        return this.getToken(CourseRequirementsParser.RPAREN, i);
	    }
	};



}



class RuleContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_rule;
    }

	normal_rule() {
	    return this.getTypedRuleContext(Normal_ruleContext,0);
	};

	and_rule() {
	    return this.getTypedRuleContext(And_ruleContext,0);
	};


}



class Or_rule_groupContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_or_rule_group;
    }

	rule_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(RuleContext);
	    } else {
	        return this.getTypedRuleContext(RuleContext,i);
	    }
	};

	OR = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.OR);
	    } else {
	        return this.getToken(CourseRequirementsParser.OR, i);
	    }
	};



}



class Rule_groupContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_rule_group;
    }

	rule_ = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(RuleContext);
	    } else {
	        return this.getTypedRuleContext(RuleContext,i);
	    }
	};

	AND = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.AND);
	    } else {
	        return this.getToken(CourseRequirementsParser.AND, i);
	    }
	};


	or_rule_group = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(Or_rule_groupContext);
	    } else {
	        return this.getTypedRuleContext(Or_rule_groupContext,i);
	    }
	};


}




CourseRequirementsParser.StartContext = StartContext; 
CourseRequirementsParser.CourseContext = CourseContext; 
CourseRequirementsParser.Student_attributeContext = Student_attributeContext; 
CourseRequirementsParser.Course_or_attributeContext = Course_or_attributeContext; 
CourseRequirementsParser.And_requirementContext = And_requirementContext; 
CourseRequirementsParser.Or_requirementContext = Or_requirementContext; 
CourseRequirementsParser.Or_groupContext = Or_groupContext; 
CourseRequirementsParser.And_groupContext = And_groupContext; 
CourseRequirementsParser.GroupContext = GroupContext; 
CourseRequirementsParser.Normal_ruleContext = Normal_ruleContext; 
CourseRequirementsParser.And_ruleContext = And_ruleContext; 
CourseRequirementsParser.RuleContext = RuleContext; 
CourseRequirementsParser.Or_rule_groupContext = Or_rule_groupContext; 
CourseRequirementsParser.Rule_groupContext = Rule_groupContext; 
