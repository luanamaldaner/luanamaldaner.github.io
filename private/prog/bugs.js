// Debug-the-bug drills: the starter code is broken on purpose. Find and fix the bug(s).
const py = String.raw;

export const BUGS = [
  // ------------------------------------------------------------ M2
  {
    id: 'b-m2-sum', module: 'M2', title: 'Adding two numbers',
    prompt: 'This program should read two whole numbers and print their sum, like "Sum: 7". It has a bug. Fix it.',
    starter: py`a = input("First number: ")
b = input("Second number: ")
total = a + b
print(f"Sum: {total}")
`,
    tests: [{ stdin: '3\n4', expected: 'Sum: 7' }, { stdin: '10\n25', expected: 'Sum: 35' }, { stdin: '0\n0', expected: 'Sum: 0' }],
    hint: 'Try 3 and 4. Do you get 7 or 34? What type does input() give you back?',
    bug: 'input() always returns a string, so a + b glues the text together ("3" + "4" is "34") instead of adding; wrap each input() in int().',
    solution: py`a = int(input("First number: "))
b = int(input("Second number: "))
total = a + b
print(f"Sum: {total}")
`,
  },
  {
    id: 'b-m2-average', module: 'M2', title: 'Average of three scores',
    prompt: 'This program should read three test scores and print their average with one decimal place, like "Average: 80.0". It has a bug. Fix it.',
    starter: py`a = float(input("Score 1: "))
b = float(input("Score 2: "))
c = float(input("Score 3: "))
avg = a + b + c / 3
print(f"Average: {avg:.1f}")
`,
    tests: [{ stdin: '90\n80\n70', expected: 'Average: 80.0' }, { stdin: '100\n100\n100', expected: 'Average: 100.0' }, { stdin: '85.5\n90\n77', expected: 'Average: 84.2' }],
    hint: 'Remember the order of operations: which happens first, + or /?',
    bug: 'Division happens before addition, so only c gets divided by 3; the sum needs parentheses: (a + b + c) / 3.',
    solution: py`a = float(input("Score 1: "))
b = float(input("Score 2: "))
c = float(input("Score 3: "))
avg = (a + b + c) / 3
print(f"Average: {avg:.1f}")
`,
  },
  {
    id: 'b-m2-hours', module: 'M2', title: 'Minutes to hours',
    prompt: 'to_hours(minutes) should return a string like "2h 10m" for 130 minutes. It has a bug. Fix it.',
    starter: py`def to_hours(minutes):
    hours = minutes / 60
    mins = minutes % 60
    return f"{hours}h {mins}m"
`,
    tests: [{ call: 'to_hours(130)', expected: "'2h 10m'" }, { call: 'to_hours(45)', expected: "'0h 45m'" }, { call: 'to_hours(120)', expected: "'2h 0m'" }],
    hint: 'Run to_hours(130) and look at the hours part. Is it a whole number?',
    bug: 'The / operator always gives a float (130 / 60 is 2.1666...), but whole hours need integer division with //.',
    solution: py`def to_hours(minutes):
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours}h {mins}m"
`,
  },

  // ------------------------------------------------------------ M3
  {
    id: 'b-m3-grade', module: 'M3', title: 'Letter grade',
    prompt: 'letter(score) should return "A" for 90 and up, "B" for 80–89, "C" for 70–79, "D" for 60–69, and "F" below 60. It has a bug. Fix it.',
    starter: py`def letter(score):
    if score >= 60:
        return "D"
    elif score >= 70:
        return "C"
    elif score >= 80:
        return "B"
    elif score >= 90:
        return "A"
    else:
        return "F"
`,
    tests: [{ call: 'letter(95)', expected: "'A'" }, { call: 'letter(85)', expected: "'B'" }, { call: 'letter(72)', expected: "'C'" }, { call: 'letter(60)', expected: "'D'" }, { call: 'letter(40)', expected: "'F'" }],
    hint: 'An if/elif chain stops at the first condition that is True. What happens to a 95?',
    bug: 'The checks are in the wrong order: 95 >= 60 is already True, so every passing score gets "D"; check the highest cutoff (90) first.',
    solution: py`def letter(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
`,
  },
  {
    id: 'b-m3-password', module: 'M3', title: 'Password check',
    prompt: 'This program should print "Welcome!" if the password typed is gator123, and "Wrong password." otherwise. It has a bug. Fix it.',
    starter: py`password = input("Password: ")
if password = "gator123":
    print("Welcome!")
else:
    print("Wrong password.")
`,
    tests: [{ stdin: 'gator123', expected: 'Welcome!' }, { stdin: 'seminole', expected: 'Wrong password.' }, { stdin: 'Gator123', expected: 'Wrong password.' }],
    hint: 'Read the error message carefully. Is that line storing a value or comparing two values?',
    bug: 'A single = assigns a value; to compare two values in an if you need ==.',
    solution: py`password = input("Password: ")
if password == "gator123":
    print("Welcome!")
else:
    print("Wrong password.")
`,
  },
  {
    id: 'b-m3-age', module: 'M3', title: 'Old enough to vote?',
    prompt: 'This program should read an age and print "You can vote!" if it is 18 or more, otherwise "Not yet." It has a bug. Fix it.',
    starter: py`age = input("How old are you? ")
if age >= 18:
    print("You can vote!")
else:
    print("Not yet.")
`,
    tests: [{ stdin: '20', expected: 'You can vote!' }, { stdin: '18', expected: 'You can vote!' }, { stdin: '12', expected: 'Not yet.' }],
    hint: 'The error says something about comparing str and int. Which one is age?',
    bug: 'age is the string "20", and Python cannot compare a string with the number 18; convert it with int(input(...)).',
    solution: py`age = int(input("How old are you? "))
if age >= 18:
    print("You can vote!")
else:
    print("Not yet.")
`,
  },

  // ------------------------------------------------------------ M4
  {
    id: 'b-m4-sum-to', module: 'M4', title: 'Sum from 1 to n',
    prompt: 'sum_to(n) should return 1 + 2 + ... + n. For example, sum_to(5) is 15. It has a bug. Fix it.',
    starter: py`def sum_to(n):
    total = 0
    for i in range(1, n):
        total += i
    return total
`,
    tests: [{ call: 'sum_to(5)', expected: '15' }, { call: 'sum_to(1)', expected: '1' }, { call: 'sum_to(100)', expected: '5050' }, { call: 'sum_to(0)', expected: '0' }],
    hint: 'Print i inside the loop for sum_to(5). Does it ever reach 5?',
    bug: 'range(1, n) stops before n, so the last number is never added; it should be range(1, n + 1).',
    solution: py`def sum_to(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
`,
  },
  {
    id: 'b-m4-count-evens', module: 'M4', title: 'Count the even numbers',
    prompt: 'count_evens(nums) should return how many numbers in the list are even. It has a bug. Fix it.',
    starter: py`def count_evens(nums):
    count = 0
    for n in nums:
        if n % 2 == 0:
            count += 1
        return count
`,
    tests: [{ call: 'count_evens([2, 4, 6])', expected: '3' }, { call: 'count_evens([1, 2, 3, 4])', expected: '2' }, { call: 'count_evens([1, 3])', expected: '0' }, { call: 'count_evens([])', expected: '0' }],
    hint: 'Look at how far the return line is indented. Is it inside the loop or after it?',
    bug: 'return is indented inside the for loop, so the function quits after looking at only the first number (and returns None for an empty list); move it out one level.',
    solution: py`def count_evens(nums):
    count = 0
    for n in nums:
        if n % 2 == 0:
            count += 1
    return count
`,
  },
  {
    id: 'b-m4-vowels', module: 'M4', title: 'Count the vowels',
    prompt: 'count_vowels(word) should return how many letters in a lowercase word are vowels (a, e, i, o, u). It has a bug. Fix it.',
    starter: py`def count_vowels(word):
    count = 0
    for ch in word:
        if ch == "a" or "e" or "i" or "o" or "u":
            count += 1
    return count
`,
    tests: [{ call: 'count_vowels("gator")', expected: '2' }, { call: 'count_vowels("rhythm")', expected: '0' }, { call: 'count_vowels("aeiou")', expected: '5' }, { call: 'count_vowels("")', expected: '0' }],
    hint: 'Python reads that line as (ch == "a") or ("e") or ... Is the string "e" True or False on its own?',
    bug: 'Each "or" needs its own comparison; a non-empty string like "e" is always truthy, so the if is True for every letter. Use ch in "aeiou".',
    solution: py`def count_vowels(word):
    count = 0
    for ch in word:
        if ch in "aeiou":
            count += 1
    return count
`,
  },

  // ------------------------------------------------------------ M5
  {
    id: 'b-m5-square', module: 'M5', title: 'Square a number',
    prompt: 'square(n) should give back n squared so other code can use the answer, like square(3) + 1 being 10. It has a bug. Fix it.',
    starter: py`def square(n):
    """Give back n squared."""
    result = n * n
    print(result)
`,
    tests: [{ call: 'square(3)', expected: '9' }, { call: 'square(-4)', expected: '16' }, { call: 'square(3) + 1', expected: '10' }],
    hint: 'Showing a value on the screen is not the same as handing it back to the caller. What does a function return if it has no return line?',
    bug: 'print only shows the value; the function never returns it, so the caller gets None. Use return result.',
    solution: py`def square(n):
    """Give back n squared."""
    result = n * n
    return result
`,
  },
  {
    id: 'b-m5-sign', module: 'M5', title: 'Positive or negative',
    prompt: 'describe(n) should return "negative" for numbers below 0 and "positive" otherwise. It has a bug. Fix it.',
    starter: py`def describe(n):
    if n < 0:
        label = "negative"
    else:
        label = "positive"
        return label
`,
    tests: [{ call: 'describe(-3)', expected: "'negative'" }, { call: 'describe(5)', expected: "'positive'" }, { call: 'describe(0)', expected: "'positive'" }],
    hint: 'Try describe(-3). Which lines run? Look at where return sits.',
    bug: 'return label is indented inside the else block, so negative numbers never reach it and get None; un-indent it so it runs after the if/else.',
    solution: py`def describe(n):
    if n < 0:
        label = "negative"
    else:
        label = "positive"
    return label
`,
  },
  {
    id: 'b-m5-default-list', module: 'M5', title: 'Start a new list',
    prompt: 'add_item(item, items=...) should add item to the list you pass in, or to a brand-new empty list if you don\'t pass one. Calling add_item("a") and then add_item("b") should give ["a"] and then ["b"]. It has a bug. Fix it.',
    starter: py`def add_item(item, items=[]):
    """Add item to the list and give the list back."""
    items.append(item)
    return items
`,
    tests: [
      { call: 'add_item("a")', expected: "['a']" },
      { call: '(add_item("a"), add_item("b"))[1]', expected: "['b']" },
      { call: 'add_item("x", ["y"])', expected: "['y', 'x']" },
    ],
    hint: 'The default [] is made once, when def runs, not every time you call the function. What happens on the second call?',
    bug: 'A mutable default like [] is shared by every call, so items pile up between calls; use items=None and make a new list inside the function.',
    solution: py`def add_item(item, items=None):
    """Add item to the list and give the list back."""
    if items is None:
        items = []
    items.append(item)
    return items
`,
  },

  // ------------------------------------------------------------ M7A
  {
    id: 'b-m7a-remove-evens', module: 'M7A', title: 'Remove the even numbers',
    prompt: 'remove_evens(nums) should return the list with every even number taken out, keeping the odd ones in order. It has a bug. Fix it.',
    starter: py`def remove_evens(nums):
    for n in nums:
        if n % 2 == 0:
            nums.remove(n)
    return nums
`,
    tests: [{ call: 'remove_evens([2, 4, 6, 1])', expected: '[1]' }, { call: 'remove_evens([1, 2, 3, 4])', expected: '[1, 3]' }, { call: 'remove_evens([])', expected: '[]' }],
    hint: 'Removing an item shifts everything after it one spot left, while the loop keeps moving forward. What gets skipped?',
    bug: 'Removing items from a list while looping over it makes the loop skip the item right after each removal; build a new list of the odd numbers instead.',
    solution: py`def remove_evens(nums):
    odds = []
    for n in nums:
        if n % 2 != 0:
            odds.append(n)
    return odds
`,
  },
  {
    id: 'b-m7a-binary', module: 'M7A', title: 'Binary to decimal',
    prompt: 'to_decimal(bits) should turn a binary string into its decimal value. For example, to_decimal("110") is 6. It has a bug. Fix it.',
    starter: py`def to_decimal(bits):
    total = 0
    for i in range(len(bits)):
        total += int(bits[i]) * 2 ** i
    return total
`,
    tests: [{ call: 'to_decimal("110")', expected: '6' }, { call: 'to_decimal("1000")', expected: '8' }, { call: 'to_decimal("1")', expected: '1' }, { call: 'to_decimal("1011")', expected: '11' }],
    hint: 'In "110", the leftmost 1 is worth 4 (2 to the 2nd). What power does the loop give it when i is 0?',
    bug: 'bits[0] is the leftmost (biggest) digit, but it gets 2 ** 0; the power should be len(bits) - 1 - i.',
    solution: py`def to_decimal(bits):
    total = 0
    for i in range(len(bits)):
        total += int(bits[i]) * 2 ** (len(bits) - 1 - i)
    return total
`,
  },
  {
    id: 'b-m7a-max', module: 'M7A', title: 'Biggest number in a list',
    prompt: 'find_max(nums) should return the biggest number in a non-empty list, without using max(). It has a bug. Fix it.',
    starter: py`def find_max(nums):
    biggest = 0
    for n in nums:
        if n > biggest:
            biggest = n
    return biggest
`,
    tests: [{ call: 'find_max([3, 9, 2])', expected: '9' }, { call: 'find_max([-5, -2, -9])', expected: '-2' }, { call: 'find_max([-1])', expected: '-1' }],
    hint: 'Try a list where every number is negative. Does any of them ever beat the starting value?',
    bug: 'Starting biggest at 0 is wrong when every number is negative (0 is not even in the list); start it at nums[0].',
    solution: py`def find_max(nums):
    biggest = nums[0]
    for n in nums:
        if n > biggest:
            biggest = n
    return biggest
`,
  },

  // ------------------------------------------------------------ M7B
  {
    id: 'b-m7b-count-words', module: 'M7B', title: 'Count each word',
    prompt: 'count_words(words) should return a dict saying how many times each word shows up in the list. It has a bug. Fix it.',
    starter: py`def count_words(words):
    counts = {}
    for w in words:
        counts[w] += 1
    return counts
`,
    tests: [{ call: 'count_words(["go", "gators", "go"])', expected: "{'go': 2, 'gators': 1}" }, { call: 'count_words([])', expected: '{}' }, { call: 'count_words(["a"])', expected: "{'a': 1}" }],
    hint: 'The error is a KeyError. What is counts[w] the very first time you see a word?',
    bug: 'counts[w] += 1 reads counts[w] first, which crashes when the word is not in the dict yet; use counts[w] = counts.get(w, 0) + 1.',
    solution: py`def count_words(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts
`,
  },
  {
    id: 'b-m7b-unique', module: 'M7B', title: 'Count unique words',
    prompt: 'unique_words(sentence) should return how many different words are in a sentence (words are separated by spaces). It has a bug. Fix it.',
    starter: py`def unique_words(sentence):
    seen = set(sentence)
    count = len(seen)
    return count
`,
    tests: [{ call: 'unique_words("the cat and the dog")', expected: '4' }, { call: 'unique_words("go go go")', expected: '1' }, { call: 'unique_words("hello")', expected: '1' }],
    hint: 'Print set("go go") and see what is inside it.',
    bug: 'set() of a string makes a set of its characters, not its words; split the sentence first with sentence.split().',
    solution: py`def unique_words(sentence):
    seen = set(sentence.split())
    count = len(seen)
    return count
`,
  },
  {
    id: 'b-m7b-move', module: 'M7B', title: 'Move a point',
    prompt: 'move_right(point, steps) gets a point as an (x, y) tuple and should return a new tuple moved steps to the right. move_right((1, 2), 3) is (4, 2). It has a bug. Fix it.',
    starter: py`def move_right(point, steps):
    new_x = point[0] + steps
    point[0] = new_x
    return point
`,
    tests: [{ call: 'move_right((1, 2), 3)', expected: '(4, 2)' }, { call: 'move_right((0, 0), -5)', expected: '(-5, 0)' }],
    hint: 'The error says tuple does not support item assignment. Can you change a tuple after it is made?',
    bug: 'Tuples are immutable, so point[0] = ... crashes; build and return a new tuple: (point[0] + steps, point[1]).',
    solution: py`def move_right(point, steps):
    new_x = point[0] + steps
    return (new_x, point[1])
`,
  },

  // ------------------------------------------------------------ M8
  {
    id: 'b-m8-factorial', module: 'M8', title: 'Factorial', recurse: 'factorial',
    prompt: 'factorial(n) should return n! recursively, and 0! is 1. It has a bug. Fix it.',
    starter: py`def factorial(n):
    if n == 1:
        return 1
    return n * factorial(n - 1)
`,
    tests: [{ call: 'factorial(5)', expected: '120' }, { call: 'factorial(1)', expected: '1' }, { call: 'factorial(0)', expected: '1' }],
    hint: 'Trace factorial(0) by hand: 0, -1, -2, ... When does it stop?',
    bug: 'The base case only catches n == 1, so factorial(0) keeps calling itself with -1, -2, ... forever; the base case should be n == 0.',
    solution: py`def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
`,
  },
  {
    id: 'b-m8-digits', module: 'M8', title: 'Sum of digits', recurse: 'sum_digits',
    prompt: 'sum_digits(n) should return the sum of the digits of a non-negative whole number, recursively. sum_digits(95) is 14. It has a bug. Fix it.',
    starter: py`def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n % 10)
`,
    tests: [{ call: 'sum_digits(95)', expected: '14' }, { call: 'sum_digits(1234)', expected: '10' }, { call: 'sum_digits(7)', expected: '7' }],
    hint: 'n % 10 gives the last digit. What should the recursive call get: the last digit, or the rest of the number?',
    bug: 'The recursive call passes n % 10 (the last digit again) instead of n // 10 (the number with the last digit chopped off).',
    solution: py`def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)
`,
  },
  {
    id: 'b-m8-count-x', module: 'M8', title: 'Count the x\'s', recurse: 'count_x',
    prompt: 'count_x(text) should return how many times the letter "x" appears in text, recursively. It has a bug. Fix it.',
    starter: py`def count_x(text):
    if text == "":
        return 0
    if text[0] == "x":
        return 1 + count_x(text[1:])
    count_x(text[1:])
`,
    tests: [{ call: 'count_x("axbx")', expected: '2' }, { call: 'count_x("xx")', expected: '2' }, { call: 'count_x("hello")', expected: '0' }, { call: 'count_x("")', expected: '0' }],
    hint: 'When the first letter is not "x", the function calls itself... and then what does it give back?',
    bug: 'The last line calls count_x but throws away the answer, so the function returns None; it needs return count_x(text[1:]).',
    solution: py`def count_x(text):
    if text == "":
        return 0
    if text[0] == "x":
        return 1 + count_x(text[1:])
    return count_x(text[1:])
`,
  },
];
