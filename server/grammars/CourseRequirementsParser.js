// Generated from CourseRequirementsParser.g4 by ANTLR 4.12.0
// jshint ignore: start
import antlr4 from 'antlr4';
const serializedATN = [4,1,24,191,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,
2,13,7,13,2,14,7,14,2,15,7,15,1,0,1,0,1,0,1,0,3,0,37,8,0,3,0,39,8,0,1,0,
1,0,1,1,1,1,3,1,45,8,1,1,1,3,1,48,8,1,1,1,3,1,51,8,1,1,1,1,1,1,2,4,2,56,
8,2,11,2,12,2,57,1,3,1,3,1,4,1,4,1,4,3,4,65,8,4,1,4,1,4,1,4,1,4,3,4,71,8,
4,1,4,1,4,3,4,75,8,4,1,5,1,5,1,5,1,5,3,5,81,8,5,3,5,83,8,5,1,6,1,6,1,6,1,
6,3,6,89,8,6,1,6,3,6,92,8,6,1,7,1,7,1,7,5,7,97,8,7,10,7,12,7,100,9,7,1,7,
1,7,3,7,104,8,7,1,7,3,7,107,8,7,1,8,1,8,1,8,5,8,112,8,8,10,8,12,8,115,9,
8,1,8,1,8,3,8,119,8,8,1,8,3,8,122,8,8,1,9,1,9,1,9,3,9,127,8,9,1,10,1,10,
1,10,1,10,1,10,1,10,4,10,135,8,10,11,10,12,10,136,1,11,1,11,1,11,1,11,1,
11,1,11,3,11,145,8,11,1,11,1,11,1,11,1,11,1,11,1,11,3,11,153,8,11,5,11,155,
8,11,10,11,12,11,158,9,11,1,12,1,12,1,12,3,12,163,8,12,1,13,1,13,1,13,1,
13,3,13,169,8,13,5,13,171,8,13,10,13,12,13,174,9,13,1,14,1,14,1,14,1,14,
3,14,180,8,14,5,14,182,8,14,10,14,12,14,185,9,14,1,15,1,15,3,15,189,8,15,
1,15,2,98,113,0,16,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,0,0,211,0,
38,1,0,0,0,2,42,1,0,0,0,4,55,1,0,0,0,6,59,1,0,0,0,8,74,1,0,0,0,10,82,1,0,
0,0,12,91,1,0,0,0,14,93,1,0,0,0,16,108,1,0,0,0,18,126,1,0,0,0,20,128,1,0,
0,0,22,138,1,0,0,0,24,162,1,0,0,0,26,164,1,0,0,0,28,175,1,0,0,0,30,188,1,
0,0,0,32,39,3,18,9,0,33,34,5,3,0,0,34,36,3,18,9,0,35,37,5,4,0,0,36,35,1,
0,0,0,36,37,1,0,0,0,37,39,1,0,0,0,38,32,1,0,0,0,38,33,1,0,0,0,39,40,1,0,
0,0,40,41,5,0,0,1,41,1,1,0,0,0,42,44,5,16,0,0,43,45,5,18,0,0,44,43,1,0,0,
0,44,45,1,0,0,0,45,47,1,0,0,0,46,48,5,19,0,0,47,46,1,0,0,0,47,48,1,0,0,0,
48,50,1,0,0,0,49,51,5,17,0,0,50,49,1,0,0,0,50,51,1,0,0,0,51,52,1,0,0,0,52,
53,5,15,0,0,53,3,1,0,0,0,54,56,5,8,0,0,55,54,1,0,0,0,56,57,1,0,0,0,57,55,
1,0,0,0,57,58,1,0,0,0,58,5,1,0,0,0,59,60,5,12,0,0,60,7,1,0,0,0,61,65,3,2,
1,0,62,65,3,6,3,0,63,65,3,4,2,0,64,61,1,0,0,0,64,62,1,0,0,0,64,63,1,0,0,
0,65,75,1,0,0,0,66,70,5,3,0,0,67,71,3,2,1,0,68,71,3,6,3,0,69,71,3,4,2,0,
70,67,1,0,0,0,70,68,1,0,0,0,70,69,1,0,0,0,71,72,1,0,0,0,72,73,5,4,0,0,73,
75,1,0,0,0,74,64,1,0,0,0,74,66,1,0,0,0,75,9,1,0,0,0,76,83,3,8,4,0,77,78,
5,3,0,0,78,80,3,16,8,0,79,81,5,4,0,0,80,79,1,0,0,0,80,81,1,0,0,0,81,83,1,
0,0,0,82,76,1,0,0,0,82,77,1,0,0,0,83,11,1,0,0,0,84,92,3,8,4,0,85,86,5,3,
0,0,86,88,3,14,7,0,87,89,5,4,0,0,88,87,1,0,0,0,88,89,1,0,0,0,89,92,1,0,0,
0,90,92,3,14,7,0,91,84,1,0,0,0,91,85,1,0,0,0,91,90,1,0,0,0,92,13,1,0,0,0,
93,98,3,10,5,0,94,95,5,2,0,0,95,97,3,10,5,0,96,94,1,0,0,0,97,100,1,0,0,0,
98,99,1,0,0,0,98,96,1,0,0,0,99,106,1,0,0,0,100,98,1,0,0,0,101,103,5,2,0,
0,102,104,5,3,0,0,103,102,1,0,0,0,103,104,1,0,0,0,104,105,1,0,0,0,105,107,
3,30,15,0,106,101,1,0,0,0,106,107,1,0,0,0,107,15,1,0,0,0,108,113,3,12,6,
0,109,110,5,1,0,0,110,112,3,12,6,0,111,109,1,0,0,0,112,115,1,0,0,0,113,114,
1,0,0,0,113,111,1,0,0,0,114,121,1,0,0,0,115,113,1,0,0,0,116,118,5,1,0,0,
117,119,5,3,0,0,118,117,1,0,0,0,118,119,1,0,0,0,119,120,1,0,0,0,120,122,
3,30,15,0,121,116,1,0,0,0,121,122,1,0,0,0,122,17,1,0,0,0,123,127,3,30,15,
0,124,127,3,14,7,0,125,127,3,16,8,0,126,123,1,0,0,0,126,124,1,0,0,0,126,
125,1,0,0,0,127,19,1,0,0,0,128,134,5,7,0,0,129,135,3,2,1,0,130,131,5,3,0,
0,131,132,3,2,1,0,132,133,5,4,0,0,133,135,1,0,0,0,134,129,1,0,0,0,134,130,
1,0,0,0,135,136,1,0,0,0,136,134,1,0,0,0,136,137,1,0,0,0,137,21,1,0,0,0,138,
144,5,7,0,0,139,145,3,2,1,0,140,141,5,3,0,0,141,142,3,2,1,0,142,143,5,4,
0,0,143,145,1,0,0,0,144,139,1,0,0,0,144,140,1,0,0,0,144,145,1,0,0,0,145,
156,1,0,0,0,146,152,5,1,0,0,147,153,3,2,1,0,148,149,5,3,0,0,149,150,3,2,
1,0,150,151,5,4,0,0,151,153,1,0,0,0,152,147,1,0,0,0,152,148,1,0,0,0,153,
155,1,0,0,0,154,146,1,0,0,0,155,158,1,0,0,0,156,154,1,0,0,0,156,157,1,0,
0,0,157,23,1,0,0,0,158,156,1,0,0,0,159,163,3,20,10,0,160,163,3,22,11,0,161,
163,3,2,1,0,162,159,1,0,0,0,162,160,1,0,0,0,162,161,1,0,0,0,163,25,1,0,0,
0,164,172,3,24,12,0,165,168,5,2,0,0,166,169,3,24,12,0,167,169,3,28,14,0,
168,166,1,0,0,0,168,167,1,0,0,0,169,171,1,0,0,0,170,165,1,0,0,0,171,174,
1,0,0,0,172,170,1,0,0,0,172,173,1,0,0,0,173,27,1,0,0,0,174,172,1,0,0,0,175,
183,3,24,12,0,176,179,5,1,0,0,177,180,3,24,12,0,178,180,3,26,13,0,179,177,
1,0,0,0,179,178,1,0,0,0,180,182,1,0,0,0,181,176,1,0,0,0,182,185,1,0,0,0,
183,181,1,0,0,0,183,184,1,0,0,0,184,29,1,0,0,0,185,183,1,0,0,0,186,189,3,
26,13,0,187,189,3,28,14,0,188,186,1,0,0,0,188,187,1,0,0,0,189,31,1,0,0,0,
31,36,38,44,47,50,57,64,70,74,80,82,88,91,98,103,106,113,118,121,126,134,
136,144,152,156,162,168,172,179,183,188];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class CourseRequirementsParser extends antlr4.Parser {

    static grammarFileName = "CourseRequirementsParser.g4";
    static literalNames = [ null, null, null, null, null, "'Student Attribute:'" ];
    static symbolicNames = [ null, "AND", "OR", "LPAREN", "RPAREN", "STUDENT_ATTRIBUTE_START", 
                             "COURSE_START", "RULE_START", "WORD", "WS0", 
                             "WORD_MODE_CONCURRENT", "WS6", "STUDENT_ATTRIBUTE", 
                             "ATTRIBUTE_CONCURRENT", "WS1", "COURSE_CONCURRENT", 
                             "COURSE_NAME", "COURSE_GRADE", "COURSE_REQUIRED_CREDITS", 
                             "COURSE_REQUIRED_COURSES", "WS2", "PRE_RULE_COURSE_START", 
                             "WS4", "RULE_END", "WS3" ];
    static ruleNames = [ "start", "course", "non_course", "student_attribute", 
                         "requirement", "and_requirement", "or_requirement", 
                         "or_group", "and_group", "group", "normal_rule", 
                         "and_rule", "rule", "or_rule_group", "and_rule_group", 
                         "rule_group" ];

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
	        this.state = 38;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
	        switch(la_) {
	        case 1:
	            this.state = 32;
	            this.group();
	            break;

	        case 2:
	            this.state = 33;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 34;
	            this.group();
	            this.state = 36;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===4) {
	                this.state = 35;
	                this.match(CourseRequirementsParser.RPAREN);
	            }

	            break;

	        }
	        this.state = 40;
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
	        this.state = 42;
	        this.match(CourseRequirementsParser.COURSE_NAME);
	        this.state = 44;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===18) {
	            this.state = 43;
	            this.match(CourseRequirementsParser.COURSE_REQUIRED_CREDITS);
	        }

	        this.state = 47;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===19) {
	            this.state = 46;
	            this.match(CourseRequirementsParser.COURSE_REQUIRED_COURSES);
	        }

	        this.state = 50;
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        if(_la===17) {
	            this.state = 49;
	            this.match(CourseRequirementsParser.COURSE_GRADE);
	        }

	        this.state = 52;
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



	non_course() {
	    let localctx = new Non_courseContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, CourseRequirementsParser.RULE_non_course);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 55; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 54;
	            this.match(CourseRequirementsParser.WORD);
	            this.state = 57; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===8);
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
	    this.enterRule(localctx, 6, CourseRequirementsParser.RULE_student_attribute);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 59;
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



	requirement() {
	    let localctx = new RequirementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, CourseRequirementsParser.RULE_requirement);
	    try {
	        this.state = 74;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 8:
	        case 12:
	        case 16:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 64;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 16:
	                this.state = 61;
	                this.course();
	                break;
	            case 12:
	                this.state = 62;
	                this.student_attribute();
	                break;
	            case 8:
	                this.state = 63;
	                this.non_course();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            break;
	        case 3:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 66;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 70;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 16:
	                this.state = 67;
	                this.course();
	                break;
	            case 12:
	                this.state = 68;
	                this.student_attribute();
	                break;
	            case 8:
	                this.state = 69;
	                this.non_course();
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 72;
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
	    this.enterRule(localctx, 10, CourseRequirementsParser.RULE_and_requirement);
	    try {
	        this.state = 82;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 76;
	            this.requirement();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 77;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 78;
	            this.and_group();
	            this.state = 80;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,9,this._ctx);
	            if(la_===1) {
	                this.state = 79;
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
	    this.enterRule(localctx, 12, CourseRequirementsParser.RULE_or_requirement);
	    try {
	        this.state = 91;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 84;
	            this.requirement();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 85;
	            this.match(CourseRequirementsParser.LPAREN);
	            this.state = 86;
	            this.or_group();
	            this.state = 88;
	            this._errHandler.sync(this);
	            var la_ = this._interp.adaptivePredict(this._input,11,this._ctx);
	            if(la_===1) {
	                this.state = 87;
	                this.match(CourseRequirementsParser.RPAREN);

	            }
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 90;
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
	    this.enterRule(localctx, 14, CourseRequirementsParser.RULE_or_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 93;
	        this.and_requirement();
	        this.state = 98;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,13,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 94;
	                this.match(CourseRequirementsParser.OR);
	                this.state = 95;
	                this.and_requirement(); 
	            }
	            this.state = 100;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,13,this._ctx);
	        }

	        this.state = 106;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,15,this._ctx);
	        if(la_===1) {
	            this.state = 101;
	            this.match(CourseRequirementsParser.OR);
	            this.state = 103;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===3) {
	                this.state = 102;
	                this.match(CourseRequirementsParser.LPAREN);
	            }

	            this.state = 105;
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
	    this.enterRule(localctx, 16, CourseRequirementsParser.RULE_and_group);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 108;
	        this.or_requirement();
	        this.state = 113;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,16,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 109;
	                this.match(CourseRequirementsParser.AND);
	                this.state = 110;
	                this.or_requirement(); 
	            }
	            this.state = 115;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,16,this._ctx);
	        }

	        this.state = 121;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,18,this._ctx);
	        if(la_===1) {
	            this.state = 116;
	            this.match(CourseRequirementsParser.AND);
	            this.state = 118;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            if(_la===3) {
	                this.state = 117;
	                this.match(CourseRequirementsParser.LPAREN);
	            }

	            this.state = 120;
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
	    this.enterRule(localctx, 18, CourseRequirementsParser.RULE_group);
	    try {
	        this.state = 126;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,19,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 123;
	            this.rule_group();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 124;
	            this.or_group();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 125;
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
	    this.enterRule(localctx, 20, CourseRequirementsParser.RULE_normal_rule);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 128;
	        this.match(CourseRequirementsParser.RULE_START);
	        this.state = 134; 
	        this._errHandler.sync(this);
	        _la = this._input.LA(1);
	        do {
	            this.state = 134;
	            this._errHandler.sync(this);
	            switch(this._input.LA(1)) {
	            case 16:
	                this.state = 129;
	                this.course();
	                break;
	            case 3:
	                this.state = 130;
	                this.match(CourseRequirementsParser.LPAREN);
	                this.state = 131;
	                this.course();
	                this.state = 132;
	                this.match(CourseRequirementsParser.RPAREN);
	                break;
	            default:
	                throw new antlr4.error.NoViableAltException(this);
	            }
	            this.state = 136; 
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	        } while(_la===3 || _la===16);
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
	    this.enterRule(localctx, 22, CourseRequirementsParser.RULE_and_rule);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 138;
	        this.match(CourseRequirementsParser.RULE_START);
	        this.state = 144;
	        this._errHandler.sync(this);
	        switch (this._input.LA(1)) {
	        case 16:
	        	this.state = 139;
	        	this.course();
	        	break;
	        case 3:
	        	this.state = 140;
	        	this.match(CourseRequirementsParser.LPAREN);
	        	this.state = 141;
	        	this.course();
	        	this.state = 142;
	        	this.match(CourseRequirementsParser.RPAREN);
	        	break;
	        case -1:
	        case 1:
	        case 2:
	        case 4:
	        	break;
	        default:
	        	break;
	        }
	        this.state = 156;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,24,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 146;
	                this.match(CourseRequirementsParser.AND);
	                this.state = 152;
	                this._errHandler.sync(this);
	                switch(this._input.LA(1)) {
	                case 16:
	                    this.state = 147;
	                    this.course();
	                    break;
	                case 3:
	                    this.state = 148;
	                    this.match(CourseRequirementsParser.LPAREN);
	                    this.state = 149;
	                    this.course();
	                    this.state = 150;
	                    this.match(CourseRequirementsParser.RPAREN);
	                    break;
	                default:
	                    throw new antlr4.error.NoViableAltException(this);
	                } 
	            }
	            this.state = 158;
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



	rule_() {
	    let localctx = new RuleContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 24, CourseRequirementsParser.RULE_rule);
	    try {
	        this.state = 162;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,25,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 159;
	            this.normal_rule();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 160;
	            this.and_rule();
	            break;

	        case 3:
	            this.enterOuterAlt(localctx, 3);
	            this.state = 161;
	            this.course();
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
	    this.enterRule(localctx, 26, CourseRequirementsParser.RULE_or_rule_group);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 164;
	        this.rule_();
	        this.state = 172;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,27,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 165;
	                this.match(CourseRequirementsParser.OR);
	                this.state = 168;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,26,this._ctx);
	                switch(la_) {
	                case 1:
	                    this.state = 166;
	                    this.rule_();
	                    break;

	                case 2:
	                    this.state = 167;
	                    this.and_rule_group();
	                    break;

	                } 
	            }
	            this.state = 174;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,27,this._ctx);
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



	and_rule_group() {
	    let localctx = new And_rule_groupContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 28, CourseRequirementsParser.RULE_and_rule_group);
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 175;
	        this.rule_();
	        this.state = 183;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,29,this._ctx)
	        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1) {
	                this.state = 176;
	                this.match(CourseRequirementsParser.AND);
	                this.state = 179;
	                this._errHandler.sync(this);
	                var la_ = this._interp.adaptivePredict(this._input,28,this._ctx);
	                switch(la_) {
	                case 1:
	                    this.state = 177;
	                    this.rule_();
	                    break;

	                case 2:
	                    this.state = 178;
	                    this.or_rule_group();
	                    break;

	                } 
	            }
	            this.state = 185;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,29,this._ctx);
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
	    this.enterRule(localctx, 30, CourseRequirementsParser.RULE_rule_group);
	    try {
	        this.state = 188;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,30,this._ctx);
	        switch(la_) {
	        case 1:
	            this.enterOuterAlt(localctx, 1);
	            this.state = 186;
	            this.or_rule_group();
	            break;

	        case 2:
	            this.enterOuterAlt(localctx, 2);
	            this.state = 187;
	            this.and_rule_group();
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

CourseRequirementsParser.EOF = antlr4.Token.EOF;
CourseRequirementsParser.AND = 1;
CourseRequirementsParser.OR = 2;
CourseRequirementsParser.LPAREN = 3;
CourseRequirementsParser.RPAREN = 4;
CourseRequirementsParser.STUDENT_ATTRIBUTE_START = 5;
CourseRequirementsParser.COURSE_START = 6;
CourseRequirementsParser.RULE_START = 7;
CourseRequirementsParser.WORD = 8;
CourseRequirementsParser.WS0 = 9;
CourseRequirementsParser.WORD_MODE_CONCURRENT = 10;
CourseRequirementsParser.WS6 = 11;
CourseRequirementsParser.STUDENT_ATTRIBUTE = 12;
CourseRequirementsParser.ATTRIBUTE_CONCURRENT = 13;
CourseRequirementsParser.WS1 = 14;
CourseRequirementsParser.COURSE_CONCURRENT = 15;
CourseRequirementsParser.COURSE_NAME = 16;
CourseRequirementsParser.COURSE_GRADE = 17;
CourseRequirementsParser.COURSE_REQUIRED_CREDITS = 18;
CourseRequirementsParser.COURSE_REQUIRED_COURSES = 19;
CourseRequirementsParser.WS2 = 20;
CourseRequirementsParser.PRE_RULE_COURSE_START = 21;
CourseRequirementsParser.WS4 = 22;
CourseRequirementsParser.RULE_END = 23;
CourseRequirementsParser.WS3 = 24;

CourseRequirementsParser.RULE_start = 0;
CourseRequirementsParser.RULE_course = 1;
CourseRequirementsParser.RULE_non_course = 2;
CourseRequirementsParser.RULE_student_attribute = 3;
CourseRequirementsParser.RULE_requirement = 4;
CourseRequirementsParser.RULE_and_requirement = 5;
CourseRequirementsParser.RULE_or_requirement = 6;
CourseRequirementsParser.RULE_or_group = 7;
CourseRequirementsParser.RULE_and_group = 8;
CourseRequirementsParser.RULE_group = 9;
CourseRequirementsParser.RULE_normal_rule = 10;
CourseRequirementsParser.RULE_and_rule = 11;
CourseRequirementsParser.RULE_rule = 12;
CourseRequirementsParser.RULE_or_rule_group = 13;
CourseRequirementsParser.RULE_and_rule_group = 14;
CourseRequirementsParser.RULE_rule_group = 15;

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

	COURSE_REQUIRED_CREDITS() {
	    return this.getToken(CourseRequirementsParser.COURSE_REQUIRED_CREDITS, 0);
	};

	COURSE_REQUIRED_COURSES() {
	    return this.getToken(CourseRequirementsParser.COURSE_REQUIRED_COURSES, 0);
	};

	COURSE_GRADE() {
	    return this.getToken(CourseRequirementsParser.COURSE_GRADE, 0);
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
        this.ruleIndex = CourseRequirementsParser.RULE_non_course;
    }

	WORD = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(CourseRequirementsParser.WORD);
	    } else {
	        return this.getToken(CourseRequirementsParser.WORD, i);
	    }
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



class RequirementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_requirement;
    }

	course() {
	    return this.getTypedRuleContext(CourseContext,0);
	};

	student_attribute() {
	    return this.getTypedRuleContext(Student_attributeContext,0);
	};

	non_course() {
	    return this.getTypedRuleContext(Non_courseContext,0);
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

	requirement() {
	    return this.getTypedRuleContext(RequirementContext,0);
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

	requirement() {
	    return this.getTypedRuleContext(RequirementContext,0);
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

	course() {
	    return this.getTypedRuleContext(CourseContext,0);
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


	and_rule_group = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(And_rule_groupContext);
	    } else {
	        return this.getTypedRuleContext(And_rule_groupContext,i);
	    }
	};


}



class And_rule_groupContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = CourseRequirementsParser.RULE_and_rule_group;
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

	or_rule_group() {
	    return this.getTypedRuleContext(Or_rule_groupContext,0);
	};

	and_rule_group() {
	    return this.getTypedRuleContext(And_rule_groupContext,0);
	};


}




CourseRequirementsParser.StartContext = StartContext; 
CourseRequirementsParser.CourseContext = CourseContext; 
CourseRequirementsParser.Non_courseContext = Non_courseContext; 
CourseRequirementsParser.Student_attributeContext = Student_attributeContext; 
CourseRequirementsParser.RequirementContext = RequirementContext; 
CourseRequirementsParser.And_requirementContext = And_requirementContext; 
CourseRequirementsParser.Or_requirementContext = Or_requirementContext; 
CourseRequirementsParser.Or_groupContext = Or_groupContext; 
CourseRequirementsParser.And_groupContext = And_groupContext; 
CourseRequirementsParser.GroupContext = GroupContext; 
CourseRequirementsParser.Normal_ruleContext = Normal_ruleContext; 
CourseRequirementsParser.And_ruleContext = And_ruleContext; 
CourseRequirementsParser.RuleContext = RuleContext; 
CourseRequirementsParser.Or_rule_groupContext = Or_rule_groupContext; 
CourseRequirementsParser.And_rule_groupContext = And_rule_groupContext; 
CourseRequirementsParser.Rule_groupContext = Rule_groupContext; 
