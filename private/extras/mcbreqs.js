// UF Microbiology & Cell Science B.S.: requirements from the official catalog (2025-2026, https://catalog.ufl.edu/UGRD/previous-catalogs/2025-2026/UGRD/colleges-schools/UGAGL/MCB_BS/). Public catalog info only.
// Requirements text matches the current 2026-2027 page (https://catalog.ufl.edu/UGRD/colleges-schools/UGAGL/MCB_BS/).
// Elective course list from the department site: https://microcell.ufl.edu/undergraduate/on-campus/
export const MCB = {
  source: 'https://catalog.ufl.edu/UGRD/previous-catalogs/2025-2026/UGRD/colleges-schools/UGAGL/MCB_BS/',
  year: '2025-2026',
  college: 'Agricultural and Life Sciences',
  degree: 'Bachelor of Science',
  totalCredits: 120,
  rules: [
    'All majors must take 28 credits: 18 credits are core requirements, 7 credits are department electives and 3 credits are the quantitative requirement. A minimum of one credit in an advanced laboratory is required as part of the 7 department-elective credits.',
    'Minimum grades of C, attained within two attempts (including withdrawals), are required in all critical-tracking courses, major courses, department core requirements, department electives and the quantitative requirement. Second attempts must be completed the next semester of enrollment.',
    'A 2.0 cumulative GPA is required.',
    'All majors must complete the biology and general chemistry sequences and calculus by the end of the sophomore year. CHM 2210 must be completed by the end of tracking term five. To continue in the major, students must attain a minimum 2.5 cumulative GPA in these graded courses with no grade lower than a C.',
    'A 2.5 GPA with minimum grades of C in the bolded science and math courses is required to continue in the major after Semester 4.',
    'Equivalent critical-tracking courses as determined by the State of Florida Common Course Prerequisites may be used for transfer students.',
  ],
  tracking: [
    { sem: 1, items: ['CHM 1025 or CHM 2045/CHM 2045L'], note: '2.5 GPA required for all critical-tracking courses; 2.0 UF GPA required' },
    { sem: 2, items: ['CHM 2045/CHM 2045L', 'MAC 2311'], note: '2.5 GPA required for all critical-tracking courses; 2.0 UF GPA required' },
    { sem: 3, items: ['CHM 2046/CHM 2046L', 'BSC 2010/BSC 2010L'], note: '2.5 GPA required for all critical-tracking courses; 2.0 UF GPA required' },
    { sem: 4, items: ['BSC 2011/BSC 2011L'], note: '2.5 GPA required for all critical-tracking courses; 2.0 UF GPA required' },
    { sem: 5, items: ['CHM 2210 or CHM 2200 or CHM 3217'], note: '2.5 GPA required for all critical-tracking courses; 2.0 upper division GPA required; 2.0 UF GPA required' },
    { sem: 6, items: ['MCB 3023'], note: '2.0 upper division GPA required; 2.0 UF GPA required' },
    { sem: 7, items: ['MCB 4203 (Fall) or PCB 4233 (Spring) or PCB 3134 (Fall/Spring) or MCB 4403 (Fall)'], note: '2.0 upper division GPA required; 2.0 UF GPA required' },
    { sem: 8, items: ['MCB 4034L'], note: '2.0 upper division GPA required; 2.0 UF GPA required' },
  ],
  groups: [
    { name: 'Biology', courses: [
      { code: 'BSC 2010 & 2010L', title: 'Integrated Principles of Biology 1 and Integrated Principles of Biology Laboratory', cr: 4 },
      { code: 'BSC 2011 & 2011L', title: 'Integrated Principles of Biology 2 and Integrated Principles of Biology Laboratory 2', cr: 4 },
    ], note: 'Required Coursework' },
    { name: 'Chemistry', courses: [
      { code: 'CHM 2045 & 2045L', title: 'General Chemistry 1 and General Chemistry Laboratory', cr: 4 },
      { code: 'CHM 2046 & 2046L', title: 'General Chemistry 2 and General Chemistry 2 Laboratory', cr: 4 },
      { code: 'CHM 2210', title: 'Organic Chemistry 1', cr: 3 },
      { code: 'CHM 2211 & 2211L', title: 'Organic Chemistry 2 and Organic Chemistry Laboratory', cr: 5 },
    ], note: 'Required Coursework. Orgo/biochem routes: Traditional CHM 2210, CHM 2211, CHM 2211L, BCH 4024; Alternative 1 (strong chemistry background) CHM 3217, CHM 2211L, CHM 3218; Alternative 2 CHM 2200 (without the lab course), then Alternative 1 (recommended) or Traditional. Meet with major advisor.' },
    { name: 'Math', courses: [
      { code: 'MAC 2311', title: 'Analytic Geometry and Calculus 1', cr: 4 },
    ], note: 'Required Coursework. No statistics course is required; STA 2023 does not satisfy the programming requirement.' },
    { name: 'Physics', courses: [
      { code: 'PHY 2053 & 2053L', title: 'Physics 1 and Laboratory for PHY 2053', cr: null, alt: ['PHY 2048 & 2048L'] },
      { code: 'PHY 2054 & 2054L', title: 'Physics 2 and Laboratory for PHY 2054', cr: null, alt: ['PHY 2049 & 2049L'] },
      { code: 'PHY 2048 & 2048L', title: 'Physics with Calculus 1 and Laboratory for PHY 2048', cr: null },
      { code: 'PHY 2049 & 2049L', title: 'Physics with Calculus 2 and Laboratory for PHY 2049', cr: null },
    ], note: 'Select one: Option One (PHY 2053/2053L + PHY 2054/2054L) or Option Two (PHY 2048/2048L + PHY 2049/2049L), 8-10 credits total. Catalog gives no per-course credits. Required Coursework total: 36-38 credits.' },
    { name: 'Core (MCB/BCH)', courses: [
      { code: 'BSC 2891', title: 'Python Programming for Biology', cr: 3, alt: ['MCB 4325C'] },
      { code: 'BCH 4024', title: 'Introduction to Biochemistry and Molecular Biology', cr: 4, alt: ['CHM 3218'] },
      { code: 'MCB 3023 & 3023L', title: 'Principles of Microbiology and Principles of Microbiology Laboratory', cr: 5 },
      { code: 'MCB 4203', title: 'Bacterial Pathogens', cr: 3, alt: ['PCB 4233'] },
      { code: 'MCB 4304', title: 'Genetics of Microorganisms', cr: 3, alt: ['PCB 4522'] },
      { code: 'MCB 4403', title: 'Prokaryotic Cell Structure and Function', cr: 3, alt: ['PCB 3134'] },
    ], note: 'Core Requirements, 21 credits. Alt titles: MCB 4325C R for Functional Genomics; CHM 3218 Organic Chemistry/Biochemistry 2; PCB 4233 Immunology; PCB 4522 Molecular Genetics; PCB 3134 Eukaryotic Cell Structure and Function. If both "or" courses are taken, one counts as core and the other rolls into the 7-credit department elective requirement.' },
    { name: 'Advanced Lab', courses: [
      { code: 'MCB 4034L', title: 'Advanced Microbiology Laboratory', cr: 1 },
    ], note: 'Critical tracking (Semester 8) and in the model plan (Semester 6). Not listed in the Core Requirements table; the catalog requires at least one advanced-lab credit within the 7 department-elective credits.' },
    { name: 'Programming Requirement', courses: [
      { code: 'BSC 2891', title: 'Python Programming for Biology', cr: 3 },
      { code: 'MCB 4325C', title: 'R for Functional Genomics', cr: null },
    ], note: '3 credits: BSC 2891, MCB 4325C, or any equivalent programming class. A course cannot count toward both this and department electives. STA 2023 will not fulfill this requirement.' },
    { name: 'CALS College Requirements', courses: [
      { code: 'AEC 3030C', title: 'Effective Oral Communication', cr: 3, alt: ['SPC 2608'] },
      { code: 'AEC 3033C', title: 'Research and Business Writing in Agricultural and Life Sciences', cr: 3, alt: ['ENC 2210', 'ENC 3254'] },
      { code: 'ECO 2013', title: 'Principles of Macroeconomics', cr: null, alt: ['ECO 2023', 'AEB 2014'] },
    ], note: 'From the CALS-CLAS MCB comparison: Effective Oral Communication (AEC 3030C, SPC 2608); Technical Writing (ENC 2210, ENC 3254, AEC 3033C); Economics (ECO 2013, ECO 2023, AEB 2014). SPC 2608 = Introduction to Public Speaking; ENC 2210 = Technical Writing; ECO 2023 = Principles of Microeconomics; AEB 2014 = Current Economic Issues, Food and You. The model plan also allows AEB 3103 Principles of Food and Resource Economics. CLAS MCY instead requires a foreign language sequence (8-10 cr), 1 additional humanities and 1 additional social science course.' },
  ],
  electives: {
    credits: 7,
    rule: '7 credits of approved department electives, including one credit in an advanced lab. A maximum of four credits may be taken in other departments; the remaining credits must be chosen from approved department electives. MCB 4911, MCB 4905 and MCB 4934 do not count toward department electives (general elective credit only). MCB 4911 max 3 credits/semester, 6 total.',
    listSource: 'https://microcell.ufl.edu/undergraduate/on-campus/',
    labs: ['MCB 4034L Advanced Lab (Fall, Spring)', 'MCB 4271L Antimicrobial Resistance Lab (Fall)'],
    list: [
      'BSC 4434c Introduction to Bioinformatics (Fall)',
      'ZOO 4232 Human Parasitology (Fall)',
      'MCB 3703 Astrobiology (Spring)',
      'MCB 4320c The Microbiome (Spring)',
      'MCB 4503 General Virology (Fall, Spring)',
      'MCB 4151 Prokaryotic Diversity (Summer C)',
      'MCB 4666 Human Genomics (Fall)',
      'MCB 4422 Probiotics (Spring)',
      'MCB 4271 Antimicrobial Resistance (Fall, Spring)',
      'BSC 4467 Microbial Application of Synthetic Biology (Fall)',
      'ALS 3200C AI In Agriculture and Life Sciences (Fall)',
    ],
  },
  plan: [
    { sem: 'Semester 1', credits: '14', courses: ['Quest 1 (Gen Ed Humanities)', 'CHM 2045 & 2045L*', 'MAC 2311*', 'State Core Gen Ed Composition; Writing Requirement (ENC 1101 recommended)'] },
    { sem: 'Semester 2', credits: '14', courses: ['BSC 2010 & 2010L*', 'BSC 2891 (or similar quantitative elective)', 'CHM 2046 & 2046L*', 'Gen Ed Composition'] },
    { sem: 'Semester 3', credits: '13-14', courses: ['Select one: AEB 2014, AEB 3103, ECO 2013, ECO 2023', 'BSC 2011 & 2011L*', 'CHM 2210*', 'State Core Gen Ed Social and Behavioral Sciences; potentially with Gen Ed International'] },
    { sem: 'Semester 4', credits: '16', courses: ['Quest 2 (Gen Ed Biological or Physical Sciences)', 'AEC 3033C or ENC 2210', 'CHM 2211 & 2211L', 'MCB 3023 & 3023L*'] },
    { sem: 'Semester 5', credits: '17', courses: ['AEC 3030C or SPC 2608', 'MCB 4203 or PCB 4233*', 'MCB 4403 or PCB 3134*', 'Gen Ed International', 'Electives (5)'] },
    { sem: 'Semester 6', credits: '14', courses: ['BCH 4024 or CHM 3218', 'MCB 4304 or PCB 4522*', 'MCB 4034L*', 'Gen Ed Mathematics', 'Department elective'] },
    { sem: 'Semester 7', credits: '16-17', courses: ['Select one: PHY 2048 & 2048L or PHY 2053 & 2053L', 'State Core Gen Ed Humanities', 'Writing Requirement', 'Department elective', 'Elective'] },
    { sem: 'Semester 8', credits: '16-17', courses: ['Select one: PHY 2049 & 2049L or PHY 2054 & 2054L', 'State Core Gen Ed Humanities', 'Gen Ed International', 'Department elective', 'Elective'] },
  ],
  planNotes: [
    '* = Critical Tracking',
    'MCB 4203 is taught in the Fall and Spring. PCB 4233 is taught only in the Spring.',
    'MCB 4304 is taught only in the Fall. PCB 4522 is taught only in the Spring.',
    'Gen Ed International (Semester 5): choice depends on courses taken in Semesters 3 and 4.',
  ],
};
