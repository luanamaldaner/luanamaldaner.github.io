// Practice bank for Programming 1 (COP3502C, Python). Function problems are
// checked by calling the function; input/output problems by feeding stdin and
// comparing what's printed (input() prompts are ignored when checking).

const py = String.raw;

export const MODULES = [
  ['M2', 'Variables & I/O'],
  ['M3', 'Conditionals'],
  ['M4', 'Loops'],
  ['M5', 'Functions'],
  ['M7A', 'Number systems & lists'],
  ['M7B', 'Tuples, sets & dicts'],
  ['M8', 'Recursion'],
];

export const EXAM2 = ['M7A', 'M7B', 'M8'];

export const PROBLEMS = [
  // ------------------------------------------------------------ M2
  {
    id: 'm2-greet', module: 'M2', title: 'Say hello',
    prompt: 'Read a name with input() and print "Hello, NAME!".',
    starter: py`name = input("What's your name? ")
`,
    tests: [{ stdin: 'Luana', expected: 'Hello, Luana!' }, { stdin: 'Albert', expected: 'Hello, Albert!' }],
    hint: 'An f-string makes this easy: f"Hello, {name}!"',
    solution: py`name = input("What's your name? ")
print(f"Hello, {name}!")
`,
  },
  {
    id: 'm2-temp', module: 'M2', title: 'Fahrenheit to Celsius',
    prompt: 'Read a temperature in °F (it may have decimals) and print it in °C with exactly one decimal place. C = (F − 32) × 5/9.',
    starter: py`f = input("Temperature in F: ")
`,
    tests: [{ stdin: '98.6', expected: '37.0' }, { stdin: '32', expected: '0.0' }, { stdin: '-40', expected: '-40.0' }, { stdin: '212', expected: '100.0' }],
    hint: 'input() gives you a string: wrap it in float(). Then print(f"{c:.1f}").',
    solution: py`f = float(input("Temperature in F: "))
c = (f - 32) * 5 / 9
print(f"{c:.1f}")
`,
  },
  {
    id: 'm2-coins', module: 'M2', title: 'Make change',
    prompt: 'Read a whole number of cents (0–99). Print how many quarters, dimes, nickels and pennies make it, using the fewest coins, one per line like "Quarters: 2".',
    starter: py`cents = int(input("Cents: "))
`,
    tests: [
      { stdin: '68', expected: 'Quarters: 2\nDimes: 1\nNickels: 1\nPennies: 3' },
      { stdin: '99', expected: 'Quarters: 3\nDimes: 2\nNickels: 0\nPennies: 4' },
      { stdin: '0', expected: 'Quarters: 0\nDimes: 0\nNickels: 0\nPennies: 0' },
    ],
    hint: 'Use // to count coins and % to keep what is left over.',
    solution: py`cents = int(input("Cents: "))
quarters = cents // 25
cents %= 25
dimes = cents // 10
cents %= 10
nickels = cents // 5
pennies = cents % 5
print(f"Quarters: {quarters}")
print(f"Dimes: {dimes}")
print(f"Nickels: {nickels}")
print(f"Pennies: {pennies}")
`,
  },
  {
    id: 'm2-clock', module: 'M2', title: 'Seconds to a clock',
    prompt: 'Write format_time(seconds) that returns the time as "H:MM:SS". Minutes and seconds always have two digits.',
    starter: py`def format_time(seconds):
    pass
`,
    tests: [{ call: 'format_time(3661)', expected: "'1:01:01'" }, { call: 'format_time(59)', expected: "'0:00:59'" }, { call: 'format_time(86399)', expected: "'23:59:59'" }, { call: 'format_time(600)', expected: "'0:10:00'" }],
    hint: 'hours = seconds // 3600, minutes = seconds % 3600 // 60. Pad with f"{minutes:02d}".',
    solution: py`def format_time(seconds):
    hours = seconds // 3600
    minutes = seconds % 3600 // 60
    secs = seconds % 60
    return f"{hours}:{minutes:02d}:{secs:02d}"
`,
  },

  // ------------------------------------------------------------ M3
  {
    id: 'm3-grade', module: 'M3', title: 'Letter grade',
    prompt: 'Write letter_grade(score): 90+ is "A", 80+ "B", 70+ "C", 60+ "D", anything lower "F".',
    starter: py`def letter_grade(score):
    pass
`,
    tests: [{ call: 'letter_grade(95)', expected: "'A'" }, { call: 'letter_grade(90)', expected: "'A'" }, { call: 'letter_grade(89.9)', expected: "'B'" }, { call: 'letter_grade(70)', expected: "'C'" }, { call: 'letter_grade(61)', expected: "'D'" }, { call: 'letter_grade(12)', expected: "'F'" }],
    hint: 'An if / elif chain from the top grade down. Once one branch matches, the rest are skipped.',
    solution: py`def letter_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    return "F"
`,
  },
  {
    id: 'm3-leap', module: 'M3', title: 'Leap year',
    prompt: 'Write is_leap(year). A year is a leap year if it is divisible by 4, except years divisible by 100, unless they are also divisible by 400.',
    starter: py`def is_leap(year):
    pass
`,
    tests: [{ call: 'is_leap(2024)', expected: 'True' }, { call: 'is_leap(2023)', expected: 'False' }, { call: 'is_leap(1900)', expected: 'False' }, { call: 'is_leap(2000)', expected: 'True' }],
    hint: 'year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)',
    solution: py`def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
`,
  },
  {
    id: 'm3-ticket', module: 'M3', title: 'Movie ticket price',
    prompt: 'Write ticket_price(age, matinee). Kids under 13 pay $8, seniors 65+ pay $9, everyone else $12. A matinee takes $3 off. Return the price as an int.',
    starter: py`def ticket_price(age, matinee):
    pass
`,
    tests: [{ call: 'ticket_price(10, False)', expected: '8' }, { call: 'ticket_price(13, False)', expected: '12' }, { call: 'ticket_price(65, True)', expected: '6' }, { call: 'ticket_price(30, True)', expected: '9' }, { call: 'ticket_price(64, False)', expected: '12' }],
    hint: 'Pick the base price with if/elif/else first, then subtract 3 if matinee is True.',
    solution: py`def ticket_price(age, matinee):
    if age < 13:
        price = 8
    elif age >= 65:
        price = 9
    else:
        price = 12
    if matinee:
        price -= 3
    return price
`,
  },
  {
    id: 'm3-largest', module: 'M3', title: 'Largest of three',
    prompt: 'Write largest(a, b, c) that returns the biggest of the three numbers without using max().',
    starter: py`def largest(a, b, c):
    pass
`,
    tests: [{ call: 'largest(1, 2, 3)', expected: '3' }, { call: 'largest(9, 2, 3)', expected: '9' }, { call: 'largest(4, 7, 7)', expected: '7' }, { call: 'largest(-5, -2, -9)', expected: '-2' }],
    hint: 'Keep a "best so far": start with a, then compare b and c to it.',
    solution: py`def largest(a, b, c):
    best = a
    if b > best:
        best = b
    if c > best:
        best = c
    return best
`,
  },
  {
    id: 'm3-triangle', module: 'M3', title: 'Kind of triangle',
    prompt: 'Write triangle_type(a, b, c) for three side lengths. Return "not a triangle" if any two sides add up to no more than the third. Otherwise return "equilateral", "isosceles" or "scalene".',
    starter: py`def triangle_type(a, b, c):
    pass
`,
    tests: [{ call: 'triangle_type(3, 3, 3)', expected: "'equilateral'" }, { call: 'triangle_type(3, 3, 5)', expected: "'isosceles'" }, { call: 'triangle_type(3, 4, 5)', expected: "'scalene'" }, { call: 'triangle_type(1, 2, 3)', expected: "'not a triangle'" }, { call: 'triangle_type(5, 3, 3)', expected: "'isosceles'" }],
    hint: 'Check the "not a triangle" case first: a + b <= c or a + c <= b or b + c <= a.',
    solution: py`def triangle_type(a, b, c):
    if a + b <= c or a + c <= b or b + c <= a:
        return "not a triangle"
    if a == b == c:
        return "equilateral"
    if a == b or b == c or a == c:
        return "isosceles"
    return "scalene"
`,
  },

  // ------------------------------------------------------------ M4
  {
    id: 'm4-digits', module: 'M4', title: 'Sum of digits',
    prompt: 'Write sum_digits(n) for a non-negative int, using a while loop (no str()).',
    starter: py`def sum_digits(n):
    pass
`,
    tests: [{ call: 'sum_digits(1234)', expected: '10' }, { call: 'sum_digits(0)', expected: '0' }, { call: 'sum_digits(9999)', expected: '36' }, { call: 'sum_digits(105)', expected: '6' }],
    hint: 'n % 10 is the last digit; n // 10 chops it off. Loop while n > 0.',
    solution: py`def sum_digits(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total
`,
  },
  {
    id: 'm4-fizzbuzz', module: 'M4', title: 'FizzBuzz',
    prompt: 'Read n. Print the numbers 1 to n, one per line, but print "Fizz" for multiples of 3, "Buzz" for multiples of 5 and "FizzBuzz" for multiples of both.',
    starter: py`n = int(input())
`,
    tests: [{ stdin: '5', expected: '1\n2\nFizz\n4\nBuzz' }, { stdin: '15', expected: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz' }],
    hint: 'Check the "both" case (i % 15 == 0) first.',
    solution: py`n = int(input())
for i in range(1, n + 1):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
`,
  },
  {
    id: 'm4-blackjack', module: 'M4', title: 'Blackjack hand value',
    prompt: 'Write hand_value(cards), where cards is a list like ["A", "K", "7"]. Number cards are worth their number, J/Q/K are 10, and each A is 11 unless that would bust (go over 21), in which case it counts as 1.',
    starter: py`def hand_value(cards):
    pass
`,
    tests: [{ call: "hand_value(['A', 'K'])", expected: '21' }, { call: "hand_value(['A', 'A', '9'])", expected: '21' }, { call: "hand_value(['K', 'Q', '5'])", expected: '25' }, { call: "hand_value(['A', '5', 'A', '10'])", expected: '17' }, { call: "hand_value(['2', '3'])", expected: '5' }],
    hint: 'Count every A as 11 and remember how many you have. Then, while the total is over 21 and you still have an 11-ace, subtract 10.',
    solution: py`def hand_value(cards):
    total = 0
    aces = 0
    for card in cards:
        if card == "A":
            total += 11
            aces += 1
        elif card in ("J", "Q", "K"):
            total += 10
        else:
            total += int(card)
    while total > 21 and aces > 0:
        total -= 10
        aces -= 1
    return total
`,
  },
  {
    id: 'm4-vowels', module: 'M4', title: 'Count the vowels',
    prompt: 'Write count_vowels(text) that counts a, e, i, o, u (upper or lower case).',
    starter: py`def count_vowels(text):
    pass
`,
    tests: [{ call: "count_vowels('Gators')", expected: '2' }, { call: "count_vowels('AEIOU aeiou')", expected: '10' }, { call: "count_vowels('rhythm')", expected: '0' }, { call: "count_vowels('')", expected: '0' }],
    hint: 'Loop over text.lower() and check "if ch in \'aeiou\'".',
    solution: py`def count_vowels(text):
    count = 0
    for ch in text.lower():
        if ch in "aeiou":
            count += 1
    return count
`,
  },
  {
    id: 'm4-prime', module: 'M4', title: 'Is it prime?',
    prompt: 'Write is_prime(n). Numbers below 2 are not prime.',
    starter: py`def is_prime(n):
    pass
`,
    tests: [{ call: 'is_prime(2)', expected: 'True' }, { call: 'is_prime(1)', expected: 'False' }, { call: 'is_prime(17)', expected: 'True' }, { call: 'is_prime(21)', expected: 'False' }, { call: 'is_prime(97)', expected: 'True' }, { call: 'is_prime(100)', expected: 'False' }],
    hint: 'Try every divisor from 2 up to the square root (d * d <= n). If any divides evenly, it is not prime.',
    solution: py`def is_prime(n):
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True
`,
  },
  {
    id: 'm4-calc', module: 'M4', title: 'Mini calculator',
    prompt: 'Write calc(a, op, b) for op in "+", "-", "*", "/", "^" (power). Dividing by zero returns None. Any other op returns None too.',
    starter: py`def calc(a, op, b):
    pass
`,
    tests: [{ call: "calc(3, '+', 4)", expected: '7' }, { call: "calc(10, '/', 4)", expected: '2.5' }, { call: "calc(2, '^', 10)", expected: '1024' }, { call: "calc(5, '/', 0)", expected: 'None' }, { call: "calc(5, '%', 2)", expected: 'None' }, { call: "calc(6, '*', 7)", expected: '42' }],
    hint: 'One if/elif per operator. Python\'s power operator is **, not ^.',
    solution: py`def calc(a, op, b):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        if b == 0:
            return None
        return a / b
    elif op == "^":
        return a ** b
    return None
`,
  },
  {
    id: 'm4-stars', module: 'M4', title: 'Star staircase',
    prompt: 'Read n and print a right triangle of stars with n rows: 1 star on the first row, n on the last.',
    starter: py`n = int(input())
`,
    tests: [{ stdin: '3', expected: '*\n**\n***' }, { stdin: '1', expected: '*' }, { stdin: '5', expected: '*\n**\n***\n****\n*****' }],
    hint: 'for row in range(1, n + 1): print("*" * row)',
    solution: py`n = int(input())
for row in range(1, n + 1):
    print("*" * row)
`,
  },

  // ------------------------------------------------------------ M5
  {
    id: 'm5-count-char', module: 'M5', title: 'Count a character',
    prompt: 'Write count_char(text, ch) that returns how many times ch appears in text, without using .count().',
    starter: py`def count_char(text, ch):
    pass
`,
    tests: [{ call: "count_char('banana', 'a')", expected: '3' }, { call: "count_char('banana', 'z')", expected: '0' }, { call: "count_char('', 'a')", expected: '0' }, { call: "count_char('Mississippi', 's')", expected: '4' }],
    hint: 'A counter that goes up by one each time a letter matches.',
    solution: py`def count_char(text, ch):
    count = 0
    for c in text:
        if c == ch:
            count += 1
    return count
`,
  },
  {
    id: 'm5-palindrome', module: 'M5', title: 'Palindrome check',
    prompt: 'Write is_palindrome(text). Ignore case and anything that is not a letter or digit, so "Race car!" counts.',
    starter: py`def is_palindrome(text):
    pass
`,
    tests: [{ call: "is_palindrome('Race car!')", expected: 'True' }, { call: "is_palindrome('gator')", expected: 'False' }, { call: "is_palindrome('A man, a plan, a canal: Panama')", expected: 'True' }, { call: "is_palindrome('')", expected: 'True' }],
    hint: 'Build a cleaned string with only ch.isalnum() characters, lowercased, then compare it with cleaned[::-1].',
    solution: py`def is_palindrome(text):
    cleaned = ""
    for ch in text:
        if ch.isalnum():
            cleaned += ch.lower()
    return cleaned == cleaned[::-1]
`,
  },
  {
    id: 'm5-average', module: 'M5', title: 'Average of a list',
    prompt: 'Write average(nums) that returns the mean as a float. An empty list returns 0.0.',
    starter: py`def average(nums):
    pass
`,
    tests: [{ call: 'average([1, 2, 3, 4])', expected: '2.5' }, { call: 'average([])', expected: '0.0' }, { call: 'average([7])', expected: '7.0' }, { call: 'average([-1, 1])', expected: '0.0' }],
    hint: 'Guard the empty case first (dividing by len([]) is a ZeroDivisionError).',
    solution: py`def average(nums):
    if len(nums) == 0:
        return 0.0
    return sum(nums) / len(nums)
`,
  },
  {
    id: 'm5-greeting', module: 'M5', title: 'Default arguments',
    prompt: 'Write greet(name, greeting="Hello") that returns "Hello, Luana!" style text. greet("Al", "Hi") gives "Hi, Al!".',
    starter: py`def greet(name, greeting="Hello"):
    pass
`,
    tests: [{ call: "greet('Luana')", expected: "'Hello, Luana!'" }, { call: "greet('Al', 'Hi')", expected: "'Hi, Al!'" }, { call: "greet(greeting='Hey', name='Sam')", expected: "'Hey, Sam!'" }],
    hint: 'return f"{greeting}, {name}!"',
    solution: py`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"
`,
  },
  {
    id: 'm5-clamp', module: 'M5', title: 'Clamp a value',
    prompt: 'Write clamp(x, low, high) that returns x, but never below low or above high.',
    starter: py`def clamp(x, low, high):
    pass
`,
    tests: [{ call: 'clamp(5, 0, 10)', expected: '5' }, { call: 'clamp(-3, 0, 10)', expected: '0' }, { call: 'clamp(42, 0, 10)', expected: '10' }, { call: 'clamp(0.5, 0, 1)', expected: '0.5' }],
    hint: 'Two ifs, or max(low, min(x, high)).',
    solution: py`def clamp(x, low, high):
    if x < low:
        return low
    if x > high:
        return high
    return x
`,
  },

  // ------------------------------------------------------------ M7A
  {
    id: 'm7a-to-binary', module: 'M7A', title: 'Decimal to binary',
    prompt: 'Write to_binary(n) that returns the binary digits of a non-negative int as a string, without bin() or format().',
    starter: py`def to_binary(n):
    pass
`,
    tests: [{ call: 'to_binary(0)', expected: "'0'" }, { call: 'to_binary(5)', expected: "'101'" }, { call: 'to_binary(10)', expected: "'1010'" }, { call: 'to_binary(255)', expected: "'11111111'" }],
    hint: 'Repeatedly take n % 2 (the next bit, from the right) and do n //= 2. Build the string backwards.',
    solution: py`def to_binary(n):
    if n == 0:
        return "0"
    bits = ""
    while n > 0:
        bits = str(n % 2) + bits
        n //= 2
    return bits
`,
  },
  {
    id: 'm7a-from-binary', module: 'M7A', title: 'Binary to decimal',
    prompt: 'Write from_binary(bits) that turns a string like "1011" into the int 11, without int(bits, 2).',
    starter: py`def from_binary(bits):
    pass
`,
    tests: [{ call: "from_binary('1011')", expected: '11' }, { call: "from_binary('0')", expected: '0' }, { call: "from_binary('11111111')", expected: '255' }, { call: "from_binary('100000')", expected: '32' }],
    hint: 'Left to right: value = value * 2 + int(bit).',
    solution: py`def from_binary(bits):
    value = 0
    for bit in bits:
        value = value * 2 + int(bit)
    return value
`,
  },
  {
    id: 'm7a-to-hex', module: 'M7A', title: 'Decimal to hex',
    prompt: 'Write to_hex(n) that returns a non-negative int in hexadecimal with uppercase digits, e.g. 255 → "FF", without hex().',
    starter: py`def to_hex(n):
    pass
`,
    tests: [{ call: 'to_hex(255)', expected: "'FF'" }, { call: 'to_hex(0)', expected: "'0'" }, { call: 'to_hex(4096)', expected: "'1000'" }, { call: 'to_hex(48879)', expected: "'BEEF'" }],
    hint: 'Same idea as binary but with % 16 and // 16, and a digit string "0123456789ABCDEF" to look up each digit.',
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
    id: 'm7a-convert', module: 'M7A', title: 'Any base to any base',
    prompt: 'Write convert(num, from_base, to_base) for bases 2–16. num is a string (digits 0–9, A–F, either case); return an uppercase string.',
    starter: py`def convert(num, from_base, to_base):
    pass
`,
    tests: [{ call: "convert('FF', 16, 2)", expected: "'11111111'" }, { call: "convert('777', 8, 10)", expected: "'511'" }, { call: "convert('101', 2, 16)", expected: "'5'" }, { call: "convert('0', 10, 2)", expected: "'0'" }, { call: "convert('beef', 16, 10)", expected: "'48879'" }],
    hint: 'Two steps: string → decimal int (value = value * base + digit), then int → string in the new base.',
    solution: py`def convert(num, from_base, to_base):
    digits = "0123456789ABCDEF"
    value = 0
    for ch in num.upper():
        value = value * from_base + digits.index(ch)
    if value == 0:
        return "0"
    out = ""
    while value > 0:
        out = digits[value % to_base] + out
        value //= to_base
    return out
`,
  },
  {
    id: 'm7a-hexstring', module: 'M7A', title: 'RLE: to_hex_string',
    prompt: 'Project 2 style. Write to_hex_string(data): each number in the list (0–15) becomes one lowercase hex digit. [3, 15, 6, 4] → "3f64".',
    starter: py`def to_hex_string(data):
    pass
`,
    tests: [{ call: 'to_hex_string([3, 15, 6, 4])', expected: "'3f64'" }, { call: 'to_hex_string([])', expected: "''" }, { call: 'to_hex_string([10, 11, 12, 0])', expected: "'abc0'" }],
    hint: '"0123456789abcdef"[value] gives the digit for one value.',
    solution: py`def to_hex_string(data):
    digits = "0123456789abcdef"
    out = ""
    for value in data:
        out += digits[value]
    return out
`,
  },
  {
    id: 'm7a-count-runs', module: 'M7A', title: 'RLE: count_runs',
    prompt: 'Project 2 style. Write count_runs(flat_data): how many runs the list splits into, where a run is repeated values and no run can be longer than 15.',
    starter: py`def count_runs(flat_data):
    pass
`,
    tests: [{ call: 'count_runs([15, 15, 15, 4, 4, 4, 4, 4, 4])', expected: '2' }, { call: 'count_runs([1, 2, 3])', expected: '3' }, { call: 'count_runs([7] * 17)', expected: '2' }, { call: 'count_runs([])', expected: '0' }, { call: 'count_runs([5] * 15)', expected: '1' }],
    hint: 'Walk the list keeping the current run length. Start a new run when the value changes or the run hits 15.',
    solution: py`def count_runs(flat_data):
    runs = 0
    length = 0
    prev = None
    for value in flat_data:
        if value == prev and length < 15:
            length += 1
        else:
            runs += 1
            length = 1
            prev = value
    return runs
`,
  },
  {
    id: 'm7a-encode-rle', module: 'M7A', title: 'RLE: encode_rle',
    prompt: 'Project 2 style. Write encode_rle(flat_data): return [length, value, length, value, …]. Runs longer than 15 are split.',
    starter: py`def encode_rle(flat_data):
    pass
`,
    tests: [{ call: 'encode_rle([15, 15, 15, 4, 4, 4, 4, 4, 4])', expected: '[3, 15, 6, 4]' }, { call: 'encode_rle([1, 2, 2])', expected: '[1, 1, 2, 2]' }, { call: 'encode_rle([7] * 17)', expected: '[15, 7, 2, 7]' }, { call: 'encode_rle([])', expected: '[]' }],
    hint: 'Same walk as count_runs, but append [length, value] each time a run ends (and once more at the end).',
    solution: py`def encode_rle(flat_data):
    out = []
    length = 0
    prev = None
    for value in flat_data:
        if value == prev and length < 15:
            length += 1
        else:
            if length > 0:
                out += [length, prev]
            prev = value
            length = 1
    if length > 0:
        out += [length, prev]
    return out
`,
  },
  {
    id: 'm7a-decode-rle', module: 'M7A', title: 'RLE: decode_rle',
    prompt: 'Project 2 style. Write decode_rle(rle_data): the opposite of encode_rle. [3, 15, 6, 4] → [15, 15, 15, 4, 4, 4, 4, 4, 4].',
    starter: py`def decode_rle(rle_data):
    pass
`,
    tests: [{ call: 'decode_rle([3, 15, 6, 4])', expected: '[15, 15, 15, 4, 4, 4, 4, 4, 4]' }, { call: 'decode_rle([])', expected: '[]' }, { call: 'decode_rle([1, 9, 2, 0])', expected: '[9, 0, 0]' }],
    hint: 'Step through the list two at a time: for i in range(0, len(rle_data), 2). [value] * length makes a run.',
    solution: py`def decode_rle(rle_data):
    out = []
    for i in range(0, len(rle_data), 2):
        out += [rle_data[i + 1]] * rle_data[i]
    return out
`,
  },
  {
    id: 'm7a-string-to-data', module: 'M7A', title: 'RLE: string_to_data',
    prompt: 'Project 2 style. Write string_to_data(data_string): turn a hex string back into a list of ints. "3f64" → [3, 15, 6, 4].',
    starter: py`def string_to_data(data_string):
    pass
`,
    tests: [{ call: "string_to_data('3f64')", expected: '[3, 15, 6, 4]' }, { call: "string_to_data('')", expected: '[]' }, { call: "string_to_data('ABc0')", expected: '[10, 11, 12, 0]' }],
    hint: 'int(ch, 16) converts one hex digit.',
    solution: py`def string_to_data(data_string):
    return [int(ch, 16) for ch in data_string]
`,
  },
  {
    id: 'm7a-rle-string', module: 'M7A', title: 'RLE: to_rle_string',
    prompt: 'Project 2 style. Write to_rle_string(rle_data): each run becomes its length in decimal followed by its value in hex, runs joined by ":". [15, 15, 6, 4] → "15f:64".',
    starter: py`def to_rle_string(rle_data):
    pass
`,
    tests: [{ call: 'to_rle_string([15, 15, 6, 4])', expected: "'15f:64'" }, { call: 'to_rle_string([3, 15, 6, 4])', expected: "'3f:64'" }, { call: 'to_rle_string([2, 10])', expected: "'2a'" }],
    hint: 'Build a list of pieces like f"{length}{hex_digit}" and ":".join(pieces).',
    solution: py`def to_rle_string(rle_data):
    digits = "0123456789abcdef"
    pieces = []
    for i in range(0, len(rle_data), 2):
        pieces.append(f"{rle_data[i]}{digits[rle_data[i + 1]]}")
    return ":".join(pieces)
`,
  },
  {
    id: 'm7a-second', module: 'M7A', title: 'Second largest',
    prompt: 'Write second_largest(nums) that returns the second biggest distinct value, or None if there isn\'t one.',
    starter: py`def second_largest(nums):
    pass
`,
    tests: [{ call: 'second_largest([4, 1, 9, 7])', expected: '7' }, { call: 'second_largest([5, 5, 5])', expected: 'None' }, { call: 'second_largest([3, 9, 9, 2])', expected: '3' }, { call: 'second_largest([])', expected: 'None' }],
    hint: 'sorted(set(nums)) removes duplicates and sorts; then look at index -2 if it exists.',
    solution: py`def second_largest(nums):
    distinct = sorted(set(nums))
    if len(distinct) < 2:
        return None
    return distinct[-2]
`,
  },
  {
    id: 'm7a-rotate', module: 'M7A', title: 'Rotate a list',
    prompt: 'Write rotate(lst, k) that returns a new list shifted right by k places: rotate([1, 2, 3, 4], 1) → [4, 1, 2, 3]. k can be bigger than the length.',
    starter: py`def rotate(lst, k):
    pass
`,
    tests: [{ call: 'rotate([1, 2, 3, 4], 1)', expected: '[4, 1, 2, 3]' }, { call: 'rotate([1, 2, 3, 4], 6)', expected: '[3, 4, 1, 2]' }, { call: 'rotate([], 3)', expected: '[]' }, { call: 'rotate([1, 2, 3], 0)', expected: '[1, 2, 3]' }],
    hint: 'Use k % len(lst) and slicing: lst[-k:] + lst[:-k]. Watch out for k == 0 and empty lists.',
    solution: py`def rotate(lst, k):
    if not lst:
        return []
    k %= len(lst)
    if k == 0:
        return lst[:]
    return lst[-k:] + lst[:-k]
`,
  },

  // ------------------------------------------------------------ M7B
  {
    id: 'm7b-word-count', module: 'M7B', title: 'Word counts',
    prompt: 'Write word_counts(text) that returns a dict of word → count. Lowercase everything and strip . , ! ? from the ends of words.',
    starter: py`def word_counts(text):
    pass
`,
    tests: [{ call: "word_counts('the cat and the hat')", expected: "{'the': 2, 'cat': 1, 'and': 1, 'hat': 1}" }, { call: "word_counts('Go, go, GO!')", expected: "{'go': 3}" }, { call: "word_counts('')", expected: '{}' }],
    hint: 'for word in text.lower().split(): word = word.strip(".,!?"), then counts[word] = counts.get(word, 0) + 1',
    solution: py`def word_counts(text):
    counts = {}
    for word in text.lower().split():
        word = word.strip(".,!?")
        if word:
            counts[word] = counts.get(word, 0) + 1
    return counts
`,
  },
  {
    id: 'm7b-invert', module: 'M7B', title: 'Invert a dictionary',
    prompt: 'Write invert(d) that maps each value to a sorted list of the keys that had it. {"a": 1, "b": 2, "c": 1} → {1: ["a", "c"], 2: ["b"]}.',
    starter: py`def invert(d):
    pass
`,
    tests: [{ call: "invert({'a': 1, 'b': 2, 'c': 1})", expected: "{1: ['a', 'c'], 2: ['b']}" }, { call: 'invert({})', expected: '{}' }, { call: "invert({'x': 'red', 'y': 'red'})", expected: "{'red': ['x', 'y']}" }],
    hint: 'Loop over d.items(); use out.setdefault(value, []).append(key). Sort each list at the end.',
    solution: py`def invert(d):
    out = {}
    for key, value in d.items():
        out.setdefault(value, []).append(key)
    for value in out:
        out[value].sort()
    return out
`,
  },
  {
    id: 'm7b-common', module: 'M7B', title: 'Common elements',
    prompt: 'Write common(a, b) that returns a sorted list of the values found in both lists, each listed once.',
    starter: py`def common(a, b):
    pass
`,
    tests: [{ call: 'common([1, 2, 3, 3], [3, 4, 2])', expected: '[2, 3]' }, { call: 'common([1], [2])', expected: '[]' }, { call: "common(['b', 'a'], ['a', 'b', 'c'])", expected: "['a', 'b']" }],
    hint: 'Sets do the heavy lifting: set(a) & set(b).',
    solution: py`def common(a, b):
    return sorted(set(a) & set(b))
`,
  },
  {
    id: 'm7b-min-max', module: 'M7B', title: 'Min and max as a tuple',
    prompt: 'Write min_max(nums) that returns a tuple (smallest, largest) in one pass, without min() or max().',
    starter: py`def min_max(nums):
    pass
`,
    tests: [{ call: 'min_max([3, 9, 1, 4])', expected: '(1, 9)' }, { call: 'min_max([5])', expected: '(5, 5)' }, { call: 'min_max([-2, -8, 0])', expected: '(-8, 0)' }],
    hint: 'Start lo = hi = nums[0], update both inside one loop, then return lo, hi (that\'s a tuple).',
    solution: py`def min_max(nums):
    lo = hi = nums[0]
    for n in nums[1:]:
        if n < lo:
            lo = n
        if n > hi:
            hi = n
    return lo, hi
`,
  },
  {
    id: 'm7b-averages', module: 'M7B', title: 'Class averages',
    prompt: 'Write averages(grades), where grades maps a name to a list of scores. Return a new dict of name → average rounded to 2 decimals (0.0 for an empty list).',
    starter: py`def averages(grades):
    pass
`,
    tests: [{ call: "averages({'Ana': [90, 80], 'Ben': [70]})", expected: "{'Ana': 85.0, 'Ben': 70.0}" }, { call: "averages({'Cy': [1, 2, 2]})", expected: "{'Cy': 1.67}" }, { call: "averages({'Di': []})", expected: "{'Di': 0.0}" }],
    hint: 'A dict comprehension works, or a loop over grades.items().',
    solution: py`def averages(grades):
    out = {}
    for name, scores in grades.items():
        if scores:
            out[name] = round(sum(scores) / len(scores), 2)
        else:
            out[name] = 0.0
    return out
`,
  },
  {
    id: 'm7b-first-unique', module: 'M7B', title: 'First unique character',
    prompt: 'Write first_unique(text) that returns the first character that appears exactly once, or "" if none does.',
    starter: py`def first_unique(text):
    pass
`,
    tests: [{ call: "first_unique('swiss')", expected: "'w'" }, { call: "first_unique('aabb')", expected: "''" }, { call: "first_unique('gator')", expected: "'g'" }],
    hint: 'First count every character in a dict, then loop over text again and return the first one with count 1.',
    solution: py`def first_unique(text):
    counts = {}
    for ch in text:
        counts[ch] = counts.get(ch, 0) + 1
    for ch in text:
        if counts[ch] == 1:
            return ch
    return ""
`,
  },
  {
    id: 'm7b-connect4', module: 'M7B', title: 'Connect-Four: four in a row?',
    prompt: 'Lab 6 style. board is a list of rows (lists) holding "X", "O" or " ". Write has_four(board, piece) that returns True if piece has 4 in a row horizontally, vertically or diagonally.',
    starter: py`def has_four(board, piece):
    pass
`,
    tests: [
      { call: "has_four([[' ',' ',' ',' '],['X','X','X','X']], 'X')", expected: 'True' },
      { call: "has_four([['O'],['O'],['O'],['O']], 'O')", expected: 'True' },
      { call: "has_four([['X',' ',' ',' '],[' ','X',' ',' '],[' ',' ','X',' '],[' ',' ',' ','X']], 'X')", expected: 'True' },
      { call: "has_four([[' ',' ',' ','O'],[' ',' ','O',' '],[' ','O',' ',' '],['O',' ',' ',' ']], 'O')", expected: 'True' },
      { call: "has_four([['X','X','X','O'],['O','O','O','X']], 'X')", expected: 'False' },
    ],
    hint: 'From every cell, try 4 directions: (0, 1), (1, 0), (1, 1), (1, -1). Check the next 3 cells stay on the board and match.',
    solution: py`def has_four(board, piece):
    rows = len(board)
    cols = len(board[0])
    for r in range(rows):
        for c in range(cols):
            for dr, dc in ((0, 1), (1, 0), (1, 1), (1, -1)):
                count = 0
                for k in range(4):
                    rr, cc = r + dr * k, c + dc * k
                    if 0 <= rr < rows and 0 <= cc < cols and board[rr][cc] == piece:
                        count += 1
                    else:
                        break
                if count == 4:
                    return True
    return False
`,
  },

  // ------------------------------------------------------------ M8
  {
    id: 'm8-factorial', module: 'M8', title: 'Factorial', recurse: 'factorial',
    prompt: 'Write factorial(n) recursively. 0! is 1.',
    starter: py`def factorial(n):
    pass
`,
    tests: [{ call: 'factorial(0)', expected: '1' }, { call: 'factorial(1)', expected: '1' }, { call: 'factorial(5)', expected: '120' }, { call: 'factorial(10)', expected: '3628800' }],
    hint: 'Base case: n == 0 returns 1. Recursive case: n * factorial(n - 1).',
    solution: py`def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
`,
  },
  {
    id: 'm8-sum-list', module: 'M8', title: 'Sum a list', recurse: 'sum_list',
    prompt: 'Write sum_list(lst) recursively (no loops, no sum()).',
    starter: py`def sum_list(lst):
    pass
`,
    tests: [{ call: 'sum_list([1, 2, 3, 4])', expected: '10' }, { call: 'sum_list([])', expected: '0' }, { call: 'sum_list([-5])', expected: '-5' }],
    hint: 'An empty list sums to 0. Otherwise it\'s lst[0] + sum_list(lst[1:]).',
    solution: py`def sum_list(lst):
    if not lst:
        return 0
    return lst[0] + sum_list(lst[1:])
`,
  },
  {
    id: 'm8-reverse', module: 'M8', title: 'Reverse a string', recurse: 'reverse',
    prompt: 'Write reverse(text) recursively, without slicing with [::-1].',
    starter: py`def reverse(text):
    pass
`,
    tests: [{ call: "reverse('gator')", expected: "'rotag'" }, { call: "reverse('')", expected: "''" }, { call: "reverse('a')", expected: "'a'" }],
    hint: 'reverse of "gator" is reverse("ator") + "g".',
    solution: py`def reverse(text):
    if text == "":
        return ""
    return reverse(text[1:]) + text[0]
`,
  },
  {
    id: 'm8-power', module: 'M8', title: 'Power', recurse: 'power',
    prompt: 'Write power(base, exp) recursively for exp ≥ 0, without **.',
    starter: py`def power(base, exp):
    pass
`,
    tests: [{ call: 'power(2, 10)', expected: '1024' }, { call: 'power(5, 0)', expected: '1' }, { call: 'power(3, 3)', expected: '27' }],
    hint: 'Anything to the 0 is 1. Otherwise base * power(base, exp - 1).',
    solution: py`def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)
`,
  },
  {
    id: 'm8-fib', module: 'M8', title: 'Fibonacci', recurse: 'fib',
    prompt: 'Write fib(n) recursively: fib(0) = 0, fib(1) = 1, and each next number is the sum of the two before.',
    starter: py`def fib(n):
    pass
`,
    tests: [{ call: 'fib(0)', expected: '0' }, { call: 'fib(1)', expected: '1' }, { call: 'fib(7)', expected: '13' }, { call: 'fib(15)', expected: '610' }],
    hint: 'Two base cases (0 and 1), then fib(n - 1) + fib(n - 2).',
    solution: py`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
`,
  },
  {
    id: 'm8-pal', module: 'M8', title: 'Palindrome, recursively', recurse: 'is_pal',
    prompt: 'Write is_pal(text) recursively: compare the first and last characters, then check the middle.',
    starter: py`def is_pal(text):
    pass
`,
    tests: [{ call: "is_pal('racecar')", expected: 'True' }, { call: "is_pal('abca')", expected: 'False' }, { call: "is_pal('')", expected: 'True' }, { call: "is_pal('x')", expected: 'True' }],
    hint: 'Base case: length 0 or 1 is True. If text[0] != text[-1], False. Else is_pal(text[1:-1]).',
    solution: py`def is_pal(text):
    if len(text) <= 1:
        return True
    if text[0] != text[-1]:
        return False
    return is_pal(text[1:-1])
`,
  },
  {
    id: 'm8-binary', module: 'M8', title: 'Binary, recursively', recurse: 'to_bin',
    prompt: 'Write to_bin(n) recursively for n ≥ 0, returning a string like "1010".',
    starter: py`def to_bin(n):
    pass
`,
    tests: [{ call: 'to_bin(0)', expected: "'0'" }, { call: 'to_bin(1)', expected: "'1'" }, { call: 'to_bin(10)', expected: "'1010'" }, { call: 'to_bin(255)', expected: "'11111111'" }],
    hint: 'n < 2 returns str(n). Otherwise to_bin(n // 2) + str(n % 2).',
    solution: py`def to_bin(n):
    if n < 2:
        return str(n)
    return to_bin(n // 2) + str(n % 2)
`,
  },
  {
    id: 'm8-flatten', module: 'M8', title: 'Flatten a nested list', recurse: 'flatten',
    prompt: 'Write flatten(lst) that turns any nested list into one flat list: [1, [2, [3, 4]], 5] → [1, 2, 3, 4, 5].',
    starter: py`def flatten(lst):
    pass
`,
    tests: [{ call: 'flatten([1, [2, [3, 4]], 5])', expected: '[1, 2, 3, 4, 5]' }, { call: 'flatten([])', expected: '[]' }, { call: 'flatten([[[]], [1]])', expected: '[1]' }],
    hint: 'Loop over items: if isinstance(item, list), extend with flatten(item); otherwise append item.',
    solution: py`def flatten(lst):
    out = []
    for item in lst:
        if isinstance(item, list):
            out.extend(flatten(item))
        else:
            out.append(item)
    return out
`,
  },
  {
    id: 'm8-count', module: 'M8', title: 'Count occurrences', recurse: 'count',
    prompt: 'Write count(lst, target) recursively: how many times target appears in lst.',
    starter: py`def count(lst, target):
    pass
`,
    tests: [{ call: 'count([1, 2, 1, 1], 1)', expected: '3' }, { call: 'count([], 5)', expected: '0' }, { call: "count(['a', 'b'], 'c')", expected: '0' }],
    hint: 'Empty list → 0. Otherwise (1 if lst[0] == target else 0) + count(lst[1:], target).',
    solution: py`def count(lst, target):
    if not lst:
        return 0
    here = 1 if lst[0] == target else 0
    return here + count(lst[1:], target)
`,
  },
  {
    id: 'm8-gcd', module: 'M8', title: 'Greatest common divisor', recurse: 'gcd',
    prompt: 'Write gcd(a, b) recursively with Euclid\'s rule: gcd(a, 0) = a, otherwise gcd(b, a % b).',
    starter: py`def gcd(a, b):
    pass
`,
    tests: [{ call: 'gcd(48, 18)', expected: '6' }, { call: 'gcd(17, 5)', expected: '1' }, { call: 'gcd(9, 0)', expected: '9' }, { call: 'gcd(0, 7)', expected: '7' }],
    hint: 'Translate the rule directly; the base case is b == 0.',
    solution: py`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)
`,
  },
  {
    id: 'm8-digits', module: 'M8', title: 'Count digits', recurse: 'num_digits',
    prompt: 'Write num_digits(n) recursively for n ≥ 0 (0 has 1 digit).',
    starter: py`def num_digits(n):
    pass
`,
    tests: [{ call: 'num_digits(0)', expected: '1' }, { call: 'num_digits(7)', expected: '1' }, { call: 'num_digits(12345)', expected: '5' }, { call: 'num_digits(100)', expected: '3' }],
    hint: 'n < 10 has one digit. Otherwise 1 + num_digits(n // 10).',
    solution: py`def num_digits(n):
    if n < 10:
        return 1
    return 1 + num_digits(n // 10)
`,
  },
];

// "What does this print?" Exact output (print's own newlines count as line breaks).
export const PREDICT = [
  {
    id: 'p-alias', module: 'M7A', code: py`a = [1, 2]
b = a
b.append(3)
print(a)`,
    answer: '[1, 2, 3]', options: ['[1, 2]', '[1, 2, 3]', '[3, 1, 2]', 'Error'],
    why: 'b = a doesn\'t copy the list: both names point at the same list, so appending through b changes a too. Use a[:] or list(a) to copy.',
  },
  {
    id: 'p-slice', module: 'M7A', code: py`s = "Gators"
print(s[1:4], s[::-1])`,
    answer: 'ato srotaG', options: ['ato srotaG', 'ator srotaG', 'Gat srotaG', 'ato sroatG'],
    why: 's[1:4] takes indexes 1, 2, 3 (the stop is not included). [::-1] walks backwards.',
  },
  {
    id: 'p-floordiv', module: 'M2', code: py`print(7 // 2, 7 % 3, -7 // 2)`,
    answer: '3 1 -4', options: ['3 1 -3', '3 1 -4', '3.5 1 -3.5', '3 2 -4'],
    why: '// rounds down (toward negative infinity), so −7 // 2 is −4, not −3.',
  },
  {
    id: 'p-range', module: 'M4', code: py`for i in range(1, 10, 3):
    print(i, end=" ")`,
    answer: '1 4 7', options: ['1 4 7', '1 4 7 10', '1 3 6 9', '0 3 6 9'],
    why: 'Start at 1, step by 3, and stop before 10.',
  },
  {
    id: 'p-dict-get', module: 'M7B', code: py`d = {"a": 1}
d["b"] = d.get("a", 0) + d.get("z", 10)
print(d)`,
    answer: "{'a': 1, 'b': 11}", options: ["{'a': 1, 'b': 11}", "{'a': 1, 'b': 1}", 'KeyError', "{'a': 1, 'b': 10}"],
    why: '.get returns the default when the key is missing (10 for "z") instead of raising KeyError.',
  },
  {
    id: 'p-set-len', module: 'M7B', code: py`nums = [3, 1, 3, 2, 1, 3]
print(len(set(nums)), sorted(set(nums)))`,
    answer: '3 [1, 2, 3]', options: ['6 [1, 1, 2, 3, 3, 3]', '3 [1, 2, 3]', '3 {1, 2, 3}', '3 [3, 1, 2]'],
    why: 'A set keeps one copy of each value. sorted() always returns a list.',
  },
  {
    id: 'p-tuple', module: 'M7B', code: py`t = (1, 2, 3)
try:
    t[0] = 9
except TypeError:
    print("nope")
print(t)`,
    answer: 'nope\n(1, 2, 3)', options: ['(9, 2, 3)', 'nope\n(1, 2, 3)', 'nope\n(9, 2, 3)', '(1, 2, 3)'],
    why: 'Tuples are immutable: assigning to an index raises TypeError, so the tuple is unchanged.',
  },
  {
    id: 'p-rec-sum', module: 'M8', code: py`def f(n):
    if n <= 1:
        return 1
    return n + f(n - 1)

print(f(4))`,
    answer: '10', options: ['10', '24', '9', '4'],
    why: 'f(4) = 4 + f(3) = 4 + 3 + f(2) = 4 + 3 + 2 + f(1) = 4 + 3 + 2 + 1 = 10.',
  },
  {
    id: 'p-rec-order', module: 'M8', code: py`def g(n):
    if n == 0:
        return
    print(n, end=" ")
    g(n - 1)
    print(n, end=" ")

g(3)`,
    answer: '3 2 1 1 2 3', options: ['3 2 1', '3 2 1 1 2 3', '1 2 3 3 2 1', '3 2 1 0 1 2 3'],
    why: 'Each call prints on the way down, then again after its recursive call returns, on the way back up.',
  },
  {
    id: 'p-rec-calls', module: 'M8', code: py`calls = 0
def fib(n):
    global calls
    calls += 1
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(4), calls)`,
    answer: '3 9', options: ['3 9', '3 5', '5 9', '3 4'],
    why: 'fib(4) calls fib(3) and fib(2), which keep branching: 9 calls in total, and fib(4) = 3. That repeated work is why plain recursive fib is slow.',
  },
  {
    id: 'p-bases', module: 'M7A', code: py`print(bin(10), hex(255), int("1010", 2), int("ff", 16))`,
    answer: '0b1010 0xff 10 255', options: ['0b1010 0xff 10 255', '1010 FF 10 255', '0b1010 0xFF 1010 ff', '0b101 0xff 10 255'],
    why: 'bin() and hex() return strings with a 0b / 0x prefix and lowercase hex digits. int(text, base) goes the other way.',
  },
  {
    id: 'p-immutable-str', module: 'M5', code: py`s = "hi"
s.upper()
print(s)`,
    answer: 'hi', options: ['HI', 'hi', 'Hi', 'None'],
    why: 'Strings can\'t change. s.upper() returns a new string, which is thrown away here. You need s = s.upper().',
  },
  {
    id: 'p-scope', module: 'M5', code: py`x = 5
def change():
    x = 10
change()
print(x)`,
    answer: '5', options: ['5', '10', 'None', 'UnboundLocalError'],
    why: 'Assigning x inside the function makes a new local x. The global x is untouched.',
  },
  {
    id: 'p-short-circuit', module: 'M3', code: py`print(0 or "a", 3 and 0, not "")`,
    answer: 'a 0 True', options: ['a 0 True', 'True False True', 'a 3 False', '0 0 True'],
    why: 'or returns the first truthy value, and returns the first falsy one (or the last value). An empty string is falsy, so not "" is True.',
  },
  {
    id: 'p-loop-else', module: 'M4', code: py`total = 0
for i in range(5):
    if i == 3:
        continue
    total += i
print(total)`,
    answer: '7', options: ['10', '7', '3', '6'],
    why: 'continue skips 3, so the total is 0 + 1 + 2 + 4 = 7.',
  },
  {
    id: 'p-dict-loop', module: 'M7B', code: py`ages = {"ana": 20, "ben": 19}
for name, age in ages.items():
    ages[name] = age + 1
print(sorted(ages.values()))`,
    answer: '[20, 21]', options: ['[20, 21]', '[19, 20]', 'RuntimeError', "['ana', 'ben']"],
    why: 'Changing the values of existing keys while looping is fine. Adding or removing keys mid-loop is what raises an error.',
  },
];
