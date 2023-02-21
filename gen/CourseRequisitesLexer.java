// Generated from java-escape by ANTLR 4.11.1
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class CourseRequisitesLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.11.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		AND=1, OR=2, LPAREN=3, RPAREN=4, COURSE_REQUISITE=5, WORD=6, WS=7, COURSE_NAME=8, 
		COURSE_GRADE_TEXT=9, COURSE_GRADE=10, COURSE_WS=11;
	public static final int
		COURSE_MODE=1;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE", "COURSE_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"Ws", "AND", "OR", "LPAREN", "RPAREN", "COURSE_REQUISITE", "WORD", "WS", 
			"COURSE_NAME", "COURSE_GRADE_TEXT", "COURSE_GRADE", "COURSE_WS"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'and'", "'or'", "'('", "')'", "'Undergraduate level'", null, null, 
			null, "'Minimum Grade of'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "AND", "OR", "LPAREN", "RPAREN", "COURSE_REQUISITE", "WORD", "WS", 
			"COURSE_NAME", "COURSE_GRADE_TEXT", "COURSE_GRADE", "COURSE_WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	public CourseRequisitesLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "CourseRequisitesLexer.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\u0004\u0000\u000b\u008e\u0006\uffff\uffff\u0006\uffff\uffff\u0002\u0000"+
		"\u0007\u0000\u0002\u0001\u0007\u0001\u0002\u0002\u0007\u0002\u0002\u0003"+
		"\u0007\u0003\u0002\u0004\u0007\u0004\u0002\u0005\u0007\u0005\u0002\u0006"+
		"\u0007\u0006\u0002\u0007\u0007\u0007\u0002\b\u0007\b\u0002\t\u0007\t\u0002"+
		"\n\u0007\n\u0002\u000b\u0007\u000b\u0001\u0000\u0001\u0000\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0003\u0001\u0003\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0006\u0004\u0006?\b\u0006\u000b\u0006"+
		"\f\u0006@\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\b\u0004"+
		"\bH\b\b\u000b\b\f\bI\u0001\b\u0001\b\u0004\bN\b\b\u000b\b\f\bO\u0001\t"+
		"\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001"+
		"\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0001\n\u0004"+
		"\nd\b\n\u000b\n\f\ne\u0001\n\u0003\ni\b\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0003\n\u0087\b\n\u0001"+
		"\n\u0001\n\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0000\u0000"+
		"\f\u0002\u0000\u0004\u0001\u0006\u0002\b\u0003\n\u0004\f\u0005\u000e\u0006"+
		"\u0010\u0007\u0012\b\u0014\t\u0016\n\u0018\u000b\u0002\u0000\u0001\u0005"+
		"\u0003\u0000\t\n\r\r  \u0003\u000009AZaz\u0002\u000009AZ\u0001\u0000A"+
		"Z\u0002\u0000++--\u0091\u0000\u0004\u0001\u0000\u0000\u0000\u0000\u0006"+
		"\u0001\u0000\u0000\u0000\u0000\b\u0001\u0000\u0000\u0000\u0000\n\u0001"+
		"\u0000\u0000\u0000\u0000\f\u0001\u0000\u0000\u0000\u0000\u000e\u0001\u0000"+
		"\u0000\u0000\u0000\u0010\u0001\u0000\u0000\u0000\u0001\u0012\u0001\u0000"+
		"\u0000\u0000\u0001\u0014\u0001\u0000\u0000\u0000\u0001\u0016\u0001\u0000"+
		"\u0000\u0000\u0001\u0018\u0001\u0000\u0000\u0000\u0002\u001a\u0001\u0000"+
		"\u0000\u0000\u0004\u001c\u0001\u0000\u0000\u0000\u0006 \u0001\u0000\u0000"+
		"\u0000\b#\u0001\u0000\u0000\u0000\n%\u0001\u0000\u0000\u0000\f\'\u0001"+
		"\u0000\u0000\u0000\u000e>\u0001\u0000\u0000\u0000\u0010B\u0001\u0000\u0000"+
		"\u0000\u0012G\u0001\u0000\u0000\u0000\u0014Q\u0001\u0000\u0000\u0000\u0016"+
		"c\u0001\u0000\u0000\u0000\u0018\u008a\u0001\u0000\u0000\u0000\u001a\u001b"+
		"\u0007\u0000\u0000\u0000\u001b\u0003\u0001\u0000\u0000\u0000\u001c\u001d"+
		"\u0005a\u0000\u0000\u001d\u001e\u0005n\u0000\u0000\u001e\u001f\u0005d"+
		"\u0000\u0000\u001f\u0005\u0001\u0000\u0000\u0000 !\u0005o\u0000\u0000"+
		"!\"\u0005r\u0000\u0000\"\u0007\u0001\u0000\u0000\u0000#$\u0005(\u0000"+
		"\u0000$\t\u0001\u0000\u0000\u0000%&\u0005)\u0000\u0000&\u000b\u0001\u0000"+
		"\u0000\u0000\'(\u0005U\u0000\u0000()\u0005n\u0000\u0000)*\u0005d\u0000"+
		"\u0000*+\u0005e\u0000\u0000+,\u0005r\u0000\u0000,-\u0005g\u0000\u0000"+
		"-.\u0005r\u0000\u0000./\u0005a\u0000\u0000/0\u0005d\u0000\u000001\u0005"+
		"u\u0000\u000012\u0005a\u0000\u000023\u0005t\u0000\u000034\u0005e\u0000"+
		"\u000045\u0005 \u0000\u000056\u0005l\u0000\u000067\u0005e\u0000\u0000"+
		"78\u0005v\u0000\u000089\u0005e\u0000\u00009:\u0005l\u0000\u0000:;\u0001"+
		"\u0000\u0000\u0000;<\u0006\u0005\u0000\u0000<\r\u0001\u0000\u0000\u0000"+
		"=?\u0007\u0001\u0000\u0000>=\u0001\u0000\u0000\u0000?@\u0001\u0000\u0000"+
		"\u0000@>\u0001\u0000\u0000\u0000@A\u0001\u0000\u0000\u0000A\u000f\u0001"+
		"\u0000\u0000\u0000BC\u0003\u0002\u0000\u0000CD\u0001\u0000\u0000\u0000"+
		"DE\u0006\u0007\u0001\u0000E\u0011\u0001\u0000\u0000\u0000FH\u0007\u0002"+
		"\u0000\u0000GF\u0001\u0000\u0000\u0000HI\u0001\u0000\u0000\u0000IG\u0001"+
		"\u0000\u0000\u0000IJ\u0001\u0000\u0000\u0000JK\u0001\u0000\u0000\u0000"+
		"KM\u0005 \u0000\u0000LN\u0007\u0002\u0000\u0000ML\u0001\u0000\u0000\u0000"+
		"NO\u0001\u0000\u0000\u0000OM\u0001\u0000\u0000\u0000OP\u0001\u0000\u0000"+
		"\u0000P\u0013\u0001\u0000\u0000\u0000QR\u0005M\u0000\u0000RS\u0005i\u0000"+
		"\u0000ST\u0005n\u0000\u0000TU\u0005i\u0000\u0000UV\u0005m\u0000\u0000"+
		"VW\u0005u\u0000\u0000WX\u0005m\u0000\u0000XY\u0005 \u0000\u0000YZ\u0005"+
		"G\u0000\u0000Z[\u0005r\u0000\u0000[\\\u0005a\u0000\u0000\\]\u0005d\u0000"+
		"\u0000]^\u0005e\u0000\u0000^_\u0005 \u0000\u0000_`\u0005o\u0000\u0000"+
		"`a\u0005f\u0000\u0000a\u0015\u0001\u0000\u0000\u0000bd\u0007\u0003\u0000"+
		"\u0000cb\u0001\u0000\u0000\u0000de\u0001\u0000\u0000\u0000ec\u0001\u0000"+
		"\u0000\u0000ef\u0001\u0000\u0000\u0000fh\u0001\u0000\u0000\u0000gi\u0007"+
		"\u0004\u0000\u0000hg\u0001\u0000\u0000\u0000hi\u0001\u0000\u0000\u0000"+
		"i\u0086\u0001\u0000\u0000\u0000jk\u0005 \u0000\u0000kl\u0005[\u0000\u0000"+
		"lm\u0005m\u0000\u0000mn\u0005a\u0000\u0000no\u0005y\u0000\u0000op\u0005"+
		" \u0000\u0000pq\u0005b\u0000\u0000qr\u0005e\u0000\u0000rs\u0005 \u0000"+
		"\u0000st\u0005t\u0000\u0000tu\u0005a\u0000\u0000uv\u0005k\u0000\u0000"+
		"vw\u0005e\u0000\u0000wx\u0005n\u0000\u0000xy\u0005 \u0000\u0000yz\u0005"+
		"c\u0000\u0000z{\u0005o\u0000\u0000{|\u0005n\u0000\u0000|}\u0005c\u0000"+
		"\u0000}~\u0005u\u0000\u0000~\u007f\u0005r\u0000\u0000\u007f\u0080\u0005"+
		"r\u0000\u0000\u0080\u0081\u0005e\u0000\u0000\u0081\u0082\u0005n\u0000"+
		"\u0000\u0082\u0083\u0005t\u0000\u0000\u0083\u0084\u0005l\u0000\u0000\u0084"+
		"\u0085\u0005y\u0000\u0000\u0085\u0087\u0005]\u0000\u0000\u0086j\u0001"+
		"\u0000\u0000\u0000\u0086\u0087\u0001\u0000\u0000\u0000\u0087\u0088\u0001"+
		"\u0000\u0000\u0000\u0088\u0089\u0006\n\u0002\u0000\u0089\u0017\u0001\u0000"+
		"\u0000\u0000\u008a\u008b\u0003\u0002\u0000\u0000\u008b\u008c\u0001\u0000"+
		"\u0000\u0000\u008c\u008d\u0006\u000b\u0001\u0000\u008d\u0019\u0001\u0000"+
		"\u0000\u0000\b\u0000\u0001@IOeh\u0086\u0003\u0002\u0001\u0000\u0006\u0000"+
		"\u0000\u0002\u0000\u0000";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}