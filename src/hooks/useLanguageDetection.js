import { useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// All patterns are defined ONCE at module level (never recompiled per call)
// ---------------------------------------------------------------------------

/**
 * Each entry is { pattern: RegExp, score: number }.
 * Scores are intentionally asymmetric:
 *   - "smoking gun" patterns (unique syntax) → high score (8–15)
 *   - "suggestive" patterns (shared keywords) → low score (1–3)
 * This prevents one language stealing points from another on shared tokens.
 */
const LANGUAGE_PATTERNS = {
    javascript: [
        // Smoking guns — unique to JS/TS
        { pattern: /\b(const|let)\s+\w+\s*=\s*(async\s+)?\(/, score: 8 },
        { pattern: /\s=>\s*[\{\(]/, score: 8 },
        { pattern: /\$\{[^}]+\}/, score: 7 },
        { pattern: /\bconsole\.(log|warn|error|info)\s*\(/, score: 9 },
        { pattern: /\b(document|window|navigator|localStorage)\b/, score: 8 },
        { pattern: /\b(useState|useEffect|useRef|useCallback|useMemo)\s*\(/, score: 10 },
        { pattern: /\bimport\s+[\w{}\s,*]+\s+from\s+['"]/, score: 7 },
        { pattern: /\bexport\s+(default|const|function|class)/, score: 7 },
        { pattern: /\bnew\s+Promise\s*\(/, score: 8 },
        { pattern: /\b(async\s+function|await\s+\w)/, score: 6 },
        // Suggestive — shared but still lean JS
        { pattern: /\b(typeof|instanceof|undefined|NaN|Infinity)\b/, score: 4 },
        { pattern: /\bJSON\.(parse|stringify)\s*\(/, score: 5 },
        { pattern: /\b(\.forEach|\.map|\.filter|\.reduce|\.find)\s*\(/, score: 4 },
    ],

    typescript: [
        { pattern: /:\s*(string|number|boolean|void|never|unknown|any)\b/, score: 7 },
        { pattern: /\binterface\s+\w+\s*\{/, score: 9 },
        { pattern: /\btype\s+\w+\s*=\s*[\w<{|(]/, score: 9 },
        { pattern: /<\w+(\[\])?(\s*\|\s*\w+)*>/, score: 6 },
        { pattern: /\b(enum|namespace|declare|readonly|keyof|typeof)\b/, score: 8 },
        { pattern: /\bas\s+(string|number|unknown|any|\w+)/, score: 7 },
        { pattern: /\?\s*:\s*\w+/, score: 6 },
        { pattern: /import\s+type\s+/, score: 10 },
    ],

    python: [
        // Smoking guns
        { pattern: /^def\s+\w+\s*\(.*\)\s*(->\s*[\w\[\], |]+)?\s*:/m, score: 10 },
        { pattern: /^class\s+\w+(\([\w, ]+\))?\s*:/m, score: 10 },
        { pattern: /\bif\s+__name__\s*==\s*['"]__main__['"]/, score: 15 },
        { pattern: /\bprint\s*\(/, score: 5 },
        { pattern: /\b(elif|pass|yield|lambda|with\s+\w+\s+as\s+\w+)\b/, score: 7 },
        { pattern: /f['"][^'"]*\{[^}]+\}/, score: 8 },
        { pattern: /\bimport\s+\w+|from\s+\w[\w.]*\s+import/, score: 4 },
        { pattern: /\b(None|True|False)\b/, score: 5 },
        { pattern: /\b(self|cls)\b/, score: 6 },
        { pattern: /#.*$/, score: 1 },
        { pattern: /^(\s{4}|\t)\w/m, score: 2 },
    ],

    java: [
        { pattern: /\bpublic\s+static\s+void\s+main\s*\(\s*String/, score: 15 },
        { pattern: /\bSystem\.out\.(print|println)\s*\(/, score: 12 },
        { pattern: /\b@(Override|Nullable|NonNull|Autowired|Component|Service|Repository|Entity|SpringBootApplication)\b/, score: 10 },
        { pattern: /\bnew\s+[A-Z]\w*\s*(<.*>)?\s*\(/, score: 5 },
        { pattern: /\b(public|private|protected)\s+(static\s+)?(final\s+)?\w+\s+\w+\s*[=(;]/, score: 5 },
        { pattern: /\bimport\s+java\.\w/, score: 12 },
        { pattern: /\bimport\s+(org|com|net|io)\.\w+\.\w+;/, score: 8 },
        { pattern: /\bclass\s+\w+(\s+extends\s+\w+)?(\s+implements\s+[\w, ]+)?\s*\{/, score: 8 },
        { pattern: /[A-Z]\w*<[A-Z]\w*>/, score: 5 },
        { pattern: /\bthrows\s+\w+(Exception|Error)\b/, score: 8 },
    ],

    cpp: [
        { pattern: /#include\s*<(iostream|vector|string|map|algorithm|memory|cstdio|cmath|cstring)>/, score: 15 },
        { pattern: /\bstd::(cout|cin|endl|string|vector|map|pair|make_pair|move|forward)\b/, score: 12 },
        { pattern: /\bint\s+main\s*\(\s*(void|int\s+argc)/, score: 10 },
        { pattern: /\b(nullptr|auto\s+\w+\s*=|decltype|constexpr|noexcept|override|final)\b/, score: 8 },
        { pattern: /::\w+/, score: 4 },
        { pattern: /\b(class|struct)\s+\w+\s*(:\s*(public|private|protected)\s+\w+)?\s*\{/, score: 7 },
        { pattern: /\btemplate\s*</, score: 10 },
        { pattern: /delete\[\]|new\s+\w+\[/, score: 8 },
        { pattern: /->|\*\w+|\w+\*\s+\w+/, score: 3 },
    ],

    csharp: [
        { pattern: /\busing\s+System(\.\w+)*;/, score: 12 },
        { pattern: /\bnamespace\s+\w+(\.\w+)*\s*\{/, score: 10 },
        { pattern: /\b(Console\.(Write|WriteLine)|Debug\.Log)\s*\(/, score: 10 },
        { pattern: /\b(public|private|protected)\s+(override\s+|static\s+|async\s+)?\w+\s+\w+\s*[\({]/, score: 5 },
        { pattern: /\[\w+(Attribute)?\]/, score: 7 },
        { pattern: /\bvar\s+\w+\s*=/, score: 4 },
        { pattern: /=>\s*\{|=>\s*\w+/, score: 4 },
        { pattern: /\b(get;\s*set;|get;\s*private set;)/, score: 10 },
        { pattern: /\bnew\s+List<|Dictionary<\w+,\s*\w+>/, score: 8 },
    ],

    go: [
        { pattern: /^package\s+\w+$/m, score: 15 },
        { pattern: /\bfunc\s+(\(\w+\s+\*?\w+\)\s+)?\w+\s*\(/, score: 10 },
        { pattern: /\s:=\s/, score: 8 },
        { pattern: /\bimport\s*\(\s*\n(\s*"[\w./]+"[\s\n])+\s*\)/, score: 12 },
        { pattern: /\bgo\s+\w+\(/, score: 8 },
        { pattern: /\bchan\s+\w+|<-\s*\w+|\w+\s*<-/, score: 10 },
        { pattern: /\bdefer\s+\w+/, score: 8 },
        { pattern: /\bfmt\.(Print|Println|Printf|Sprintf|Errorf)\s*\(/, score: 12 },
        { pattern: /\b(make|append)\s*\([\[\]a-zA-Z]+/, score: 7 },
    ],

    rust: [
        { pattern: /\bfn\s+\w+\s*(<.*>)?\s*\(.*\)\s*(->\s*[\w<>&']+)?\s*\{/, score: 12 },
        { pattern: /\blet\s+(mut\s+)?\w+\s*:\s*\w+/, score: 9 },
        { pattern: /\bimpl\s+\w+(\s+for\s+\w+)?\s*\{/, score: 12 },
        { pattern: /\b(println!|eprintln!|vec!|format!|panic!|assert!|dbg!)\s*[(\[]/, score: 12 },
        { pattern: /\buse\s+\w+::\w+/, score: 8 },
        { pattern: /\b(match\s+\w+|Some\(|None\b|Ok\(|Err\()/, score: 8 },
        { pattern: /&(mut\s+)?\w+|'[a-z]+\s+\w+|<'[a-z]+>/, score: 7 },
        { pattern: /\b(pub\s+)?(struct|enum|trait)\s+\w+/, score: 9 },
    ],

    php: [
        { pattern: /<\?php/, score: 20 },
        { pattern: /\$[a-zA-Z_]\w*\s*=/, score: 6 },
        { pattern: /\b(echo|print|var_dump|isset|empty|array|list)\s*\(/, score: 8 },
        { pattern: /\b(public|private|protected)\s+function\s+\w+/, score: 8 },
        { pattern: /\bnamespace\s+[\w\\]+;/, score: 9 },
        { pattern: /\buse\s+[\w\\]+;/, score: 6 },
        { pattern: /->|\$this->/, score: 4 },
        { pattern: /\b(require|include)(_once)?\s*['"\(]/, score: 8 },
    ],

    ruby: [
        { pattern: /\bdef\s+\w+(\s*\(.*\))?\s*$/, score: 10 },
        { pattern: /\bend\b/, score: 4 },
        { pattern: /\b(puts|p|pp|print)\s+/, score: 6 },
        { pattern: /\b(attr_accessor|attr_reader|attr_writer)\s+:/, score: 12 },
        { pattern: /\b(require|require_relative)\s+['"]/, score: 7 },
        { pattern: /\bdo\s*\|[\w,\s]+\|/, score: 10 },
        { pattern: /\b(nil|true|false)\b/, score: 3 },
        { pattern: /:(\w+)\s*=>|{\s*\w+:\s*/, score: 5 },
        { pattern: /\bclass\s+\w+(\s*<\s*\w+)?\s*$/, score: 9 },
    ],

    swift: [
        { pattern: /\bimport\s+(UIKit|SwiftUI|Foundation|Combine|AppKit)\b/, score: 15 },
        { pattern: /\bvar\s+\w+\s*:\s*\w+(\?|!)?\s*[={]/, score: 7 },
        { pattern: /\blet\s+\w+\s*:\s*\w+(\?|!)?\s*=/, score: 7 },
        { pattern: /\bfunc\s+\w+\(.*\)\s*(throws\s+)?(->\s*\w+(\?|!)?)?\s*\{/, score: 10 },
        { pattern: /\bguard\s+let\s+|\bif\s+let\s+/, score: 10 },
        { pattern: /\b(struct|enum|protocol|extension)\s+\w+/, score: 8 },
        { pattern: /@(State|Binding|ObservedObject|EnvironmentObject|Published)\b/, score: 12 },
        { pattern: /\boptional\b|!\w+|\?\.\w+/, score: 5 },
    ],

    kotlin: [
        { pattern: /\bfun\s+\w+\s*\(/, score: 10 },
        { pattern: /\bval\s+\w+\s*:\s*\w+|var\s+\w+\s*:\s*\w+/, score: 7 },
        { pattern: /\bdata\s+class\s+\w+/, score: 12 },
        { pattern: /\bnull\b|!!\.|\?\.\w+/, score: 5 },
        { pattern: /\bwhen\s*\(/, score: 9 },
        { pattern: /\blambda\b|\{\s*\w+\s*->\s*/, score: 6 },
        { pattern: /\bimport\s+android\.\w+|\bimport\s+kotlinx\./, score: 12 },
        { pattern: /\bobject\s+\w+\s*:\s*\w+|companion\s+object/, score: 12 },
    ],

    html: [
        { pattern: /<!DOCTYPE\s+html>/i, score: 20 },
        { pattern: /<html[\s>]/i, score: 15 },
        { pattern: /<(head|body|div|span|section|article|header|footer|main|nav|aside)\b[\s>]/i, score: 8 },
        { pattern: /<(script|style|link|meta)\b[^>]*>/i, score: 7 },
        { pattern: /<(h[1-6]|p|ul|ol|li|table|tr|td|th|form|input|button|img|a)\b[^>]*>/i, score: 5 },
        { pattern: /class=["'][^"']+["']|id=["'][^"']+["']/, score: 4 },
        { pattern: /&(amp|lt|gt|nbsp|quot|apos);/, score: 5 },
        { pattern: /<\/\w+>/, score: 3 },
    ],

    css: [
        { pattern: /@(media|keyframes|font-face|import|supports|layer|container)\b/, score: 12 },
        { pattern: /\b(margin|padding|display|flex|grid|position|border|background|color|font)\s*:\s*[^;]+;/, score: 8 },
        { pattern: /:root\s*\{/, score: 10 },
        { pattern: /\b(var\(--[\w-]+\)|--[\w-]+\s*:)/, score: 10 },
        { pattern: /::?(before|after|hover|focus|active|nth-child|first-child|last-child|not)\b/, score: 9 },
        { pattern: /\.([\w-]+)\s*\{/, score: 5 },
        { pattern: /#[\w-]+\s*\{/, score: 5 },
        { pattern: /\b(px|rem|em|vh|vw|fr|%)\b/, score: 3 },
    ],

    sql: [
        { pattern: /\b(SELECT\s+[\w*,\s]+\s+FROM|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM)\b/i, score: 15 },
        { pattern: /\b(CREATE\s+(TABLE|DATABASE|INDEX|VIEW)|DROP\s+(TABLE|DATABASE)|ALTER\s+TABLE)\b/i, score: 12 },
        { pattern: /\b(INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL OUTER JOIN)\b/i, score: 10 },
        { pattern: /\b(WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET)\b/i, score: 6 },
        { pattern: /\b(VARCHAR|INT|INTEGER|BIGINT|BOOLEAN|TEXT|TIMESTAMP|DECIMAL|FLOAT|BLOB)\b/i, score: 7 },
        { pattern: /\b(PRIMARY KEY|FOREIGN KEY|NOT NULL|UNIQUE|DEFAULT|REFERENCES)\b/i, score: 8 },
        { pattern: /--[^\n]+/, score: 3 },
    ],

    json: [
        { pattern: /^\s*\{[\s\S]*\}\s*$/, score: 3 },
        { pattern: /^\s*\[[\s\S]*\]\s*$/, score: 3 },
        { pattern: /"[\w$@-]+":\s*("|'|\d|true|false|null|\[|\{)/, score: 8 },
        { pattern: /,\s*"[\w$@-]+":\s*/, score: 6 },
        { pattern: /:\s*\[\s*\{/, score: 5 },
    ],

    yaml: [
        { pattern: /^---(\s|$)/m, score: 10 },
        { pattern: /^[a-zA-Z_][\w-]*:\s*[^\s{[|>].*$/m, score: 5 },
        { pattern: /^\s{2,}[a-zA-Z_][\w-]*:\s/m, score: 5 },
        { pattern: /^-\s+\w/m, score: 4 },
        { pattern: /\|\s*\n\s+\w/m, score: 8 },
        { pattern: /<<:\s*\*/m, score: 12 },
        { pattern: /&\w+\s|\*\w+\s/, score: 8 },
    ],

    markdown: [
        { pattern: /^#{1,6}\s+\S/m, score: 8 },
        { pattern: /\[.+?\]\(https?:\/\/[^\s)]+\)/, score: 8 },
        { pattern: /!\[.*?\]\(.*?\)/, score: 8 },
        { pattern: /^(\*\*|__).+?(\*\*|__)$/m, score: 5 },
        { pattern: /^[-*+]\s+\S/m, score: 5 },
        { pattern: /^\d+\.\s+\S/m, score: 5 },
        { pattern: /^```\w*/m, score: 7 },
        { pattern: /^>\s+\S/m, score: 6 },
        { pattern: /^---+$/m, score: 4 },
    ],

    shell: [
        { pattern: /^#!\s*\/bin\/(bash|sh|zsh|fish)\b/m, score: 20 },
        { pattern: /\b(echo|export|source|alias|chmod|chown|sudo|apt|brew|yum|curl|wget)\s+/, score: 8 },
        { pattern: /\$\{?\w+\}?/, score: 5 },
        { pattern: /\|\s*(grep|awk|sed|cut|sort|uniq|head|tail)\b/, score: 10 },
        { pattern: /&&|\|\||\bfi\b|\bdone\b|\bthen\b|\bdo\b/, score: 6 },
        { pattern: /\bfor\s+\w+\s+in\s+|\bwhile\s+read\b/, score: 7 },
        { pattern: /\[\s*[-\w]+\s*\]|\[\[.*\]\]/, score: 8 },
        { pattern: /\bssh\s+|\.\/\w+/, score: 6 },
    ],
};

// ---------------------------------------------------------------------------
// Compute scores, applying a penalty when a language's top patterns don't
// fire at all (prevents weak signals from winning).
// ---------------------------------------------------------------------------
const computeScores = (sample) => {
    const totals = {};

    for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
        let total = 0;
        for (const { pattern, score } of patterns) {
            if (pattern.test(sample)) total += score;
        }
        totals[lang] = total;
    }

    if (totals.typescript > 0 && totals.javascript > 0) {
        const tsSpecific = /:\s*(string|number|boolean|void|never|unknown|any)\b|\binterface\s+\w+|\btype\s+\w+\s*=|\benum\s+\w+|\bdeclare\b/.test(sample);
        if (!tsSpecific) totals.typescript = 0;
        else totals.javascript = 0;
    }

    if (totals.json > 0 && totals.yaml > 0) {
        const looksLikeJson = /^\s*[\{\[]/.test(sample) && /[\}\]]\s*$/.test(sample);
        if (looksLikeJson) totals.yaml = 0;
        else totals.json = 0;
    }

    return totals;
};

// ---------------------------------------------------------------------------
// Public hook
// ---------------------------------------------------------------------------

/**
 * Auto-detects the programming language of a code string.
 *
 * @param {string} value - The code text to analyze.
 * @param {string} mode  - 'auto' to enable detection, anything else to skip.
 * @returns {string}       Detected language key (e.g. 'javascript', 'python')
 *                         or 'plain' when nothing confident is found.
 */
export const useLanguageDetection = (value, mode) => {
    const [detectedLanguage, setDetectedLanguage] = useState("plain");

    useEffect(() => {
        if (mode !== "auto") {
            setDetectedLanguage("plain");
            return;
        }

        if (!value || !value.trim()) {
            setDetectedLanguage("plain");
            return;
        }

        const half = 4000;
        const sample =
            value.length > half * 2
                ? value.slice(0, half) + "\n" + value.slice(Math.floor(value.length / 2), Math.floor(value.length / 2) + half)
                : value;

        const scores = computeScores(sample);

        let bestLang = "plain";
        let maxScore = 0;
        for (const [lang, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                bestLang = lang;
            }
        }

        setDetectedLanguage(maxScore >= 6 ? bestLang : "plain");
    }, [value, mode]);

    return detectedLanguage;
};