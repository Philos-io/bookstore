var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from 'angular2/src/di/decorators';
import { ListWrapper, SetWrapper } from "angular2/src/facade/collection";
import { NumberWrapper, StringJoiner, StringWrapper, BaseException } from "angular2/src/facade/lang";
export const TOKEN_TYPE_CHARACTER = 1;
export const TOKEN_TYPE_IDENTIFIER = 2;
export const TOKEN_TYPE_KEYWORD = 3;
export const TOKEN_TYPE_STRING = 4;
export const TOKEN_TYPE_OPERATOR = 5;
export const TOKEN_TYPE_NUMBER = 6;
export let Lexer = class {
    tokenize(text) {
        var scanner = new _Scanner(text);
        var tokens = [];
        var token = scanner.scanToken();
        while (token != null) {
            ListWrapper.push(tokens, token);
            token = scanner.scanToken();
        }
        return tokens;
    }
};
Lexer = __decorate([
    Injectable(), 
    __metadata('design:paramtypes', [])
], Lexer);
export class Token {
    constructor(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    isCharacter(code) {
        return (this.type == TOKEN_TYPE_CHARACTER && this.numValue == code);
    }
    isNumber() { return (this.type == TOKEN_TYPE_NUMBER); }
    isString() { return (this.type == TOKEN_TYPE_STRING); }
    isOperator(operater) {
        return (this.type == TOKEN_TYPE_OPERATOR && this.strValue == operater);
    }
    isIdentifier() { return (this.type == TOKEN_TYPE_IDENTIFIER); }
    isKeyword() { return (this.type == TOKEN_TYPE_KEYWORD); }
    isKeywordVar() { return (this.type == TOKEN_TYPE_KEYWORD && this.strValue == "var"); }
    isKeywordNull() { return (this.type == TOKEN_TYPE_KEYWORD && this.strValue == "null"); }
    isKeywordUndefined() {
        return (this.type == TOKEN_TYPE_KEYWORD && this.strValue == "undefined");
    }
    isKeywordTrue() { return (this.type == TOKEN_TYPE_KEYWORD && this.strValue == "true"); }
    isKeywordFalse() {
        return (this.type == TOKEN_TYPE_KEYWORD && this.strValue == "false");
    }
    toNumber() {
        // -1 instead of NULL ok?
        return (this.type == TOKEN_TYPE_NUMBER) ? this.numValue : -1;
    }
    toString() {
        var t = this.type;
        if (t >= TOKEN_TYPE_CHARACTER && t <= TOKEN_TYPE_STRING) {
            return this.strValue;
        }
        else if (t == TOKEN_TYPE_NUMBER) {
            return this.numValue.toString();
        }
        else {
            return null;
        }
    }
}
function newCharacterToken(index, code) {
    return new Token(index, TOKEN_TYPE_CHARACTER, code, StringWrapper.fromCharCode(code));
}
function newIdentifierToken(index, text) {
    return new Token(index, TOKEN_TYPE_IDENTIFIER, 0, text);
}
function newKeywordToken(index, text) {
    return new Token(index, TOKEN_TYPE_KEYWORD, 0, text);
}
function newOperatorToken(index, text) {
    return new Token(index, TOKEN_TYPE_OPERATOR, 0, text);
}
function newStringToken(index, text) {
    return new Token(index, TOKEN_TYPE_STRING, 0, text);
}
function newNumberToken(index, n) {
    return new Token(index, TOKEN_TYPE_NUMBER, n, "");
}
export var EOF = new Token(-1, 0, 0, "");
export const $EOF = 0;
export const $TAB = 9;
export const $LF = 10;
export const $VTAB = 11;
export const $FF = 12;
export const $CR = 13;
export const $SPACE = 32;
export const $BANG = 33;
export const $DQ = 34;
export const $HASH = 35;
export const $$ = 36;
export const $PERCENT = 37;
export const $AMPERSAND = 38;
export const $SQ = 39;
export const $LPAREN = 40;
export const $RPAREN = 41;
export const $STAR = 42;
export const $PLUS = 43;
export const $COMMA = 44;
export const $MINUS = 45;
export const $PERIOD = 46;
export const $SLASH = 47;
export const $COLON = 58;
export const $SEMICOLON = 59;
export const $LT = 60;
export const $EQ = 61;
export const $GT = 62;
export const $QUESTION = 63;
const $0 = 48;
const $9 = 57;
const $A = 65, $E = 69, $Z = 90;
export const $LBRACKET = 91;
export const $BACKSLASH = 92;
export const $RBRACKET = 93;
const $CARET = 94;
const $_ = 95;
const $a = 97, $e = 101, $f = 102, $n = 110, $r = 114, $t = 116, $u = 117, $v = 118, $z = 122;
export const $LBRACE = 123;
export const $BAR = 124;
export const $RBRACE = 125;
const $NBSP = 160;
export class ScannerError extends BaseException {
    constructor(message) {
        super();
        this.message = message;
    }
    toString() { return this.message; }
}
class _Scanner {
    constructor(input) {
        this.input = input;
        this.length = input.length;
        this.peek = 0;
        this.index = -1;
        this.advance();
    }
    advance() {
        this.peek =
            ++this.index >= this.length ? $EOF : StringWrapper.charCodeAt(this.input, this.index);
    }
    scanToken() {
        var input = this.input, length = this.length, peek = this.peek, index = this.index;
        // Skip whitespace.
        while (peek <= $SPACE) {
            if (++index >= length) {
                peek = $EOF;
                break;
            }
            else {
                peek = StringWrapper.charCodeAt(input, index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        var start = index;
        switch (peek) {
            case $PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, $PERIOD);
            case $LPAREN:
            case $RPAREN:
            case $LBRACE:
            case $RBRACE:
            case $LBRACKET:
            case $RBRACKET:
            case $COMMA:
            case $COLON:
            case $SEMICOLON:
                return this.scanCharacter(start, peek);
            case $SQ:
            case $DQ:
                return this.scanString();
            case $HASH:
            case $PLUS:
            case $MINUS:
            case $STAR:
            case $SLASH:
            case $PERCENT:
            case $CARET:
                return this.scanOperator(start, StringWrapper.fromCharCode(peek));
            case $QUESTION:
                return this.scanComplexOperator(start, $PERIOD, '?', '.');
            case $LT:
            case $GT:
            case $BANG:
            case $EQ:
                return this.scanComplexOperator(start, $EQ, StringWrapper.fromCharCode(peek), '=');
            case $AMPERSAND:
                return this.scanComplexOperator(start, $AMPERSAND, '&', '&');
            case $BAR:
                return this.scanComplexOperator(start, $BAR, '|', '|');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.error(`Unexpected character [${StringWrapper.fromCharCode(peek)}]`, 0);
        return null;
    }
    scanCharacter(start, code) {
        assert(this.peek == code);
        this.advance();
        return newCharacterToken(start, code);
    }
    scanOperator(start, str) {
        assert(this.peek == StringWrapper.charCodeAt(str, 0));
        assert(SetWrapper.has(OPERATORS, str));
        this.advance();
        return newOperatorToken(start, str);
    }
    scanComplexOperator(start, code, one, two) {
        assert(this.peek == StringWrapper.charCodeAt(one, 0));
        this.advance();
        var str = one;
        while (this.peek == code) {
            this.advance();
            str += two;
        }
        assert(SetWrapper.has(OPERATORS, str));
        return newOperatorToken(start, str);
    }
    scanIdentifier() {
        assert(isIdentifierStart(this.peek));
        var start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var str = this.input.substring(start, this.index);
        if (SetWrapper.has(KEYWORDS, str)) {
            return newKeywordToken(start, str);
        }
        else {
            return newIdentifierToken(start, str);
        }
    }
    scanNumber(start) {
        assert(isDigit(this.peek));
        var simple = (this.index === start);
        this.advance(); // Skip initial digit.
        while (true) {
            if (isDigit(this.peek)) {
            }
            else if (this.peek == $PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var str = this.input.substring(start, this.index);
        // TODO
        var value = simple ? NumberWrapper.parseIntAutoRadix(str) : NumberWrapper.parseFloat(str);
        return newNumberToken(start, value);
    }
    scanString() {
        assert(this.peek == $SQ || this.peek == $DQ);
        var start = this.index;
        var quote = this.peek;
        this.advance(); // Skip initial quote.
        var buffer;
        var marker = this.index;
        var input = this.input;
        while (this.peek != quote) {
            if (this.peek == $BACKSLASH) {
                if (buffer == null)
                    buffer = new StringJoiner();
                buffer.add(input.substring(marker, this.index));
                this.advance();
                var unescapedCode;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    var hex = input.substring(this.index + 1, this.index + 5);
                    try {
                        unescapedCode = NumberWrapper.parseInt(hex, 16);
                    }
                    catch (e) {
                        this.error(`Invalid unicode escape [\\u${hex}]`, 0);
                    }
                    for (var i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer.add(StringWrapper.fromCharCode(unescapedCode));
                marker = this.index;
            }
            else if (this.peek == $EOF) {
                this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        // Compute the unescaped string value.
        var unescaped = last;
        if (buffer != null) {
            buffer.add(last);
            unescaped = buffer.toString();
        }
        return newStringToken(start, unescaped);
    }
    error(message, offset) {
        var position = this.index + offset;
        throw new ScannerError(`Lexer Error: ${message} at column ${position} in expression [${this.input}]`);
    }
}
function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || (code == $_) || (code == $$);
}
function isIdentifierPart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) || ($0 <= code && code <= $9) ||
        (code == $_) || (code == $$);
}
function isDigit(code) {
    return $0 <= code && code <= $9;
}
function isExponentStart(code) {
    return code == $e || code == $E;
}
function isExponentSign(code) {
    return code == $MINUS || code == $PLUS;
}
function unescape(code) {
    switch (code) {
        case $n:
            return $LF;
        case $f:
            return $FF;
        case $r:
            return $CR;
        case $t:
            return $TAB;
        case $v:
            return $VTAB;
        default:
            return code;
    }
}
var OPERATORS = SetWrapper.createFromList([
    '+',
    '-',
    '*',
    '/',
    '%',
    '^',
    '=',
    '==',
    '!=',
    '===',
    '!==',
    '<',
    '>',
    '<=',
    '>=',
    '&&',
    '||',
    '&',
    '|',
    '!',
    '?',
    '#',
    '?.'
]);
var KEYWORDS = SetWrapper.createFromList(['var', 'null', 'undefined', 'true', 'false']);
//# sourceMappingURL=lexer.js.map