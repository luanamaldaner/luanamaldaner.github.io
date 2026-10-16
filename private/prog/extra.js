// Mock Exam 2 question pools and coding-interview practice for the Prog 1 tab.
// Coding problems use the same shape as problems.js (tests are checked by the
// worker); multiple-choice items may carry a code snippet to trace.

const py = String.raw;

// Topics shown in the exam's score breakdown.
export const TOPICS = ['Number systems', 'Lists', 'Strings', 'Tuples & sets', 'Dictionaries', 'Recursion'];

// ---------------------------------------------------------------- multiple choice

export const MOCK_MCQ = [
  // number systems
  {
    id: 'x-bin-13', topic: 'Number systems', prompt: 'What is 13 in binary?',
    options: ['1101', '1011', '1110', '0111'], answer: '1101',
    why: '13 = 8 + 4 + 1, so the 8s, 4s and 1s places are on: 1101.',
  },
  {
    id: 'x-hex-2f', topic: 'Number systems', prompt: 'What is the hex number 2F in decimal?',
    options: ['47', '32', '45', '215'], answer: '47',
    why: '2 × 16 + 15 = 47 (F is 15).',
  },
  {
    id: 'x-bits-255', topic: 'Number systems', prompt: 'What is the largest number you can store in 8 bits (unsigned)?',
    options: ['255', '256', '127', '512'], answer: '255',
    why: '8 bits give 2⁸ = 256 different values, 0 through 255.',
  },
  {
    id: 'x-hex-digits', topic: 'Number systems', prompt: 'How many binary digits does one hex digit stand for?',
    options: ['4', '2', '8', '16'], answer: '4',
    why: '16 = 2⁴, so each hex digit maps to exactly 4 bits. That\'s why hex is a short way to write binary.',
  },
  {
    id: 'x-int-base', topic: 'Number systems', code: py`print(int("101", 2) + int("11", 16))`,
    options: ['22', '112', '16', '10111'], answer: '22',
    why: '"101" in base 2 is 5 and "11" in base 16 is 17, so 5 + 17 = 22.',
  },
  {
    id: 'x-bin-slice', topic: 'Number systems', code: py`print(bin(6)[2:], hex(26)[2:].upper())`,
    options: ['110 1A', '0b110 0X1A', '110 1a', '011 1A'], answer: '110 1A',
    why: 'bin(6) is "0b110" and hex(26) is "0x1a". [2:] drops the prefix, .upper() capitalizes the hex digit.',
  },
  // lists
  {
    id: 'x-list-copy', topic: 'Lists', code: py`a = [1, 2, 3]
b = a[:]
b.append(4)
print(len(a), len(b))`,
    options: ['3 4', '4 4', '3 3', 'Error'], answer: '3 4',
    why: 'a[:] makes a copy, so appending to b leaves a alone.',
  },
  {
    id: 'x-list-nested', topic: 'Lists', code: py`grid = [[0] * 2] * 2
grid[0][0] = 5
print(grid)`,
    options: ['[[5, 0], [5, 0]]', '[[5, 0], [0, 0]]', '[[5, 5], [0, 0]]', 'Error'], answer: '[[5, 0], [5, 0]]',
    why: '[[0] * 2] * 2 repeats the SAME inner list twice, so changing one row changes "both". Build grids with [[0] * 2 for _ in range(2)].',
  },
  {
    id: 'x-list-comp', topic: 'Lists', code: py`print([x % 3 for x in range(5) if x != 2])`,
    options: ['[0, 1, 0, 1]', '[0, 1, 2, 0, 1]', '[0, 1, 1]', '[1, 0, 1]'], answer: '[0, 1, 0, 1]',
    why: 'x goes 0, 1, 3, 4 (2 is skipped). Their remainders mod 3 are 0, 1, 0, 1.',
  },
  {
    id: 'x-list-slice-neg', topic: 'Lists', code: py`nums = [10, 20, 30, 40, 50]
print(nums[-2], nums[1:-1], nums[::2])`,
    options: ['40 [20, 30, 40] [10, 30, 50]', '40 [20, 30] [10, 30, 50]', '30 [20, 30, 40] [20, 40]', '40 [10, 20, 30, 40] [10, 30, 50]'], answer: '40 [20, 30, 40] [10, 30, 50]',
    why: '-2 is the second from the end. [1:-1] stops before the last item. [::2] takes every other item from the start.',
  },
  {
    id: 'x-list-sort', topic: 'Lists', code: py`nums = [3, 1, 2]
result = nums.sort()
print(result, nums)`,
    options: ['None [1, 2, 3]', '[1, 2, 3] [1, 2, 3]', '[1, 2, 3] [3, 1, 2]', 'None [3, 1, 2]'], answer: 'None [1, 2, 3]',
    why: '.sort() sorts the list in place and returns None. sorted(nums) is the one that returns a new list.',
  },
  {
    id: 'x-list-extend', topic: 'Lists', code: py`a = [1, 2]
a.append([3, 4])
a.extend([5, 6])
print(len(a))`,
    options: ['5', '6', '4', '3'], answer: '5',
    why: 'append adds the list [3, 4] as ONE item; extend adds 5 and 6 separately: [1, 2, [3, 4], 5, 6].',
  },
  // strings
  {
    id: 'x-str-split', topic: 'Strings', code: py`s = "a,b,,c"
print(len(s.split(",")), s.count(","))`,
    options: ['4 3', '3 3', '4 2', '3 2'], answer: '4 3',
    why: 'split(",") keeps the empty string between the two commas: ["a", "b", "", "c"].',
  },
  {
    id: 'x-str-join', topic: 'Strings', code: py`words = ["go", "gators"]
print("-".join(words).upper()[::-1])`,
    options: ['SROTAG-OG', 'GO-GATORS', 'OG-SROTAG', 'sorotag-og'], answer: 'SROTAG-OG',
    why: 'join gives "go-gators", upper makes "GO-GATORS", and [::-1] reverses it.',
  },
  {
    id: 'x-str-immutable', topic: 'Strings', prompt: 'Which line raises an error if s = "cat"?',
    options: ['s[0] = "b"', 's = "b" + s[1:]', 's.replace("c", "b")', 'print(s * 2)'], answer: 's[0] = "b"',
    why: 'Strings are immutable: you can\'t assign to an index. The others build new strings.',
  },
  // tuples & sets
  {
    id: 'x-tuple-unpack', topic: 'Tuples & sets', code: py`a, b = 1, 2
a, b = b, a + b
print(a, b)`,
    options: ['2 3', '2 4', '1 3', '3 2'], answer: '2 3',
    why: 'The right side is built first from the OLD values: (2, 1 + 2), then unpacked into a and b.',
  },
  {
    id: 'x-tuple-one', topic: 'Tuples & sets', code: py`x = (5)
y = (5,)
print(type(x).__name__, type(y).__name__)`,
    options: ['int tuple', 'tuple tuple', 'int int', 'tuple int'], answer: 'int tuple',
    why: 'Parentheses alone don\'t make a tuple: the comma does. (5) is just 5.',
  },
  {
    id: 'x-set-ops', topic: 'Tuples & sets', code: py`a = {1, 2, 3}
b = {2, 3, 4}
print(sorted(a & b), sorted(a - b), len(a | b))`,
    options: ['[2, 3] [1] 4', '[2, 3] [1, 4] 4', '[1, 4] [1] 6', '[2, 3] [1] 6'], answer: '[2, 3] [1] 4',
    why: '& is "in both", - is "in a but not b", | is "in either" ({1, 2, 3, 4} has 4 items).',
  },
  {
    id: 'x-set-key', topic: 'Tuples & sets', prompt: 'Which of these can be a dictionary key or a set member?',
    options: ['(1, 2)', '[1, 2]', '{1, 2}', '{"a": 1}'], answer: '(1, 2)',
    why: 'Keys and set members must be hashable (immutable). Tuples of immutable values are; lists, sets and dicts aren\'t.',
  },
  // dictionaries
  {
    id: 'x-dict-update', topic: 'Dictionaries', code: py`d = {"a": 1, "b": 2}
d["a"] += 10
d["c"] = d.get("c", 0) + 1
print(d)`,
    options: ["{'a': 11, 'b': 2, 'c': 1}", "{'a': 11, 'b': 2}", 'KeyError', "{'a': 1, 'b': 2, 'c': 1}"], answer: "{'a': 11, 'b': 2, 'c': 1}",
    why: '"a" exists so += works. "c" is missing, but .get gives the default 0 instead of a KeyError.',
  },
  {
    id: 'x-dict-keyerror', topic: 'Dictionaries', code: py`d = {"x": 1}
try:
    print(d["y"])
except KeyError:
    print("missing")
print("y" in d, 1 in d)`,
    options: ['missing\nFalse False', 'None\nFalse True', 'missing\nFalse True', 'KeyError'], answer: 'missing\nFalse False',
    why: '"in" checks KEYS, not values, so 1 in d is False too.',
  },
  {
    id: 'x-dict-loop', topic: 'Dictionaries', code: py`counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts["a"], len(counts))`,
    options: ['3 3', '3 6', '2 3', '1 3'], answer: '3 3',
    why: 'b:1, a:3, n:2. Three different letters, so three keys.',
  },
  {
    id: 'x-dict-items', topic: 'Dictionaries', code: py`d = {"b": 2, "a": 1}
print([k for k, v in sorted(d.items()) if v > 0])`,
    options: ["['a', 'b']", "['b', 'a']", '[1, 2]', "[('a', 1), ('b', 2)]"], answer: "['a', 'b']",
    why: 'sorted(d.items()) sorts the (key, value) pairs by key; the comprehension keeps just the keys.',
  },
  // recursion
  {
    id: 'x-rec-trace', topic: 'Recursion', code: py`def f(n):
    if n == 0:
        return 0
    return n % 10 + f(n // 10)

print(f(507))`,
    options: ['12', '507', '57', '7'], answer: '12',
    why: 'f adds up the digits: 7 + 0 + 5 = 12.',
  },
  {
    id: 'x-rec-print', topic: 'Recursion', code: py`def h(n):
    if n > 0:
        h(n - 1)
        print(n, end=" ")

h(3)`,
    options: ['1 2 3', '3 2 1', '3 2 1 0', '0 1 2 3'], answer: '1 2 3',
    why: 'The print comes AFTER the recursive call, so the deepest call (n = 1) prints first, on the way back up.',
  },
  {
    id: 'x-rec-base', topic: 'Recursion', prompt: 'What happens if a recursive function has no base case (or never reaches it)?',
    options: ['RecursionError (maximum recursion depth exceeded)', 'It returns None', 'It loops forever without an error', 'SyntaxError'], answer: 'RecursionError (maximum recursion depth exceeded)',
    why: 'Each call takes a spot on the call stack. Python stops at about 1000 calls deep and raises RecursionError.',
  },
  {
    id: 'x-rec-string', topic: 'Recursion', code: py`def m(s):
    if len(s) <= 1:
        return s
    return m(s[1:]) + s[0]

print(m("abc"))`,
    options: ['cba', 'abc', 'bca', 'cab'], answer: 'cba',
    why: 'm("abc") = m("bc") + "a" = (m("c") + "b") + "a" = "cba". It reverses the string.',
  },
  {
    id: 'x-rec-calls', topic: 'Recursion', code: py`def g(n):
    if n <= 1:
        return 1
    return g(n - 1) + g(n - 2)

print(g(4))`,
    options: ['5', '3', '8', '4'], answer: '5',
    why: 'g(0) = g(1) = 1, g(2) = 2, g(3) = 3, g(4) = 5. It\'s Fibonacci shifted by one.',
  },
  {
    id: 'x-rec-list', topic: 'Recursion', code: py`def k(lst):
    if not lst:
        return []
    return k(lst[1:]) + [lst[0] * 2]

print(k([1, 2, 3]))`,
    options: ['[6, 4, 2]', '[2, 4, 6]', '[2, 4, 6, 0]', '[3, 2, 1]'], answer: '[6, 4, 2]',
    why: 'Each call doubles the first item and puts it AFTER the result for the rest, so the list comes out reversed and doubled.',
  },
];

// ---------------------------------------------------------------- coding (5 points each)

export const MOCK_CODE = [
  {
    id: 'xc-count-evens', topic: 'Recursion', title: 'Count the evens', recurse: 'count_evens',
    prompt: 'Write count_evens(lst) RECURSIVELY (no loops) that returns how many even numbers are in lst.',
    starter: py`def count_evens(lst):
    pass
`,
    tests: [{ call: 'count_evens([1, 2, 4, 7])', expected: '2' }, { call: 'count_evens([])', expected: '0' }, { call: 'count_evens([3, 5])', expected: '0' }, { call: 'count_evens([0, -2, 8])', expected: '3' }],
    solution: py`def count_evens(lst):
    if not lst:
        return 0
    here = 1 if lst[0] % 2 == 0 else 0
    return here + count_evens(lst[1:])
`,
  },
  {
    id: 'xc-count-ones', topic: 'Recursion', title: 'Count the 1 bits', recurse: 'count_ones',
    prompt: 'Write count_ones(n) RECURSIVELY for n ≥ 0: how many 1s are in n written in binary. count_ones(13) is 3 (13 is 1101). Don\'t use bin().',
    starter: py`def count_ones(n):
    pass
`,
    tests: [{ call: 'count_ones(13)', expected: '3' }, { call: 'count_ones(0)', expected: '0' }, { call: 'count_ones(8)', expected: '1' }, { call: 'count_ones(255)', expected: '8' }],
    solution: py`def count_ones(n):
    if n == 0:
        return 0
    return n % 2 + count_ones(n // 2)
`,
  },
  {
    id: 'xc-rev-list', topic: 'Recursion', title: 'Reverse a list', recurse: 'rev_list',
    prompt: 'Write rev_list(lst) RECURSIVELY, returning a new reversed list (no [::-1], no .reverse()).',
    starter: py`def rev_list(lst):
    pass
`,
    tests: [{ call: 'rev_list([1, 2, 3])', expected: '[3, 2, 1]' }, { call: 'rev_list([])', expected: '[]' }, { call: "rev_list(['a'])", expected: "['a']" }],
    solution: py`def rev_list(lst):
    if not lst:
        return []
    return rev_list(lst[1:]) + [lst[0]]
`,
  },
  {
    id: 'xc-letter-freq', topic: 'Dictionaries', title: 'Letter frequency',
    prompt: 'Write letter_freq(text) that returns a dict counting each LETTER in text, lowercased. Ignore spaces, digits and punctuation.',
    starter: py`def letter_freq(text):
    pass
`,
    tests: [{ call: "letter_freq('Aa b!')", expected: "{'a': 2, 'b': 1}" }, { call: "letter_freq('123')", expected: '{}' }, { call: "letter_freq('Go Gators')", expected: "{'g': 2, 'o': 2, 'a': 1, 't': 1, 'r': 1, 's': 1}" }],
    solution: py`def letter_freq(text):
    counts = {}
    for ch in text.lower():
        if ch.isalpha():
            counts[ch] = counts.get(ch, 0) + 1
    return counts
`,
  },
  {
    id: 'xc-by-grade', topic: 'Dictionaries', title: 'Students by grade',
    prompt: 'grades maps student → letter grade. Write by_grade(grades) that returns a dict mapping each letter to a SORTED list of the students who got it.',
    starter: py`def by_grade(grades):
    pass
`,
    tests: [{ call: "by_grade({'zoe': 'A', 'ana': 'B', 'cy': 'A'})", expected: "{'A': ['cy', 'zoe'], 'B': ['ana']}" }, { call: 'by_grade({})', expected: '{}' }],
    solution: py`def by_grade(grades):
    out = {}
    for name, letter in grades.items():
        out.setdefault(letter, []).append(name)
    for letter in out:
        out[letter].sort()
    return out
`,
  },
  {
    id: 'xc-shared', topic: 'Tuples & sets', title: 'Shared and unique',
    prompt: 'Write compare(a, b) for two lists that returns a tuple (in_both, only_a): both are sorted lists without repeats.',
    starter: py`def compare(a, b):
    pass
`,
    tests: [{ call: 'compare([1, 2, 2, 3], [2, 3, 4])', expected: '([2, 3], [1])' }, { call: 'compare([], [1])', expected: '([], [])' }, { call: 'compare([5, 5], [6])', expected: '([], [5])' }],
    solution: py`def compare(a, b):
    sa, sb = set(a), set(b)
    return (sorted(sa & sb), sorted(sa - sb))
`,
  },
  {
    id: 'xc-to-hex', topic: 'Number systems', title: 'Decimal to hex by hand',
    prompt: 'Write to_hex(n) for n ≥ 0 that returns n in hexadecimal with UPPERCASE digits and no prefix, without hex(), format() or f-strings. to_hex(255) is "FF", to_hex(0) is "0".',
    starter: py`def to_hex(n):
    pass
`,
    tests: [{ call: 'to_hex(255)', expected: "'FF'" }, { call: 'to_hex(0)', expected: "'0'" }, { call: 'to_hex(26)', expected: "'1A'" }, { call: 'to_hex(4096)', expected: "'1000'" }],
    solution: py`def to_hex(n):
    digits = "0123456789ABCDEF"
    if n == 0:
        return "0"
    out = ""
    while n > 0:
        out = digits[n % 16] + out
        n //= 16
    return out
`,
  },
  {
    id: 'xc-compress', topic: 'Strings', title: 'Compress a string (RLE)',
    prompt: 'Write compress(text) that run-length encodes text: each run of the same character becomes the character followed by the run length. compress("aaabcc") is "a3b1c2".',
    starter: py`def compress(text):
    pass
`,
    tests: [{ call: "compress('aaabcc')", expected: "'a3b1c2'" }, { call: "compress('')", expected: "''" }, { call: "compress('x')", expected: "'x1'" }, { call: "compress('aabbaa')", expected: "'a2b2a2'" }],
    solution: py`def compress(text):
    out = ""
    i = 0
    while i < len(text):
        j = i
        while j < len(text) and text[j] == text[i]:
            j += 1
        out += text[i] + str(j - i)
        i = j
    return out
`,
  },
  {
    id: 'xc-row-sums', topic: 'Lists', title: 'Row and column sums',
    prompt: 'Write sums(grid) for a rectangular list of lists of numbers. Return a tuple (row_sums, col_sums), both lists.',
    starter: py`def sums(grid):
    pass
`,
    tests: [{ call: 'sums([[1, 2], [3, 4]])', expected: '([3, 7], [4, 6])' }, { call: 'sums([[5, 0, 1]])', expected: '([6], [5, 0, 1])' }],
    solution: py`def sums(grid):
    rows = [sum(row) for row in grid]
    cols = [sum(row[c] for row in grid) for c in range(len(grid[0]))]
    return (rows, cols)
`,
  },
];

// ---------------------------------------------------------------- interview practice

export const INTERVIEW = [
  {
    id: 'iv-fizzbuzz', title: 'FizzBuzz', level: 'Warm-up',
    prompt: 'Write fizzbuzz(n) that returns a list of strings for 1..n: "Fizz" for multiples of 3, "Buzz" for multiples of 5, "FizzBuzz" for both, otherwise the number as a string.',
    starter: py`def fizzbuzz(n):
    pass
`,
    tests: [{ call: 'fizzbuzz(5)', expected: "['1', '2', 'Fizz', '4', 'Buzz']" }, { call: 'fizzbuzz(15)[-1]', expected: "'FizzBuzz'" }, { call: 'fizzbuzz(0)', expected: '[]' }],
    hints: ['Loop i from 1 to n inclusive: range(1, n + 1).', 'Check the "both" case FIRST (i % 15 == 0), or it gets caught by the 3 or 5 check.', 'Use if / elif / elif / else and append str(i) in the last branch.'],
    solution: py`def fizzbuzz(n):
    out = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append("FizzBuzz")
        elif i % 3 == 0:
            out.append("Fizz")
        elif i % 5 == 0:
            out.append("Buzz")
        else:
            out.append(str(i))
    return out
`,
    big: { time: 'O(n)', space: 'O(n) for the result list' },
    tips: ['Talk through the order of your checks out loud: interviewers want to hear why 15 comes first.', 'Ask whether to return a list or print. Clarifying questions are a plus, not a weakness.'],
  },
  {
    id: 'iv-reverse-words', title: 'Reverse the words', level: 'Warm-up',
    prompt: 'Write reverse_words(s) that returns the words of s in reverse order, separated by single spaces. Extra spaces in s should disappear.',
    starter: py`def reverse_words(s):
    pass
`,
    tests: [{ call: "reverse_words('go gators go')", expected: "'go gators go'" }, { call: "reverse_words('hello world')", expected: "'world hello'" }, { call: "reverse_words('  a   b ')", expected: "'b a'" }, { call: "reverse_words('')", expected: "''" }],
    hints: ['s.split() with no argument splits on any run of whitespace and drops empty pieces.', 'Reverse the list of words: words[::-1] or reversed(words).', '" ".join(...) glues them back with single spaces.'],
    solution: py`def reverse_words(s):
    return " ".join(s.split()[::-1])
`,
    big: { time: 'O(n)', space: 'O(n)' },
    tips: ['Mention edge cases before coding: empty string, extra spaces, a single word.', 'If they ask for "no built-ins", be ready to explain a manual two-pointer approach.'],
  },
  {
    id: 'iv-two-sum', title: 'Two Sum', level: 'Classic',
    prompt: 'Write two_sum(nums, target) that returns the indexes [i, j] (i < j) of the two numbers that add up to target. Exactly one answer exists.',
    starter: py`def two_sum(nums, target):
    pass
`,
    tests: [{ call: 'two_sum([2, 7, 11, 15], 9)', expected: '[0, 1]' }, { call: 'two_sum([3, 2, 4], 6)', expected: '[1, 2]' }, { call: 'two_sum([3, 3], 6)', expected: '[0, 1]' }, { call: 'two_sum([1, 5, 9, -2], 7)', expected: '[2, 3]' }],
    hints: ['The obvious way checks every pair with two loops: O(n²). Start there if you\'re stuck, then improve.', 'For each number x, the partner you need is target − x. How could you remember which numbers you\'ve already seen, and where?', 'Use a dict value → index. Before storing x, check if target − x is already in the dict.'],
    solution: py`def two_sum(nums, target):
    seen = {}
    for j, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], j]
        seen[x] = j
`,
    big: { time: 'O(n) with a dict (vs O(n²) with two loops)', space: 'O(n) for the dict' },
    tips: ['Say the brute-force version first, then improve it. Interviewers love seeing that progression.', 'Explain the time/space trade-off: the dict uses memory to save time.', 'Check the duplicate case ([3, 3], 6): it\'s why you look up BEFORE inserting.'],
  },
  {
    id: 'iv-valid-parens', title: 'Valid parentheses', level: 'Classic',
    prompt: 'Write is_valid(s) for a string of the characters ()[]{} that returns True if every bracket is closed by the same type, in the right order.',
    starter: py`def is_valid(s):
    pass
`,
    tests: [{ call: "is_valid('()[]{}')", expected: 'True' }, { call: "is_valid('([{}])')", expected: 'True' }, { call: "is_valid('(]')", expected: 'False' }, { call: "is_valid('([)]')", expected: 'False' }, { call: "is_valid('((')", expected: 'False' }, { call: "is_valid('')", expected: 'True' }],
    hints: ['The most recent unclosed bracket has to close first. What data structure is "last in, first out"?', 'Use a list as a stack: push openers, and for a closer, pop and check it matches.', 'A dict like {")": "(", "]": "[", "}": "{"} makes the match check easy. At the end, the stack must be empty.'],
    solution: py`def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack
`,
    big: { time: 'O(n)', space: 'O(n) for the stack' },
    tips: ['Name the data structure out loud ("this is a stack problem"). Pattern recognition is what they\'re testing.', 'Remember the leftover case: "((" never fails during the loop, so check the stack at the end.'],
  },
  {
    id: 'iv-anagram', title: 'Anagram check', level: 'Classic',
    prompt: 'Write is_anagram(a, b) that returns True if b uses exactly the same letters as a, the same number of times (case-sensitive).',
    starter: py`def is_anagram(a, b):
    pass
`,
    tests: [{ call: "is_anagram('listen', 'silent')", expected: 'True' }, { call: "is_anagram('rat', 'car')", expected: 'False' }, { call: "is_anagram('aab', 'abb')", expected: 'False' }, { call: "is_anagram('', '')", expected: 'True' }],
    hints: ['Quick win: if the lengths differ, it\'s False.', 'One simple way: sorted(a) == sorted(b). That\'s O(n log n).', 'For O(n), count letters with a dict for a, subtract for b, and check everything ends at 0.'],
    solution: py`def is_anagram(a, b):
    if len(a) != len(b):
        return False
    counts = {}
    for ch in a:
        counts[ch] = counts.get(ch, 0) + 1
    for ch in b:
        if counts.get(ch, 0) == 0:
            return False
        counts[ch] -= 1
    return True
`,
    big: { time: 'O(n) counting (O(n log n) if you sort)', space: 'O(k) for k different letters' },
    tips: ['Offer both solutions and compare them. Showing you know two ways is a strong signal.', 'Ask: does case matter? Spaces? Unicode? Clarifying the input is part of the job.'],
  },
  {
    id: 'iv-first-unique', title: 'First non-repeating character', level: 'Classic',
    prompt: 'Write first_unique_index(s) that returns the INDEX of the first character that appears only once, or -1 if there isn\'t one.',
    starter: py`def first_unique_index(s):
    pass
`,
    tests: [{ call: "first_unique_index('leetcode')", expected: '0' }, { call: "first_unique_index('loveleetcode')", expected: '2' }, { call: "first_unique_index('aabb')", expected: '-1' }, { call: "first_unique_index('')", expected: '-1' }],
    hints: ['Two passes is fine: one to count, one to find.', 'Count every character in a dict first.', 'Then loop with enumerate(s) and return the first index whose character has count 1.'],
    solution: py`def first_unique_index(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1
`,
    big: { time: 'O(n) (two passes is still linear)', space: 'O(k) for k different characters' },
    tips: ['People often think two passes is "slow". Point out that 2n is still O(n).', 'Avoid s.count(ch) inside a loop: that\'s O(n²). Say so if you notice it.'],
  },
  {
    id: 'iv-binary-search', title: 'Binary search', level: 'Classic',
    prompt: 'Write binary_search(nums, target) for a SORTED list that returns the index of target, or -1. Don\'t use .index() or in; cut the search range in half each step.',
    starter: py`def binary_search(nums, target):
    pass
`,
    tests: [{ call: 'binary_search([1, 3, 5, 7, 9], 7)', expected: '3' }, { call: 'binary_search([1, 3, 5, 7, 9], 4)', expected: '-1' }, { call: 'binary_search([], 1)', expected: '-1' }, { call: 'binary_search([2], 2)', expected: '0' }, { call: 'binary_search(list(range(0, 1000, 2)), 998)', expected: '499' }],
    hints: ['Keep two markers, lo = 0 and hi = len(nums) - 1, and loop while lo <= hi.', 'Look at the middle: mid = (lo + hi) // 2. Found it? Return mid.', 'If nums[mid] < target the answer is to the right (lo = mid + 1), otherwise to the left (hi = mid - 1).'],
    solution: py`def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
    big: { time: 'O(log n)', space: 'O(1)' },
    tips: ['Off-by-one errors are the classic trap: walk through a 1- and 2-item list out loud.', 'Mention that it only works because the list is sorted.'],
  },
  {
    id: 'iv-max-subarray', title: 'Maximum subarray', level: 'Stretch',
    prompt: 'Write max_subarray(nums) that returns the largest sum of any non-empty run of neighbouring numbers. [-2, 1, -3, 4, -1, 2, 1, -5, 4] → 6 (from 4, -1, 2, 1).',
    starter: py`def max_subarray(nums):
    pass
`,
    tests: [{ call: 'max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])', expected: '6' }, { call: 'max_subarray([1])', expected: '1' }, { call: 'max_subarray([-3, -1, -2])', expected: '-1' }, { call: 'max_subarray([5, 4, -1, 7, 8])', expected: '23' }],
    hints: ['Brute force tries every start and end: O(n²). Can you do it in one pass?', 'Walk left to right keeping the best sum of a run that ENDS here. Should you extend the previous run or start fresh at this number?', 'current = max(x, current + x); best = max(best, current). Start both at nums[0] so all-negative lists work.'],
    solution: py`def max_subarray(nums):
    current = best = nums[0]
    for x in nums[1:]:
        current = max(x, current + x)
        best = max(best, current)
    return best
`,
    big: { time: 'O(n) (Kadane\'s algorithm)', space: 'O(1)' },
    tips: ['Name it if you know it ("Kadane\'s algorithm"), but explain the idea in plain words too.', 'The all-negative case trips people up: starting best at 0 is a bug.'],
  },
  {
    id: 'iv-merge-sorted', title: 'Merge two sorted lists', level: 'Classic',
    prompt: 'Write merge(a, b) that merges two sorted lists into one sorted list in O(len(a) + len(b)). Don\'t call sorted() or .sort().',
    starter: py`def merge(a, b):
    pass
`,
    tests: [{ call: 'merge([1, 4, 6], [2, 3, 7])', expected: '[1, 2, 3, 4, 6, 7]' }, { call: 'merge([], [1, 2])', expected: '[1, 2]' }, { call: 'merge([1, 1], [1])', expected: '[1, 1, 1]' }, { call: 'merge([], [])', expected: '[]' }],
    hints: ['Use one pointer into each list, i and j, both starting at 0.', 'While both have items left, append the smaller of a[i] and b[j] and move that pointer.', 'When one runs out, add whatever is left of the other: out + a[i:] + b[j:].'],
    solution: py`def merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i])
            i += 1
        else:
            out.append(b[j])
            j += 1
    return out + a[i:] + b[j:]
`,
    big: { time: 'O(n + m)', space: 'O(n + m) for the result' },
    tips: ['This is the "merge" step of merge sort. Mentioning that shows you see the bigger picture.', 'Using <= keeps it stable (equal items keep their order).'],
  },
  {
    id: 'iv-missing', title: 'Missing number', level: 'Classic',
    prompt: 'nums holds n different numbers from 0..n with exactly one missing. Write missing(nums) that returns the missing one.',
    starter: py`def missing(nums):
    pass
`,
    tests: [{ call: 'missing([3, 0, 1])', expected: '2' }, { call: 'missing([0, 1])', expected: '2' }, { call: 'missing([1])', expected: '0' }, { call: 'missing([9, 6, 4, 2, 3, 5, 7, 0, 1])', expected: '8' }],
    hints: ['A set works: check which of 0..n is not in set(nums). That\'s O(n) time and O(n) space.', 'Can you do it without extra memory? Think about what 0 + 1 + … + n adds up to.', 'n * (n + 1) // 2 − sum(nums) is the missing number, where n = len(nums).'],
    solution: py`def missing(nums):
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)
`,
    big: { time: 'O(n)', space: 'O(1) with the sum formula' },
    tips: ['Start with the set idea, then improve to O(1) space. Showing the step up is the point.', 'Mention the formula for 0..n (Gauss) and why it works.'],
  },
  {
    id: 'iv-clean-palindrome', title: 'Palindrome (ignore punctuation)', level: 'Classic',
    prompt: 'Write is_pal(s) that returns True if s reads the same backwards when you ignore case and anything that isn\'t a letter or digit. "A man, a plan, a canal: Panama" is True.',
    starter: py`def is_pal(s):
    pass
`,
    tests: [{ call: "is_pal('A man, a plan, a canal: Panama')", expected: 'True' }, { call: "is_pal('race a car')", expected: 'False' }, { call: "is_pal(' ')", expected: 'True' }, { call: "is_pal('No lemon, no melon')", expected: 'True' }],
    hints: ['First build a cleaned string: keep only ch.isalnum() characters, lowercased.', 'Then compare it with its reverse: cleaned == cleaned[::-1].', 'For bonus points, do it with two pointers moving inward, skipping junk, with no extra string (O(1) space).'],
    solution: py`def is_pal(s):
    cleaned = "".join(ch.lower() for ch in s if ch.isalnum())
    return cleaned == cleaned[::-1]
`,
    big: { time: 'O(n)', space: 'O(n) for the cleaned copy (O(1) with two pointers)' },
    tips: ['Clarify the rules first (case? spaces? digits?). The prompt is often vague on purpose.', 'Write a helper or a comprehension rather than a long chain of ifs; readability counts.'],
  },
  {
    id: 'iv-move-zeroes', title: 'Move the zeroes', level: 'Classic',
    prompt: 'Write move_zeroes(nums) that moves every 0 to the end while keeping the order of the other numbers, changing nums IN PLACE and also returning it.',
    starter: py`def move_zeroes(nums):
    pass
`,
    tests: [{ call: 'move_zeroes([0, 1, 0, 3, 12])', expected: '[1, 3, 12, 0, 0]' }, { call: 'move_zeroes([0])', expected: '[0]' }, { call: 'move_zeroes([1, 2])', expected: '[1, 2]' }, { call: 'move_zeroes([0, 0, 1])', expected: '[1, 0, 0]' }],
    hints: ['Keep a "write" position that starts at 0.', 'Walk through nums; every non-zero gets copied to nums[write], then write += 1.', 'Afterwards, fill everything from write to the end with 0.'],
    solution: py`def move_zeroes(nums):
    write = 0
    for x in nums:
        if x != 0:
            nums[write] = x
            write += 1
    for i in range(write, len(nums)):
        nums[i] = 0
    return nums
`,
    big: { time: 'O(n)', space: 'O(1) (in place)' },
    tips: ['"In place" means no second list. Say how your approach respects that.', 'The two-pointer pattern (one reads, one writes) shows up in lots of array questions.'],
  },
];
