// de-es-module-ified forms of a few of sindre's modules below,
// used under terms of the MIT license, included here.
//
// string-length@5.0.1
// char-regex@2.0.0
// strip-ansi@7.0.1
// ansi-regex@6.0.1

/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function stripAnsi(string) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
	}

	return string.replace(ansiRegex(), '');
}

function ansiRegex({onlyFirst = false} = {}) {
	const pattern = [
	    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function charRegex () {
	// Used to compose unicode character classes.
	const astralRange = "\\ud800-\\udfff"
	const comboMarksRange = "\\u0300-\\u036f"
	const comboHalfMarksRange = "\\ufe20-\\ufe2f"
	const comboSymbolsRange = "\\u20d0-\\u20ff"
	const comboMarksExtendedRange = "\\u1ab0-\\u1aff"
	const comboMarksSupplementRange = "\\u1dc0-\\u1dff"
	const comboRange = comboMarksRange + comboHalfMarksRange + comboSymbolsRange + comboMarksExtendedRange + comboMarksSupplementRange
	const varRange = "\\ufe0e\\ufe0f"

	// Used to compose unicode capture groups.
	const astral = `[${astralRange}]`
	const combo = `[${comboRange}]`
	const fitz = "\\ud83c[\\udffb-\\udfff]"
	const modifier = `(?:${combo}|${fitz})`
	const nonAstral = `[^${astralRange}]`
	const regional = "(?:\\ud83c[\\udde6-\\uddff]){2}"
	const surrogatePair = "[\\ud800-\\udbff][\\udc00-\\udfff]"
	const zeroWidthJoiner = "\\u200d"
	const blackFlag = "(?:\\ud83c\\udff4\\udb40\\udc67\\udb40\\udc62\\udb40(?:\\udc65|\\udc73|\\udc77)\\udb40(?:\\udc6e|\\udc63|\\udc6c)\\udb40(?:\\udc67|\\udc74|\\udc73)\\udb40\\udc7f)"

	// Used to compose unicode regexes.
	const optModifier = `${modifier}?`
	const optVar = `[${varRange}]?`
	const optJoin = `(?:${zeroWidthJoiner}(?:${[nonAstral, regional, surrogatePair].join("|")})${optVar + optModifier})*`
	const seq = optVar + optModifier + optJoin
	const nonAstralCombo = `${nonAstral}${combo}?`
	const symbol = `(?:${[blackFlag, nonAstralCombo, combo, regional, surrogatePair, astral].join("|")})`

	// Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode).
	return new RegExp(`${fitz}(?=${fitz})|${symbol + seq}`, "g")
}

module.exports = (string, {countAnsiEscapeCodes = false} = {}) => {
	if (string === '') {
		return 0;
	}

	if (!countAnsiEscapeCodes) {
		string = stripAnsi(string);
	}

	if (string === '') {
		return 0;
	}

	return string.match(charRegex()).length;
}
