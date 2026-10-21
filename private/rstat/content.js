// STA 3100 (Programming with Data in R): study notes and "predict the output" questions for
// data frames (Lecture 9), base-R dates and times (Lecture 11) and lubridate (Lecture 18).
// Everything here follows the lecture slides; outputs are the ones shown in the lectures.

export const SETUP = `mfr <- rep(c("Fender", "Gibson", "Martin"), times = c(2, 4, 1))
model <- c("Stratocaster", "Telecaster", "Firebird V", "Les Paul Standard",
           "ES175", "J-100 Xtra", "M-21")
serial <- c("EJ15230", "60671", "616619", "00235628", "03531746", "90783019", "1452869")
type <- rep(c("electric", "acoustic"), times = c(5, 2))
body <- rep(c("solid", "hollow", "flat top"), times = c(4, 1, 2))
w_case_kg <- c(8.96, 8.60, 9.88, 8.40, 8.10, 6.78, 5.62)
case_kg <- c(5.70, 4.98, 5.90, 3.46, 4.92, 4.76, 3.72)
guitars <- data.frame(mfr, model, serial, type, body, w_case_kg, case_kg)`;

export const GUITARS_TABLE = `     mfr             model   serial     type     body w_case_kg case_kg
1 Fender      Stratocaster  EJ15230 electric    solid      8.96    5.70
2 Fender        Telecaster    60671 electric    solid      8.60    4.98
3 Gibson        Firebird V   616619 electric    solid      9.88    5.90
4 Gibson Les Paul Standard 00235628 electric    solid      8.40    3.46
5 Gibson             ES175 03531746 electric   hollow      8.10    4.92
6 Gibson        J-100 Xtra 90783019 acoustic flat top      6.78    4.76
7 Martin              M-21  1452869 acoustic flat top      5.62    3.72`;

// Notes: each section is a list of [plain text, optional code] blocks.
export const NOTES = [
  {
    id: 'df', title: 'Data frames', lecture: 'Lecture 9',
    blocks: [
      ['A data frame is a table: each column is a vector (all one type), and different columns can have different types. Usually you read one from a file, but data.frame() builds one from vectors.', 'guitars <- data.frame(mfr, model, serial, type, body, w_case_kg, case_kg)'],
      ['Data frames ALWAYS have column names (unlike matrices) and row names (usually just 1, 2, 3, …).', null],
      ['A data frame is NOT a matrix, but it IS a list (a list of its columns). It has no dim attribute, yet dim() still works.', 'is.matrix(guitars)   # FALSE\nis.list(guitars)     # TRUE\ndim(guitars)         # 7 7\nattributes(guitars)  # $names, $class ("data.frame"), $row.names'],
      ['Look inside with str() (type of every column) and summary() (min/mean/max for numbers).', 'str(guitars)\nsummary(guitars)'],
    ],
  },
  {
    id: 'dfidx', title: 'Indexing a data frame', lecture: 'Lecture 9',
    blocks: [
      ['Matrix style, [row, column]. The rule: if the result is a single column (or part of one), you get a plain VECTOR. Anything else stays a DATA FRAME.', 'guitars[2, 6]         # 8.6           vector\nguitars[, 6]          # 8.96 8.60 …   vector\nguitars[2, ]          # row 2          data frame\nguitars[2:3, ]        # rows 2-3       data frame\nguitars[, c(2, 6, 7)] # 3 columns      data frame\nguitars[2, "w_case_kg"]  # names work too: 8.6'],
      ['drop = FALSE stops R from simplifying, so you keep a (one-column) data frame. Heads up: your slide text says "drop = TRUE" but the code (and the right answer) is drop = FALSE.', 'guitars[2, 6, drop = FALSE]   # 1×1 data frame\nguitars[, 6, drop = FALSE]    # 1-column data frame'],
      ['List style. Single brackets [ ] keep it a data frame; double brackets [[ ]] and $ pull out the column as a vector.', 'guitars[5]           # data frame with 1 column (body)\nguitars["body"]      # same\nguitars[[5]]         # character vector\nguitars[["body"]]    # same\nguitars$w_case_kg    # numeric vector'],
      ['Two ways to get the same thing:', 'guitars[c(1, 5)]      # list style\nguitars[, c(1, 5)]    # matrix style, same result'],
      ['[[ ]] with a vector digs in: guitars[[c(1, 5)]] means guitars[[1]][[5]], the 5th element of column 1. On a matrix that is an error; on an ordinary list it works the same way.', 'guitars[[c(1, 5)]]   # "Gibson"'],
    ],
  },
  {
    id: 'dfmore', title: 'Row names, deleting columns, factors, tibbles', lecture: 'Lecture 9',
    blocks: [
      ['You can set row names, but it is usually discouraged. Assigning NULL to a column deletes it.', 'guitars2 <- guitars\nrownames(guitars2) <- guitars2$serial\nguitars2$serial <- NULL          # removes the column\nguitars2["EJ15230", c("mfr", "model", "type")]'],
      ['stringsAsFactors: before R 4.0, data.frame() turned character columns into factors. Since R 4.0 (April 2020) the default is FALSE, so they stay character. Convert yourself if needed.', 'guitars$type <- factor(guitars$type)'],
      ['Tibbles (tidyverse) are data frames with more predictable behavior: drop defaults to FALSE (so tib[, 6] stays a tibble) and row names are handled more naturally.', null],
    ],
  },
  {
    id: 'date', title: 'Dates (base R)', lecture: 'Lecture 11',
    blocks: [
      ['A Date is stored as a double: the number of DAYS since 1970-01-01 (Unix day zero). Dates before 1970 are negative.', 'today <- Sys.Date()\nclass(today)     # "Date"\ntypeof(today)    # "double"\nunclass(today)   # e.g. 20670\nas.numeric(as.Date("1970-01-01"))   # 0\nas.numeric(as.Date("1970-02-01"))   # 31\nas.numeric(as.Date("1959-02-03"))   # -3985'],
      ['Adding a number to a Date adds DAYS.', 'today + 7        # one week later'],
      ['ISOdate() builds a date-time from numeric year, month, day (handy when they are in separate columns). It gives noon GMT; wrap in as.Date() to get a Date.', 'ISOdate(2020:2022, 12, 31)            # "2020-12-31 12:00:00 GMT" …\nas.Date(ISOdate(2020:2022, 12, 31))   # "2020-12-31" "2021-12-31" "2022-12-31"'],
      ['Other formats need a format string (see ?strptime): %Y 4-digit year, %y 2-digit year (00–68 → 2000s, 69–99 → 1900s), %m month number, %d day, %b "Jan", %B "January".', 'as.Date("02/03/1959", format = "%m/%d/%Y")   # "1959-02-03"\nas.Date("1-28-86", format = "%m-%d-%y")       # "1986-01-28"\nas.Date("9-11-01", format = "%m-%d-%y")       # "2001-09-11"'],
      ['Excel trivia from the lecture: Excel counts from 1900, but treats 1900 as a leap year by mistake, so its "day 0" works out to 1899-12-30.', null],
    ],
  },
  {
    id: 'posix', title: 'Date-times (POSIXct)', lecture: 'Lecture 11',
    blocks: [
      ['POSIXct ("calendar time") is a double: the number of SECONDS since 1970-01-01 00:00 UTC. (POSIXlt = "local time" is the other base-R kind.)', 'now <- Sys.time()\nclass(now)     # "POSIXct" "POSIXt"\ntypeof(now)    # "double"\nnow + 1        # ONE SECOND later (a Date + 1 is one DAY later)'],
      ['Seconds add up: 1 minute = 60, 1 hour = 3600. Without tz, R uses your time zone, so midnight in New York is 5 hours (18000 s) after UTC midnight.', 'as.numeric(as.POSIXct("1970-01-01 00:01", tz = "UTC"))   # 60\nas.numeric(as.POSIXct("1970-01-01 01:00", tz = "UTC"))   # 3600\nas.numeric(as.POSIXct("1970-01-01"))   # 18000 in America/New_York\nSys.timezone()   # "America/New_York"'],
      ['More format codes: %H hour 00–23, %I hour 01–12 (use with %p for AM/PM), %M minute, %S second.', null],
      ['Year 2038 problem: many systems store seconds in a 32-bit integer whose max is 2,147,483,647, which runs out at 2038-01-19 03:14:07 UTC.', 'as.POSIXct(.Machine$integer.max, origin = "1970-01-01", tz = "UTC")'],
    ],
  },
  {
    id: 'difftime', title: 'Durations (difftime)', lecture: 'Lecture 11',
    blocks: [
      ['Subtracting dates gives a difftime. difftime() lets you pick the units: secs, mins, hours, days or weeks. There is NO "months" or "years" unit, because they are not a constant length (use seq.Date for those).', 'today - as.Date("1986-01-28")                            # Time difference of … days\ndifftime(today, as.Date("1986-01-28"), units = "weeks")  # … weeks'],
      ['as.difftime() makes one directly. Adding two with different units gives seconds.', 'one_week <- as.difftime(1, units = "weeks")\none_week_days <- as.difftime(7, units = "days")\none_week + one_week_days   # Time difference of 1209600 secs'],
      ['as.difftime() can read "3:20" with a format: the format decides what the pieces mean.', 'as.difftime("3:20", format = "%H:%M")                   # 3.333333 hours\nas.difftime("3:20", format = "%M:%S")                   # 3.333333 mins\nas.difftime("3:20", format = "%M:%S", units = "secs")   # 200 secs'],
      ['Dates, POSIXct and difftimes are all stored as doubles, but is.numeric() is FALSE for them, because arithmetic like "today + tomorrow" makes no sense.', 'is.double(today)    # TRUE\nis.numeric(today)   # FALSE'],
    ],
  },
  {
    id: 'lub', title: 'lubridate: creating dates', lecture: 'Lecture 18',
    blocks: [
      ['lubridate is not loaded by library(tidyverse); load it separately. It adds no new date classes (it uses Date and POSIXct) but adds 3 time-span classes: durations, periods and intervals.', 'library(lubridate)\ntoday()   # like Sys.Date()\nnow()     # like Sys.time()'],
      ['Parse strings by naming the ORDER of year, month and day: ymd(), mdy(), dmy(), ydm(), myd(), dym(). It figures out separators and month names itself.', 'mdy("Dec 8, 1980")          # "1980-12-08"\nmdy("12/8/80")              # "1980-12-08"\nmdy("December 8 (1980)")    # "1980-12-08"'],
      ['make_date() builds dates from numbers; missing month/day default to 1.', 'make_date(1980, 12, 8)   # "1980-12-08"\nmake_date(1980, 12)      # "1980-12-01"\nmake_date(1980)          # "1980-01-01"'],
      ['Date-times: ymd_hm(), ymd_hms(), mdy_hm()… The default time zone is UTC, so pass tz = "America/New_York". "5:15 p.m." does NOT parse as PM (you get 05:15); "5:15 PM" does (17:15).', 'ymd_hm("2019-03-23 5:15 PM", tz = "America/New_York")     # "2019-03-23 17:15:00 EDT"\nymd_hm("2019-03-23 5:15 p.m.", tz = "America/New_York")   # "2019-03-23 05:15:00 EDT"'],
    ],
  },
  {
    id: 'lub2', title: 'lubridate: pieces and time spans', lecture: 'Lecture 18',
    blocks: [
      ['Pull out components with year(), month(), day(), mday(), wday(), yday(), qday(), hour(), minute(), second(). wday() counts Sunday as 1. With label = TRUE you get an ordered factor.', 'x <- as_date("1967-12-10")\nyear(x)    # 1967\nmonth(x)   # 12\nwday(x)    # 1 (a Sunday)\nyday(x)    # 344\nqday(x)    # 71\nwday(x, label = TRUE)    # Sun  (Levels: Sun < Mon < … < Sat)\nmonth(x, label = TRUE)   # Dec'],
      ['Base R can also extract pieces with format()/strftime(), but those always return character.', null],
      ['Duration = exact seconds (dyears, ddays, dhours…; 1 year = 365.25 days). Period = clock/calendar units (years, days, hours…). Interval = a span with a real start and end.', 'dyears(1)   # "31557600s (~1 years)"\nyears(1)    # "1y 0m 0d 0H 0M 0S"\nas_date("2019-07-01") + dyears(1)   # "2020-06-30 06:00:00 UTC"\nas_date("2019-07-01") + years(1)    # "2020-07-01"'],
      ['Daylight saving shows the difference: 24 exact hours vs "the same clock time tomorrow".', 't <- ymd_hms("2022-11-05 12:00:00", tz = "America/New_York")\nt + dhours(24)   # "2022-11-06 11:00:00 EST"\nt + hours(24)    # "2022-11-06 12:00:00 EST"'],
      ['Intervals: interval(a, b) or a %--% b. Helpers: int_shift(), int_end(), int_overlaps(), intersect().', 'trip <- interval(arrive, depart)\nsis <- int_shift(sis, -weeks(1))\nint_end(sis) <- int_end(sis) + days(2)\nint_overlaps(trip, sis)   # TRUE / FALSE'],
    ],
  },
];

// Predict-the-output questions. topic: 'df' | 'date' | 'lub'. `code` uses the guitars data frame where noted.
export const QUESTIONS = [
  // ---------- data frames
  { topic: 'df', code: 'guitars[2, 6]', q: 'What do you get?', a: '8.6 (a numeric vector)', o: ['A 1×1 data frame', 'Row 2 as a data frame', 'An error'], why: 'A single value from one column simplifies to a plain vector.' },
  { topic: 'df', code: 'class(guitars[2, ])', q: 'What does this print?', a: '"data.frame"', o: ['"character"', '"list"', '"numeric"'], why: 'A whole row spans several columns, so it stays a data frame.' },
  { topic: 'df', code: 'class(guitars[, 6])', q: 'What does this print?', a: '"numeric"', o: ['"data.frame"', '"list"', '"matrix"'], why: 'One whole column with matrix-style indexing drops to a vector (here numeric).' },
  { topic: 'df', code: 'class(guitars[, 6, drop = FALSE])', q: 'What does this print?', a: '"data.frame"', o: ['"numeric"', '"list"', 'An error'], why: 'drop = FALSE stops the simplification, so you keep a one-column data frame.' },
  { topic: 'df', code: 'class(guitars[5])', q: 'Single brackets, one number. What class?', a: '"data.frame"', o: ['"character"', '"list"', '"factor"'], why: 'List-style single brackets keep the container: a data frame with one column.' },
  { topic: 'df', code: 'class(guitars[[5]])', q: 'Double brackets. What class?', a: '"character"', o: ['"data.frame"', '"list"', '"factor"'], why: '[[ ]] pulls the column itself out: the body column, a character vector (stringsAsFactors is FALSE since R 4.0).' },
  { topic: 'df', code: 'is.list(guitars)', q: 'TRUE or FALSE?', a: 'TRUE', o: ['FALSE', 'NA', 'An error'], why: 'A data frame is a list of its columns.' },
  { topic: 'df', code: 'is.matrix(guitars)', q: 'TRUE or FALSE?', a: 'FALSE', o: ['TRUE', 'NA', 'An error'], why: 'You can index it like a matrix, but it is not one.' },
  { topic: 'df', code: 'dim(guitars)', q: 'What does this print?', a: '7 7', o: ['NULL (no dim attribute)', '49', '7'], why: 'There is no stored dim attribute, but dim() still reports rows × columns.' },
  { topic: 'df', code: 'names(attributes(guitars))', q: 'Which attributes does a data frame have?', a: '"names" "class" "row.names"', o: ['"dim" "names" "class"', '"dim" "dimnames"', '"names" "dim" "row.names"'], why: 'Column names, the class and the row names. No dim attribute.' },
  { topic: 'df', code: 'guitars[[c(1, 5)]]', q: 'What does this return?', a: '"Gibson"', o: ['Columns 1 and 5 as a data frame', '"Fender"', 'An error'], why: 'It means guitars[[1]][[5]]: the 5th element of the mfr column (Fender, Fender, Gibson, Gibson, Gibson…).' },
  { topic: 'df', code: 'm <- as.matrix(guitars)\nm[[c(1, 5)]]', q: 'Same trick on a matrix?', a: 'An error', o: ['"Gibson"', '"Fender"', 'Columns 1 and 5'], why: 'Recursive [[c(i, j)]] indexing only works on lists (and so data frames), not matrices.' },
  { topic: 'df', code: 'guitars[c(1, 5)]', q: 'This gives the same result as…', a: 'guitars[, c(1, 5)]', o: ['guitars[c(1, 5), ]', 'guitars[[c(1, 5)]]', 'guitars[1, 5]'], why: 'Single-bracket list indexing picks columns, just like [, cols].' },
  { topic: 'df', code: 'guitars[2, "w_case_kg"]', q: 'What does this return?', a: '8.6', o: ['8.96', '4.98', 'An error: names are not allowed'], why: 'You can index with column names instead of numbers. Row 2 is the Telecaster.' },
  { topic: 'df', code: 'guitars$serial <- NULL\nncol(guitars)', q: 'What does ncol() print?', a: '6', o: ['7', '0', 'An error'], why: 'Assigning NULL to a column deletes it.' },
  { topic: 'df', code: 'nrow(guitars[guitars$type == "acoustic", ])', q: 'How many rows?', a: '2', o: ['5', '7', '1'], why: 'Only the J-100 Xtra and the M-21 are acoustic.' },
  { topic: 'df', code: 'guitars[2:3, "model"]', q: 'What comes back?', a: '"Telecaster" "Firebird V" (a character vector)', o: ['A 2×1 data frame', '"Fender" "Gibson"', 'An error'], why: 'Part of a single column, so it simplifies to a vector.' },
  { topic: 'df', code: 'df <- data.frame(x = c("a", "b"))\nclass(df$x)', q: 'In R 4.0 or later, what does this print?', a: '"character"', o: ['"factor"', '"list"', '"data.frame"'], why: 'stringsAsFactors defaults to FALSE since R 4.0, so strings stay character.' },
  { topic: 'df', code: '# tib is a tibble version of guitars\ntib[, 6]', q: 'What does this return?', a: 'A tibble with 1 column', o: ['A numeric vector', 'A single number', 'An error'], why: 'For tibbles drop defaults to FALSE, so they never silently turn into vectors.' },
  // ---------- base-R dates and times
  { topic: 'date', code: 'typeof(Sys.Date())', q: 'What does this print?', a: '"double"', o: ['"Date"', '"character"', '"integer"'], why: 'class() is "Date", but underneath it is stored as a double (days since 1970-01-01).' },
  { topic: 'date', code: 'as.numeric(as.Date("1970-01-10"))', q: 'What number?', a: '9', o: ['10', '0', '1970'], why: '1970-01-01 is day 0, so January 10 is day 9.' },
  { topic: 'date', code: 'as.numeric(as.Date("1969-12-31"))', q: 'What number?', a: '-1', o: ['0', '365', 'NA'], why: 'Days before 1970-01-01 are negative.' },
  { topic: 'date', code: 'as.Date("2026-08-05") + 7', q: 'What does this print?', a: '"2026-08-12"', o: ['"2026-08-05 00:00:07"', '"2026-09-05"', 'An error'], why: 'Adding a number to a Date adds days.' },
  { topic: 'date', code: 'as.Date("03/15/2024", format = "%m/%d/%Y")', q: 'What does this print?', a: '"2024-03-15"', o: ['"2024-15-03"', 'NA', '"03/15/2024"'], why: 'The format string tells R the order; Dates always print as YYYY-MM-DD.' },
  { topic: 'date', code: 'as.Date("5-1-68", format = "%m-%d-%y")', q: 'Which year does %y pick?', a: '"2068-05-01"', o: ['"1968-05-01"', '"0068-05-01"', 'NA'], why: 'With %y, 00–68 become 2000s and 69–99 become 1900s.' },
  { topic: 'date', code: 'as.Date("5-1-69", format = "%m-%d-%y")', q: 'And now?', a: '"1969-05-01"', o: ['"2069-05-01"', '"0069-05-01"', 'NA'], why: '69–99 are read as 1900s.' },
  { topic: 'date', code: 'as.Date("12/8/80", format = "%d/%m/%y")', q: 'What does this print?', a: '"1980-08-12"', o: ['"1980-12-08"', 'NA', '"2080-08-12"'], why: 'The format says day first, so 12 is the day and 8 is the month.' },
  { topic: 'date', code: 'ISOdate(2021, 12, 31)', q: 'What does this print?', a: '"2021-12-31 12:00:00 GMT"', o: ['"2021-12-31"', '"2021-12-31 00:00:00 EST"', '"2021-31-12"'], why: 'ISOdate() makes a date-time at noon GMT. Wrap it in as.Date() for a plain Date.' },
  { topic: 'date', code: 'class(Sys.time())', q: 'What does this print?', a: '"POSIXct" "POSIXt"', o: ['"Date"', '"POSIXlt"', '"difftime"'], why: 'Sys.time() is a POSIXct date-time, which also inherits from POSIXt.' },
  { topic: 'date', code: 'as.numeric(as.POSIXct("1970-01-01 01:00", tz = "UTC"))', q: 'What number?', a: '3600', o: ['1', '60', '0.0417'], why: 'POSIXct counts seconds since midnight UTC on 1970-01-01. One hour = 3600 seconds.' },
  { topic: 'date', code: 'as.numeric(as.POSIXct("1970-01-01"))\n# your time zone is America/New_York', q: 'What number?', a: '18000', o: ['0', '-18000', '3600'], why: 'Midnight in New York is 5 hours after midnight UTC: 5 × 3600 = 18000 seconds.' },
  { topic: 'date', code: 'now <- Sys.time()\nnow + 60', q: 'How much later is this?', a: '1 minute', o: ['60 days', '60 hours', '1 hour'], why: 'Adding to a POSIXct adds seconds (but adding to a Date adds days).' },
  { topic: 'date', code: 'as.Date("2024-03-01") - as.Date("2024-02-01")', q: 'What does this print?', a: 'Time difference of 29 days', o: ['Time difference of 28 days', 'Time difference of 1 months', '29'], why: '2024 is a leap year, so February has 29 days. The result is a difftime in days.' },
  { topic: 'date', code: 'difftime(as.Date("2024-01-15"), as.Date("2024-01-01"), units = "weeks")', q: 'What does this print?', a: 'Time difference of 2 weeks', o: ['Time difference of 14 days', 'Time difference of 0.5 months', '2'], why: 'units = "weeks" converts the 14 days into 2 weeks.' },
  { topic: 'date', code: 'difftime(x, y, units = "months")', q: 'What happens?', a: 'An error: months is not a valid unit', o: ['The difference in months', 'The difference in 30-day months', 'NA'], why: 'difftime only allows secs, mins, hours, days and weeks. Months are not a constant length.' },
  { topic: 'date', code: 'as.difftime(1, units = "weeks") + as.difftime(7, units = "days")', q: 'What does this print?', a: 'Time difference of 1209600 secs', o: ['Time difference of 2 weeks', 'Time difference of 14 days', 'Time difference of 8 weeks'], why: 'Mixing units falls back to seconds: 14 days × 86400 s = 1,209,600 secs.' },
  { topic: 'date', code: 'as.difftime("1:30", format = "%H:%M")', q: 'What does this print?', a: 'Time difference of 1.5 hours', o: ['Time difference of 1.3 hours', 'Time difference of 90 mins', 'Time difference of 1.5 mins'], why: 'The format reads 1 hour 30 minutes, and the auto units pick hours: 1.5.' },
  { topic: 'date', code: 'as.difftime("3:20", format = "%M:%S")', q: 'What does this print?', a: 'Time difference of 3.333333 mins', o: ['Time difference of 3.333333 hours', 'Time difference of 200 mins', 'Time difference of 3.2 mins'], why: 'Here the format says minutes:seconds, so it is 3 min 20 s = 3.333 minutes.' },
  { topic: 'date', code: 'is.numeric(Sys.Date())', q: 'TRUE or FALSE?', a: 'FALSE', o: ['TRUE', 'NA', 'An error'], why: 'It is stored as a double (is.double is TRUE), but adding two dates makes no sense, so is.numeric says FALSE.' },
  { topic: 'date', code: 'format(as.Date("2026-03-09"), "%B")', q: 'What does this print?', a: '"March"', o: ['"Mar"', '"03"', '"3"'], why: '%B is the full month name, %b the short one, %m the number.' },
  { topic: 'date', code: '# 12-hour clock with AM/PM', q: 'Which codes go together?', a: '%I with %p', o: ['%H with %p', '%I with %H', '%M with %p'], why: '%I is the 01–12 hour and is used with %p for AM/PM. %H is 00–23 and is used without %p.' },
  // ---------- lubridate
  { topic: 'lub', code: 'mdy("July 4, 2026")', q: 'What does this print?', a: '"2026-07-04"', o: ['"2026-04-07"', 'NA', '"July 4, 2026"'], why: 'mdy = month, day, year order. lubridate handles the month name and the comma.' },
  { topic: 'lub', code: 'dmy("4/7/2026")', q: 'What does this print?', a: '"2026-07-04"', o: ['"2026-04-07"', 'NA', '"2026-07-04 00:00:00 UTC"'], why: 'dmy = day first, so 4 is the day and 7 is July.' },
  { topic: 'lub', code: 'make_date(2026)', q: 'What does this print?', a: '"2026-01-01"', o: ['NA', 'An error', '"2026-00-00"'], why: 'Missing month and day default to 1.' },
  { topic: 'lub', code: 'wday(ymd("2026-10-18"))', q: 'October 18, 2026 is a Sunday. What number?', a: '1', o: ['7', '0', '6'], why: 'By default wday() counts Sunday as day 1.' },
  { topic: 'lub', code: 'class(wday(ymd("2026-10-18"), label = TRUE))', q: 'What does this print?', a: '"ordered" "factor"', o: ['"character"', '"numeric"', '"Date"'], why: 'With label = TRUE you get an ordered factor: Sun < Mon < … < Sat.' },
  { topic: 'lub', code: 'yday(ymd("2026-02-01"))', q: 'What number?', a: '32', o: ['1', '2', '31'], why: 'yday = day of the year: 31 days of January, then February 1 is day 32.' },
  { topic: 'lub', code: 'ymd_hms("2026-10-21 09:30:00")', q: 'Which time zone does it use?', a: 'UTC', o: ['Your computer’s time zone', 'GMT-5', 'None (it fails)'], why: 'lubridate parsers default to UTC unless you pass tz = "…".' },
  { topic: 'lub', code: 'ymd_hm("2019-03-23 5:15 p.m.", tz = "America/New_York")', q: 'What time does it give?', a: '05:15 (the "p.m." is ignored)', o: ['17:15', 'NA', '12:15'], why: '"p.m." is not recognized as the PM marker; "PM" is. Replace it first (e.g. with str_replace).' },
  { topic: 'lub', code: 'as_date("2019-07-01") + years(1)', q: 'What does this print?', a: '"2020-07-01"', o: ['"2020-06-30 06:00:00 UTC"', '"2020-07-02"', 'An error'], why: 'years() is a period: "same date next year".' },
  { topic: 'lub', code: 'as_date("2019-07-01") + dyears(1)', q: 'What does this print?', a: '"2020-06-30 06:00:00 UTC"', o: ['"2020-07-01"', '"2020-07-01 00:00:00 UTC"', 'An error'], why: 'dyears(1) is a duration of exactly 365.25 days, and 2020 is a leap year, so you land 6 hours into June 30.' },
  { topic: 'lub', code: 't <- ymd_hms("2022-11-05 12:00:00", tz = "America/New_York")\nt + dhours(24)', q: 'Daylight saving ends overnight. What prints?', a: '"2022-11-06 11:00:00 EST"', o: ['"2022-11-06 12:00:00 EST"', '"2022-11-06 13:00:00 EST"', '"2022-11-06 12:00:00 EDT"'], why: 'A duration is exactly 86400 seconds, and the clocks fell back an hour, so the clock reads 11:00.' },
  { topic: 'lub', code: 't <- ymd_hms("2022-11-05 12:00:00", tz = "America/New_York")\nt + hours(24)', q: 'And with a period?', a: '"2022-11-06 12:00:00 EST"', o: ['"2022-11-06 11:00:00 EST"', '"2022-11-06 13:00:00 EST"', 'An error'], why: 'A period keeps the clock time: same time the next day.' },
  { topic: 'lub', code: '# a span with a fixed start and end', q: 'Which lubridate class is that?', a: 'interval', o: ['duration', 'period', 'difftime'], why: 'Intervals have a start point (interval(a, b) or a %--% b). Durations are seconds; periods are clock units.' },
  { topic: 'lub', code: 'library(tidyverse)\nymd("2026-01-01")', q: 'According to the lecture, what else do you need to run first?', a: 'library(lubridate): tidyverse does not load it', o: ['Nothing, tidyverse loads lubridate', 'install.packages("dates")', 'as.Date() first'], why: 'Your lecture says lubridate is not loaded by library(tidyverse). (Newer tidyverse versions, 2.0+, do load it, but go with the lecture on the quiz.)' },
];
