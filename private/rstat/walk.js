// Guided lessons for the R tab, in the style of the Biology guided lectures: one piece of code per
// step, what it does in plain words, and a picture (see visual.js for the `vis` kinds).
// Outputs follow Lecture 9 (data frames), Lecture 11 (dates and times) and Lecture 18 (lubridate).

const ALL_ROWS = [1, 2, 3, 4, 5, 6, 7];

export const LESSONS = [
  {
    id: 'df', title: 'Data frames', lecture: 'Lecture 9',
    steps: [
      {
        title: 'Meet the data frame',
        code: 'guitars <- data.frame(mfr, model, serial, type, body, w_case_kg, case_kg)\ndim(guitars)\n## [1] 7 7',
        say: [
          'data.frame() glues vectors together side by side. Each vector becomes one column, so every column has ONE type, but different columns can have different types.',
          'Here the first five columns are text (character) and the last two are numbers. That is something a matrix can’t do: a matrix is all one type.',
        ],
        vis: { kind: 'table', showTypes: true, caption: '7 rows × 7 columns. Blue headers = character, orange headers = numeric.' },
        takeaway: 'A data frame = a table of columns; each column is a vector with a single type.',
      },
      {
        title: 'Names on both sides',
        code: 'names(guitars)\n## [1] "mfr" "model" "serial" "type" "body" "w_case_kg" "case_kg"\nrownames(guitars)\n## [1] "1" "2" "3" "4" "5" "6" "7"',
        say: [
          'A data frame ALWAYS has column names (unlike a matrix, where they are optional) and row names. If you don’t set row names, they are just "1", "2", "3"…',
          'The highlighted parts below are the names: the header row on top and the row names down the left side.',
        ],
        vis: { kind: 'table', hlHeader: true, hlRowNames: true, caption: 'Column names (top) and row names (left) are built in.' },
        takeaway: 'Always column names, always row names (by default the row numbers).',
      },
      {
        title: 'Secretly, it is a list',
        code: 'is.matrix(guitars)\n## [1] FALSE\nis.list(guitars)\n## [1] TRUE\nattributes(guitars)\n## $names  $class "data.frame"  $row.names',
        say: [
          'A data frame is NOT a matrix. Under the hood it is a list, and each element of the list is one column.',
          'Picture the table pulled apart into 7 separate column vectors, like train cars. That’s why list tools ([[ ]] and $) work on it.',
          'Its attributes are names, class and row.names. There is no dim attribute, but dim() still works and gives 7 7.',
        ],
        vis: { kind: 'table', listView: true, caption: 'The same data as a list: 7 column vectors, guitars[[1]] … guitars[[7]].' },
        takeaway: 'Data frame = a list of equal-length columns (with a "data.frame" class).',
        check: { q: 'Which attribute does a data frame NOT have?', a: 'dim', o: ['names', 'class', 'row.names'], why: 'There is no dim attribute (dim() calculates it), only names, class and row.names.' },
      },
      {
        title: 'Look inside with str()',
        code: 'str(guitars)\n## \'data.frame\':  7 obs. of  7 variables:\n##  $ mfr      : chr  "Fender" "Fender" "Gibson" ...\n##  $ w_case_kg: num  8.96 8.6 9.88 8.4 8.1 6.78 5.62',
        say: [
          'str() ("structure") lists every column with its type and the first few values. chr = character, num = numeric.',
          'Since R 4.0, text columns stay character. Before R 4.0, data.frame() turned them into factors (that was the stringsAsFactors = TRUE default).',
        ],
        vis: { kind: 'table', showTypes: true, caption: 'str() tells you the type of each column: chr or num.' },
        takeaway: 'str() = types + a preview; summary() = min/median/mean/max for number columns.',
      },
      {
        title: 'One cell: [row, column]',
        code: 'guitars[2, 6]\n## [1] 8.6',
        say: [
          'Matrix-style indexing: first the row, then the column, separated by a comma.',
          'Row 2 is the Telecaster, column 6 is w_case_kg, so you get 8.6. Notice the result is NOT a little table. It comes back as a plain number (a vector of length 1).',
        ],
        vis: { kind: 'table', cells: [[2, 6]], result: { kind: 'vector', type: 'num', values: ['8.6'] } },
        takeaway: 'One value from one column → a vector.',
      },
      {
        title: 'A whole row: [2, ]',
        code: 'guitars[2, ]\n##      mfr      model serial     type  body w_case_kg case_kg\n## 2 Fender Telecaster  60671 electric solid       8.6    4.98',
        say: [
          'Leaving the column spot empty means "all columns". So guitars[2, ] is the whole second row.',
          'A row mixes types (text AND numbers), so it can’t be squashed into a vector. It stays a data frame with 1 row.',
        ],
        vis: { kind: 'table', rows: [2], result: { kind: 'df', rows: [2], cols: [1, 2, 3, 4, 5, 6, 7] } },
        takeaway: 'Rows come back as a data frame.',
      },
      {
        title: 'A whole column: [, 6]',
        code: 'guitars[, 6]\n## [1] 8.96 8.60 9.88 8.40 8.10 6.78 5.62',
        say: [
          'Leaving the row spot empty means "all rows". guitars[, 6] is the entire w_case_kg column.',
          'Watch what happens: the column comes out lying sideways as a plain vector. That is the big rule: if the result is a SINGLE column (or part of one), R simplifies it to a vector.',
        ],
        vis: { kind: 'table', cols: [6], result: { kind: 'vector', type: 'num', values: ['8.96', '8.60', '9.88', '8.40', '8.10', '6.78', '5.62'] } },
        takeaway: 'A single column with [ , ] → a vector.',
        check: { q: 'class(guitars[, 6]) is…', a: '"numeric"', o: ['"data.frame"', '"list"', '"matrix"'], why: 'One column gets simplified to a numeric vector.' },
      },
      {
        title: 'Keep it a data frame: drop = FALSE',
        code: 'guitars[, 6, drop = FALSE]\n##   w_case_kg\n## 1      8.96\n## 2      8.60\n## …',
        say: [
          '"Dropping" is R’s word for that simplifying. Add drop = FALSE and it stops: you get a one-column data frame instead of a vector.',
          'Watch out: the lecture slide text says "drop = TRUE" here, but that’s a typo. It’s drop = FALSE that keeps the data frame.',
          'Tibbles (tidyverse data frames) always behave like drop = FALSE, so they never surprise you.',
        ],
        vis: { kind: 'table', cols: [6], result: { kind: 'df', rows: ALL_ROWS, cols: [6] } },
        takeaway: 'drop = FALSE → the result stays a data frame.',
      },
      {
        title: 'Several columns: [, c(2, 6, 7)]',
        code: 'guitars[, c(2, 6, 7)]\n##               model w_case_kg case_kg\n## 1      Stratocaster      8.96    5.70\n## …',
        say: [
          'Give a vector of column numbers (or names) to pick several columns.',
          'More than one column can’t become a single vector, so you get a data frame back.',
        ],
        vis: { kind: 'table', cols: [2, 6, 7], result: { kind: 'df', rows: ALL_ROWS, cols: [2, 6, 7] } },
        takeaway: 'Two or more columns → a data frame.',
      },
      {
        title: 'List style: [5] vs [[5]]',
        code: 'guitars[5]      # single brackets\n##       body\n## 1    solid …\nguitars[[5]]    # double brackets\n## [1] "solid" "solid" "solid" "solid" "hollow" "flat top" "flat top"',
        say: [
          'Because a data frame is a list, you can also index it like one, with NO comma.',
          'Single brackets [5] hand you the train car WITH the car: a data frame containing column 5. Double brackets [[5]] open the car and hand you what’s inside: the plain vector.',
        ],
        vis: { kind: 'compare', items: [
          { label: 'guitars[5]', note: 'data frame (1 column)', result: { kind: 'df', rows: ALL_ROWS, cols: [5] } },
          { label: 'guitars[[5]]', note: 'character vector', result: { kind: 'vector', type: 'chr', values: ['"solid"', '"solid"', '"solid"', '"solid"', '"hollow"', '"flat top"', '"flat top"'] } },
        ] },
        takeaway: '[ ] keeps the container (data frame); [[ ]] takes the contents out (vector).',
        check: { q: 'class(guitars[[5]]) is…', a: '"character"', o: ['"data.frame"', '"list"', '"factor"'], why: '[[ ]] pulls the body column out as a character vector (strings are not factors since R 4.0).' },
      },
      {
        title: 'The $ shortcut',
        code: 'guitars$w_case_kg\n## [1] 8.96 8.60 9.88 8.40 8.10 6.78 5.62',
        say: [
          '$ followed by a column name is the everyday shortcut for [["w_case_kg"]]. It also gives a vector.',
          'Same picture as [[ ]]: the contents of one column, lying sideways.',
        ],
        vis: { kind: 'table', cols: [6], result: { kind: 'vector', type: 'num', values: ['8.96', '8.60', '9.88', '8.40', '8.10', '6.78', '5.62'] } },
        takeaway: 'df$col = df[["col"]] → a vector.',
      },
      {
        title: 'Two ways, same result',
        code: 'guitars[c(1, 5)]     # list style\nguitars[, c(1, 5)]   # matrix style',
        say: [
          'Both pick columns 1 and 5 (mfr and body) and return a data frame.',
          'The list style has no comma: with no comma, a single bracket always picks COLUMNS.',
        ],
        vis: { kind: 'table', cols: [1, 5], result: { kind: 'df', rows: ALL_ROWS, cols: [1, 5] } },
        takeaway: 'df[c(1, 5)] = df[, c(1, 5)].',
      },
      {
        title: 'Digging in: [[c(1, 5)]]',
        code: 'guitars[[c(1, 5)]]\n## [1] "Gibson"',
        say: [
          'Giving [[ ]] a vector makes it dig step by step: guitars[[c(1, 5)]] means guitars[[1]][[5]]. First open column 1 (mfr), then take its 5th element.',
          'mfr is Fender, Fender, Gibson, Gibson, Gibson…, so the 5th is "Gibson". On a matrix this is an error; on an ordinary list it digs the same way.',
        ],
        vis: { kind: 'table', cols: [1], cells: [[5, 1]], result: { kind: 'vector', type: 'chr', values: ['"Gibson"'] } },
        takeaway: '[[c(i, j)]] = [[i]][[j]]: element j of column i.',
      },
      {
        title: 'Filter rows with TRUE/FALSE',
        code: 'guitars$type == "acoustic"\n## [1] FALSE FALSE FALSE FALSE FALSE  TRUE  TRUE\nguitars[guitars$type == "acoustic", ]',
        say: [
          'A comparison gives one TRUE/FALSE per row. Put that in the row spot and R keeps only the TRUE rows.',
          'Only the J-100 Xtra and the M-21 are acoustic, so you get a 2-row data frame.',
        ],
        vis: { kind: 'table', rows: [6, 7], flags: [false, false, false, false, false, true, true], result: { kind: 'df', rows: [6, 7], cols: [1, 2, 3, 4, 5, 6, 7] } },
        takeaway: 'df[condition, ] keeps the rows where the condition is TRUE.',
      },
      {
        title: 'Delete a column with NULL',
        code: 'guitars$serial <- NULL\nncol(guitars)\n## [1] 6',
        say: [
          'Assigning NULL to a column removes it. The serial column is gone, so there are 6 columns left.',
          'Related: rownames(df) <- … lets you set row names (e.g. to the serials), but the lecture says that is usually discouraged.',
        ],
        vis: { kind: 'table', strike: [3], caption: 'serial is removed: 7 columns → 6.' },
        takeaway: 'df$col <- NULL deletes the column.',
      },
    ],
  },
  {
    id: 'dates', title: 'Dates & times', lecture: 'Lectures 11 + 18',
    steps: [
      {
        title: 'A Date is secretly a number',
        code: 'today <- Sys.Date()\ntoday\n## [1] "2026-08-05"\nclass(today)\n## [1] "Date"\ntypeof(today)\n## [1] "double"\nunclass(today)\n## [1] 20670',
        say: [
          'Sys.Date() gives today’s date. It prints like text, but it is stored as a double (a number with decimals allowed).',
          'The class "Date" is a label wrapped around that number telling R to print it as a date. unclass() peels the label off and shows the raw number: 20670.',
        ],
        vis: { kind: 'typebox', cls: 'Date', printed: '"2026-08-05"', type: 'double', raw: '20670', rawNote: 'days since 1970-01-01' },
        takeaway: 'Date = a double counting days, with a "Date" label on top.',
      },
      {
        title: 'Counting from day zero',
        code: 'as.numeric(as.Date("1970-01-01"))\n## [1] 0\nas.numeric(as.Date("1970-02-01"))\n## [1] 31\nas.numeric(as.Date("1959-02-03"))\n## [1] -3985',
        say: [
          'The number is how many days since January 1, 1970 ("Unix day zero").',
          'February 1, 1970 is 31 days later. Dates before 1970 are negative: February 3, 1959 (the day the music died) is 3985 days before.',
        ],
        vis: { kind: 'timeline', unit: 'days', marks: [{ v: -3985, label: '1959-02-03' }, { v: 0, label: '1970-01-01', zero: true }, { v: 31, label: '1970-02-01' }, { v: 20670, label: '2026-08-05' }] },
        takeaway: 'Day 0 = 1970-01-01; later dates positive, earlier dates negative.',
        check: { q: 'as.numeric(as.Date("1970-01-10")) is…', a: '9', o: ['10', '0', '1970'], why: 'Jan 1 is day 0, so Jan 10 is day 9.' },
      },
      {
        title: 'Adding to a Date adds days',
        code: 'today + 7\n## [1] "2026-08-12"',
        say: [
          'Because a Date is a count of days, + 7 moves it 7 days forward.',
          'Remember this one, because date-times (coming up) count SECONDS instead.',
        ],
        vis: { kind: 'timeline', unit: 'days', marks: [{ v: 20670, label: '2026-08-05' }, { v: 20677, label: '2026-08-12', hl: true }], hop: { from: 0, to: 1, label: '+ 7 days' } },
        takeaway: 'Date + n = n days later.',
      },
      {
        title: 'Reading other formats',
        code: 'as.Date("02/03/1959", format = "%m/%d/%Y")\n## [1] "1959-02-03"',
        say: [
          'as.Date() expects "YYYY-MM-DD". For anything else, describe the pattern with a format string: each % code stands for one piece.',
          '%m = month number, %d = day, %Y = 4-digit year. The slashes in the format match the slashes in the text.',
        ],
        vis: { kind: 'format', parts: [['02', '%m', 'month'], ['/', null], ['03', '%d', 'day'], ['/', null], ['1959', '%Y', 'year (4 digits)']], result: '"1959-02-03"' },
        takeaway: 'Format codes: %Y 4-digit year, %y 2-digit, %m month, %d day, %b Jan, %B January.',
      },
      {
        title: 'Two-digit years: %y',
        code: 'as.Date("1-28-86", format = "%m-%d-%y")\n## [1] "1986-01-28"\nas.Date("9-11-01", format = "%m-%d-%y")\n## [1] "2001-09-11"',
        say: [
          '%y is a 2-digit year, so R has to guess the century. The rule: 00–68 become 2000s, 69–99 become 1900s.',
          'So "86" → 1986, but "01" → 2001 (and "68" would be 2068!).',
        ],
        vis: { kind: 'century' },
        takeaway: '%y: 00–68 → 20xx, 69–99 → 19xx.',
        check: { q: 'as.Date("5-1-68", format = "%m-%d-%y") gives…', a: '"2068-05-01"', o: ['"1968-05-01"', '"0068-05-01"', 'NA'], why: '68 is in the 00–68 range, so it becomes 2068.' },
      },
      {
        title: 'Dates from pieces: ISOdate()',
        code: 'ISOdate(2020:2022, 12, 31)\n## [1] "2020-12-31 12:00:00 GMT" "2021-12-31 12:00:00 GMT"\n## [3] "2022-12-31 12:00:00 GMT"\nas.Date(ISOdate(2020:2022, 12, 31))\n## [1] "2020-12-31" "2021-12-31" "2022-12-31"',
        say: [
          'When year, month and day sit in separate number columns, ISOdate() glues them together. The 12 and 31 are recycled for each year.',
          'It returns a date-TIME at noon GMT. Wrap it in as.Date() to keep just the date.',
        ],
        vis: { kind: 'pieces', parts: [['year', '2020'], ['month', '12'], ['day', '31']], mid: '"2020-12-31 12:00:00 GMT"', out: '"2020-12-31"' },
        takeaway: 'ISOdate(y, m, d) → date-time at noon GMT; as.Date() → plain Date.',
      },
      {
        title: 'Date-times: POSIXct',
        code: 'now <- Sys.time()\nnow\n## [1] "2026-08-05 16:55:26 EDT"\nclass(now)\n## [1] "POSIXct" "POSIXt"\nunclass(now)\n## [1] 1785963326',
        say: [
          'Sys.time() gives a date AND a time. Its class is POSIXct ("calendar time"), which inherits from POSIXt. (POSIXlt, "local time", is the other base-R kind.)',
          'Same trick as Date: underneath it’s a double, but this one counts SECONDS since 1970-01-01 00:00 UTC.',
        ],
        vis: { kind: 'typebox', cls: 'POSIXct  POSIXt', printed: '"2026-08-05 16:55:26 EDT"', type: 'double', raw: '1785963326', rawNote: 'seconds since 1970-01-01 00:00 UTC' },
        takeaway: 'POSIXct = a double counting seconds since midnight UTC, Jan 1 1970.',
      },
      {
        title: 'Seconds, and time zones',
        code: 'as.numeric(as.POSIXct("1970-01-01 00:01", tz = "UTC"))\n## [1] 60\nas.numeric(as.POSIXct("1970-01-01 01:00", tz = "UTC"))\n## [1] 3600\nas.numeric(as.POSIXct("1970-01-01"))   # in America/New_York\n## [1] 18000',
        say: [
          '1 minute = 60 seconds, 1 hour = 3600 seconds after the zero point.',
          'Without tz, R uses your computer’s time zone. Midnight in New York happens 5 hours after midnight in UTC, so it’s 5 × 3600 = 18000.',
        ],
        vis: { kind: 'timeline', unit: 'seconds', marks: [{ v: 0, label: '00:00 UTC', zero: true }, { v: 60, label: '00:01 UTC' }, { v: 3600, label: '01:00 UTC' }, { v: 18000, label: 'midnight in New York', hl: true }] },
        takeaway: 'POSIXct counts seconds from midnight UTC; your time zone shifts it.',
      },
      {
        title: '+1 on a Date vs a date-time',
        code: 'today + 1   # Date\n## [1] "2026-08-06"\nnow + 1     # POSIXct\n## [1] "2026-08-05 16:55:27 EDT"',
        say: [
          'Same "+ 1", very different jumps. A Date counts days, so + 1 is tomorrow. A POSIXct counts seconds, so + 1 is one second later.',
        ],
        vis: { kind: 'compare', items: [
          { label: 'Date + 1', note: 'one DAY later', result: { kind: 'hop', from: '2026-08-05', to: '2026-08-06' } },
          { label: 'POSIXct + 1', note: 'one SECOND later', result: { kind: 'hop', from: '16:55:26', to: '16:55:27' } },
        ] },
        takeaway: 'Date + 1 = 1 day; POSIXct + 1 = 1 second.',
        check: { q: 'Sys.time() + 60 is how much later?', a: '1 minute', o: ['60 days', '60 hours', '1 hour'], why: 'POSIXct adds seconds: 60 s = 1 minute.' },
      },
      {
        title: 'Time between dates: difftime',
        code: 'today - as.Date("1986-01-28")\n## Time difference of 14799 days\ndifftime(today, as.Date("1986-01-28"), units = "weeks")\n## Time difference of 2114.143 weeks',
        say: [
          'Subtracting dates gives a difftime ("Time difference of …"). difftime() lets you choose the units: secs, mins, hours, days or weeks.',
          'There is NO "months" or "years" unit, because months and years are not all the same length.',
        ],
        vis: { kind: 'span', from: '1986-01-28', to: '2026-08-05', label: '14799 days = 2114.143 weeks', units: [['secs', true], ['mins', true], ['hours', true], ['days', true], ['weeks', true], ['months', false], ['years', false]] },
        takeaway: 'difftime units: secs, mins, hours, days, weeks. No months/years.',
      },
      {
        title: 'Making durations: as.difftime()',
        code: 'as.difftime(1, units = "weeks") + as.difftime(7, units = "days")\n## Time difference of 1209600 secs\nas.difftime("3:20", format = "%H:%M")\n## Time difference of 3.333333 hours\nas.difftime("3:20", format = "%M:%S")\n## Time difference of 3.333333 mins',
        say: [
          'Adding difftimes with different units falls back to seconds: 2 weeks = 14 × 86400 = 1,209,600 secs.',
          'as.difftime() can also read text with a format. The SAME "3:20" means 3 hours 20 minutes with "%H:%M", but 3 minutes 20 seconds with "%M:%S".',
        ],
        vis: { kind: 'compare', items: [
          { label: '"3:20" with %H:%M', note: '3 h 20 min = 3.333 hours', result: { kind: 'format', parts: [['3', '%H', 'hours'], [':', null], ['20', '%M', 'minutes']] } },
          { label: '"3:20" with %M:%S', note: '3 min 20 s = 3.333 mins', result: { kind: 'format', parts: [['3', '%M', 'minutes'], [':', null], ['20', '%S', 'seconds']] } },
        ] },
        takeaway: 'The format decides what each number means.',
      },
      {
        title: 'Stored as double, but not "numeric"',
        code: 'is.double(today)\n## [1] TRUE\nis.numeric(today)\n## [1] FALSE',
        say: [
          'Dates, POSIXct and difftimes are all stored as doubles, so is.double() says TRUE.',
          'But is.numeric() says FALSE, because normal math doesn’t make sense on them: what would today + tomorrow even mean?',
        ],
        vis: { kind: 'checks', items: [['is.double(today)', true], ['is.numeric(today)', false], ['is.numeric(now)', false], ['is.numeric(one_week)', false]] },
        takeaway: 'is.double TRUE, is.numeric FALSE for Date, POSIXct and difftime.',
      },
      {
        title: 'lubridate: parse by order',
        code: 'library(lubridate)\nmdy("Dec 8, 1980")\n## [1] "1980-12-08"\nmdy("12/8/80")\n## [1] "1980-12-08"',
        say: [
          'lubridate makes this much easier. Pick the function whose letters match the ORDER in the text: ymd(), mdy(), dmy(), etc. It figures out separators and month names by itself.',
          'Note from the lecture: library(tidyverse) doesn’t load lubridate, so load it separately.',
        ],
        vis: { kind: 'format', parts: [['Dec', 'm', 'month'], [' ', null], ['8', 'd', 'day'], [', ', null], ['1980', 'y', 'year']], result: '"1980-12-08"', fn: 'mdy' },
        takeaway: 'ymd / mdy / dmy: the letters = the order in the string.',
      },
      {
        title: 'Pieces of a date',
        code: 'x <- as_date("1967-12-10")\nyear(x)   ## 1967\nmonth(x)  ## 12\nwday(x)   ## 1\nyday(x)   ## 344\nwday(x, label = TRUE)\n## [1] Sun\n## Levels: Sun < Mon < Tue < Wed < Thu < Fri < Sat',
        say: [
          'year(), month(), day(), wday() (day of the week), yday() (day of the year) and more pull pieces out of a date.',
          'wday() counts Sunday as 1. With label = TRUE you get an ordered factor (Sun < Mon < … < Sat).',
        ],
        vis: { kind: 'week', on: 0, date: 'Sunday, December 10, 1967' },
        takeaway: 'wday(): Sunday = 1; label = TRUE → ordered factor.',
      },
      {
        title: 'Durations vs periods',
        code: 't <- ymd_hms("2022-11-05 12:00:00", tz = "America/New_York")\nt + dhours(24)   # duration\n## [1] "2022-11-06 11:00:00 EST"\nt + hours(24)    # period\n## [1] "2022-11-06 12:00:00 EST"',
        say: [
          'A DURATION (dhours, ddays, dyears…) is an exact number of seconds. A PERIOD (hours, days, years…) means "the same clock time later".',
          'Overnight on Nov 5–6, 2022 the clocks fell back one hour. 24 exact hours later the clock only reads 11:00, while the period lands on 12:00 like you’d expect.',
          'Same idea with years: as_date("2019-07-01") + dyears(1) = "2020-06-30 06:00:00 UTC" (365.25 days), but + years(1) = "2020-07-01".',
        ],
        vis: { kind: 'dst' },
        takeaway: 'Duration = exact seconds; period = clock time. Interval = a span with a real start and end.',
        check: { q: 'Which one is a period?', a: 'years(1)', o: ['dyears(1)', 'ddays(1)', 'dhours(24)'], why: 'The d- versions (dyears, ddays, dhours) are durations.' },
      },
      {
        title: 'Intervals: a start and an end',
        code: 'brevard <- interval(arrive, depart)   # or arrive %--% depart\nsis <- int_shift(sis, -weeks(1))\nint_end(sis) <- int_end(sis) + days(2)\nint_overlaps(brevard, sis)\n## [1] TRUE\nintersect(brevard, sis)',
        say: [
          'An interval is a time span pinned to the calendar: it has a real start and end.',
          'In the lecture’s Brevard trip, the sister moves her trip a week earlier (int_shift), adds 2 days (int_end), and the two stays still overlap from Jul 25 to Jul 27.',
        ],
        vis: { kind: 'intervals', min: 0, max: 27, ticks: [[0, 'Jul 20'], [5, 'Jul 25'], [10, 'Jul 30'], [15, 'Aug 4'], [20, 'Aug 9'], [25, 'Aug 14']], bars: [{ label: 'brevard', from: 5.77, to: 26.47 }, { label: 'sis', from: 1.96, to: 7.54 }], overlap: { from: 5.77, to: 7.54, label: 'intersect(): Jul 25 → Jul 27' } },
        takeaway: 'interval(a, b) or a %--% b; int_overlaps(), intersect().',
      },
    ],
  },
];

export const COLS = ['mfr', 'model', 'serial', 'type', 'body', 'w_case_kg', 'case_kg'];
export const TYPES = ['chr', 'chr', 'chr', 'chr', 'chr', 'num', 'num'];
export const DATA = [
  ['Fender', 'Stratocaster', 'EJ15230', 'electric', 'solid', '8.96', '5.70'],
  ['Fender', 'Telecaster', '60671', 'electric', 'solid', '8.60', '4.98'],
  ['Gibson', 'Firebird V', '616619', 'electric', 'solid', '9.88', '5.90'],
  ['Gibson', 'Les Paul Standard', '00235628', 'electric', 'solid', '8.40', '3.46'],
  ['Gibson', 'ES175', '03531746', 'electric', 'hollow', '8.10', '4.92'],
  ['Gibson', 'J-100 Xtra', '90783019', 'acoustic', 'flat top', '6.78', '4.76'],
  ['Martin', 'M-21', '1452869', 'acoustic', 'flat top', '5.62', '3.72'],
];
