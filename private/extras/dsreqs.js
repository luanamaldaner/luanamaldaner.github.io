// UF Data Science B.S. (CLAS, catalog year 2025): major requirements as listed in the ONE.UF
// degree audit and the critical-tracking plan. Public catalog info only; her progress lives in the vault.

export const DS = {
  name: 'Data Science (CLAS)',
  tracking: [
    { sem: 1, items: ['MAC2311'], note: '2.0 UF GPA' },
    { sem: 2, items: ['MAC2312', 'STA2023'], note: 'B or better in MAC 2312; B in STA needed for STA 3100' },
    { sem: 3, items: ['MAC2313', 'MAD2502'], note: 'B or better in MAC 2313' },
    { sem: 4, items: ['COP3502C', 'MAS3114', 'STA3100'], note: '2.5 critical-tracking GPA' },
    { sem: 5, items: ['COP3503C', 'MAD3107|COT3100', 'STA4210', 'STA4321'], note: '2.5 critical-tracking GPA' },
    { sem: 6, items: ['COP3530', 'MAS4115', 'PHI3681', 'STA4322'], note: '' },
    { sem: '7–8', items: ['CIS4301', 'STA4241', 'STA4273', 'ELECTIVE'], note: 'plus one subject-area elective' },
  ],
  groups: [
    { name: 'Math core', courses: [['MAD2502', 'Intro to Computational Math'], ['MAS3114', 'Computational Linear Algebra (or MAS 4105)'], ['MAS4115', 'Linear Algebra for Data Science']] },
    { name: 'Statistics core', courses: [['STA3100', 'Programming with Data in R'], ['STA4321', 'Probability'], ['STA4322', 'Inference'], ['STA4210', 'Regression Analysis'], ['STA4241', 'Statistical Learning in R'], ['STA4273', 'Statistical Computing in R']] },
    { name: 'Computer science core', courses: [['COP3502C', 'Programming Fundamentals 1'], ['COP3503C', 'Programming Fundamentals 2'], ['MAD3107|COT3100', 'Discrete Math (or Applications of Discrete Structures)'], ['COP3530', 'Data Structures & Algorithms'], ['CIS4301', 'Information & Database Systems 1']] },
    { name: 'Ethics & subject electives', courses: [['PHI3681', 'Ethics, Data, and Technology'], ['ELECTIVE', 'Subject-matter electives: 9 credits (3 courses) from one division']] },
  ],
};
