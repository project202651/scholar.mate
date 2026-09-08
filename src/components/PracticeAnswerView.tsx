'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, Sparkles, CheckSquare, AlertCircle, Edit3, Send, RefreshCw, 
  HelpCircle, ChevronRight, Award, Zap, BookOpen, CheckCircle, XCircle,
  ListFilter, Target, Layers, FileText, Check, ListOrdered, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PracticeAnswerViewProps {
  initialTopic?: string;
  initialSubject?: string;
  initialDocumentId?: string;
}

interface QuestionBankItem {
  id: string;
  marks: number;
  category: string;
  question: string;
  simpleExplanation: string;
  idealAnswer: string;
  keyPoints: string[];
  diagramText: string;
  commonMistakes: string[];
  markingScheme: Array<{ criterion: string; marksAllocated: number; description: string }>;
  quickRevision: string;
  examinerTip: string;
}

interface EvaluationResult {
  scoreObtained: number;
  maxMarks: number;
  percentage: number;
  feedback: string;
  checklistMatches: Array<{
    criterion: string;
    awarded: boolean;
    marksAwarded: number;
    comment: string;
  }>;
  missingKeywords: string[];
  improvementTip: string;
}

const DEFAULT_18_QUESTIONS: QuestionBankItem[] = [
  // 6x 3-Mark Questions
  {
    id: "q1",
    marks: 3,
    category: "3-Mark Short Question",
    question: "Define Database Normalization and state its primary engineering objective.",
    simpleExplanation: "Normalization organizes database tables into clean, non-redundant structures so updates don't create messy inconsistencies.",
    idealAnswer: `### 1. Definition of Normalization
Database Normalization is the formal mathematical technique of organizing relational table schemas to minimize data redundancy and prevent insertion, update, and deletion anomalies.

### 2. Primary Engineering Objective
- Ensures data integrity through lossless decompositions.
- Eliminates anomalies while preserving functional dependencies ($X \\rightarrow Y$).`,
    keyPoints: ["Formal Definition", "Redundancy Elimination", "Anomaly Prevention", "Lossless Join Preservation"],
    diagramText: `[Unnormalized Schema] ──► [Decomposition Matrix] ──► [Normalized 3NF/BCNF Schema]`,
    commonMistakes: ["Confusing data redundancy with data caching", "Omitting anomaly prevention"],
    markingScheme: [
      { criterion: "Formal Technical Definition", marksAllocated: 1.5, description: "Accurately state formal relational definition" },
      { criterion: "Primary Engineering Objectives", marksAllocated: 1.5, description: "Mention anomaly elimination and lossless preservation" }
    ],
    quickRevision: "Normalization = Table reorganization to eliminate redundancy and update/delete anomalies.",
    examinerTip: "Always mention 'insertion, update, and deletion anomalies' for full definition marks."
  },
  {
    id: "q2",
    marks: 3,
    category: "3-Mark Short Question",
    question: "State the rule and mathematical condition for First Normal Form (1NF).",
    simpleExplanation: "Every single cell in a table must contain exactly one atomic piece of information—no lists or comma-separated values in one box.",
    idealAnswer: `### First Normal Form (1NF) Rule
A relation $R$ is in 1NF if and only if the domain of each attribute contains only atomic (indivisible) values, and there are no repeating groups or composite columns.

$$\\forall A \\in R, \\quad \\text{Domain}(A) \\text{ is Atomic}$$`,
    keyPoints: ["Atomic Attribute Values", "No Repeating Groups", "Unique Row Identification", "Domain Atomicity"],
    diagramText: `[Multi-valued Phone: 98480, 98481] ──► [Row 1: 98480] & [Row 2: 98481]`,
    commonMistakes: ["Allowing comma-separated arrays in a single column", "Missing formal domain definition"],
    markingScheme: [
      { criterion: "1NF Formal Rule", marksAllocated: 1.5, description: "State atomicity and no repeating groups" },
      { criterion: "Mathematical Domain Notation", marksAllocated: 1.5, description: "Define domain atomicity condition" }
    ],
    quickRevision: "1NF = Atomic values only · No repeating columns or array groups.",
    examinerTip: "Give a 1-line example showing how a multi-valued phone number splits into two rows."
  },
  {
    id: "q3",
    marks: 3,
    category: "3-Mark Short Question",
    question: "Define Partial Dependency and explain how Second Normal Form (2NF) resolves it.",
    simpleExplanation: "In 2NF, non-key columns cannot depend on only part of a composite primary key—they must depend on the entire key.",
    idealAnswer: `### Partial Functional Dependency
A functional dependency $X \\rightarrow Y$ is a partial dependency if $Y$ depends on a proper subset of a candidate key $X$.

### 2NF Resolution
$R$ is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key. Resolved by decomposing into separate tables.`,
    keyPoints: ["Subset of Candidate Key", "Non-prime Attribute", "Composite Key Condition", "Lossless Join Decomposition"],
    diagramText: `Composite Key (StudentID, CourseID) ──► Grade (Full)\nStudentID ──► StudentName (Partial Dependency -> Split!)`,
    commonMistakes: ["Thinking 2NF applies when candidate key has only 1 column (it only applies to composite keys!)"],
    markingScheme: [
      { criterion: "Partial Dependency Definition", marksAllocated: 1.5, description: "Define dependency on proper subset" },
      { criterion: "2NF Elimination Rule", marksAllocated: 1.5, description: "State full dependency on entire candidate key" }
    ],
    quickRevision: "2NF = 1NF + No Partial Dependency on composite keys.",
    examinerTip: "Underline that 2NF is only relevant when the primary key is composite."
  },
  {
    id: "q4",
    marks: 3,
    category: "3-Mark Short Question",
    question: "Define Transitive Dependency ($X \\rightarrow Y, Y \\rightarrow Z$) and the 3NF constraint.",
    simpleExplanation: "If column A determines column B, and column B determines column C, then column C transitively depends on A. 3NF removes this middleman.",
    idealAnswer: `### Transitive Dependency
In relation $R$, if $X \\rightarrow Y$ and $Y \\rightarrow Z$ hold where $Y \\not\\rightarrow X$, then $X \\rightarrow Z$ is a transitive dependency.

### 3NF Constraint
For every non-trivial functional dependency $X \\rightarrow A$, either $X$ is a superkey, or $A$ is a prime attribute.`,
    keyPoints: ["Transitive Chain X -> Y -> Z", "Non-Prime Transitivity", "3NF Superkey Rule", "Prime Attribute Condition"],
    diagramText: `[EmpID] ──► [DeptID] ──► [DeptLocation] (Transitive Chain -> Decompose!)`,
    commonMistakes: ["Forgetting that 3NF allows $A$ to be a prime attribute"],
    markingScheme: [
      { criterion: "Transitive Dependency Definition", marksAllocated: 1.5, description: "Formal $X \\rightarrow Y, Y \\rightarrow Z$ statement" },
      { criterion: "3NF Formal Superkey / Prime Rule", marksAllocated: 1.5, description: "State both conditions for 3NF" }
    ],
    quickRevision: "3NF = 2NF + No Transitive Dependency ($X \\rightarrow Y \\rightarrow Z$).",
    examinerTip: "State both 3NF conditions: either $X$ is a Superkey OR $A$ is a Prime Attribute."
  },
  {
    id: "q5",
    marks: 3,
    category: "3-Mark Short Question",
    question: "Why is Boyce-Codd Normal Form (BCNF) strictly stronger than 3NF?",
    simpleExplanation: "BCNF removes the loophole in 3NF: in BCNF, the left side of EVERY functional dependency MUST be a superkey without exception.",
    idealAnswer: `### BCNF vs 3NF Constraint
In 3NF, $X \\rightarrow A$ is permitted if $A$ is a prime attribute even if $X$ is not a superkey. BCNF eliminates this exception.

### BCNF Strict Rule
A relation $R$ is in BCNF if for every non-trivial functional dependency $X \\rightarrow Y$, $X$ must strictly be a **Super Key**.`,
    keyPoints: ["Removal of Prime Attribute Exception", "Strict Superkey Rule", "Anomalies in 3NF with Overlapping Keys"],
    diagramText: `3NF: X is Superkey OR A is Prime\nBCNF: X MUST be Superkey (Strict!)`,
    commonMistakes: ["Thinking BCNF and 3NF are identical", "Assuming all 3NF tables are in BCNF"],
    markingScheme: [
      { criterion: "3NF Exception Elimination", marksAllocated: 1.5, description: "Explain prime attribute loophole in 3NF" },
      { criterion: "BCNF Determinant Rule", marksAllocated: 1.5, description: "State strict superkey requirement" }
    ],
    quickRevision: "BCNF = Strict 3NF where every determinant $X$ MUST be a Superkey.",
    examinerTip: "Write the determinant superkey constraint: $\\forall X \\rightarrow Y, X \\text{ is a Superkey}$."
  },
  {
    id: "q6",
    marks: 3,
    category: "3-Mark Short Question",
    question: "What is Lossless-Join Decomposition and how is it mathematically tested?",
    simpleExplanation: "When you split a table into two smaller tables, joining them back together must give you the exact original table without ghost rows.",
    idealAnswer: `### Lossless Join Condition
Decomposition of relation $R$ into $R_1$ and $R_2$ is lossless with respect to $F$ if:
$$R_1 \\cap R_2 \\rightarrow R_1 \\quad \\text{OR} \\quad R_1 \\cap R_2 \\rightarrow R_2$$
The shared attributes must form a superkey of at least one sub-relation.`,
    keyPoints: ["Intersection Superkey Condition", "No Spurious Tuples", "Information Preservation"],
    diagramText: `R(A, B, C) ──► R1(A, B) & R2(A, C) where A is Superkey of R1 or R2`,
    commonMistakes: ["Thinking any natural join is lossless", "Forgetting intersection superkey formula"],
    markingScheme: [
      { criterion: "Lossless Join Definition", marksAllocated: 1.5, description: "Explain preservation of original tuples" },
      { criterion: "Mathematical Intersection Test", marksAllocated: 1.5, description: "State $R_1 \\cap R_2 \\rightarrow R_1 \\text{ or } R_2$" }
    ],
    quickRevision: "Lossless Join = Common columns must be a superkey of table 1 or table 2.",
    examinerTip: "State the mathematical formula $R_1 \\cap R_2 \\rightarrow R_1 \\lor R_1 \\cap R_2 \\rightarrow R_2$."
  },

  // 6x 7-Mark Questions
  {
    id: "q7",
    marks: 7,
    category: "7-Mark Analytical Question",
    question: "Explain the complete progression from 1NF to BCNF with a schema transformation diagram.",
    simpleExplanation: "Step-by-step pipeline showing how unnormalized tables get refined into 1NF, 2NF, 3NF, and BCNF.",
    idealAnswer: `### 1. Progressive Normalization Pipeline
1. **Unnormalized Form (UNF) to 1NF:** Eliminate repeating groups and nested tables to ensure attribute atomicity.
2. **1NF to 2NF:** Remove partial dependencies where non-prime attributes depend on subsets of composite primary keys.
3. **2NF to 3NF:** Remove transitive dependencies ($X \\rightarrow Y \\rightarrow Z$) by splitting non-prime dependencies into reference tables.
4. **3NF to BCNF:** Enforce that every functional dependency determinant is strictly a superkey.

### 2. Schema Transformation Block Schematic
\`\`\`
[ UNF: Multi-valued rows ]
           │ (Enforce atomic fields)
           ▼
[ 1NF: Atomic values, Composite Key ]
           │ (Decompose partial dependencies)
           ▼
[ 2NF: Full functional key dependency ]
           │ (Decompose transitive chains)
           ▼
[ 3NF: No transitive dependencies ]
           │ (Enforce determinant is superkey)
           ▼
[ BCNF: Optimal anomaly-free relational schema ]
\`\`\`

### 3. Engineering Advantage
Guarantees zero update anomalies while maintaining minimal storage footprint.`,
    keyPoints: ["4-Stage Normalization Pipeline", "Schema Transformation Schematic", "Atomic Domain", "Composite Key Decompositions", "BCNF Determinant Rule"],
    diagramText: `UNF ──(Atomic)──► 1NF ──(Full Key)──► 2NF ──(No Transitive)──► 3NF ──(Superkey)──► BCNF`,
    commonMistakes: ["Omitting the transition criteria between each normal form", "Failing to draw directional flow arrows"],
    markingScheme: [
      { criterion: "Pipeline Overview & Principles", marksAllocated: 2, description: "Explain each normal form transition" },
      { criterion: "Labeled Schema Transformation Diagram", marksAllocated: 2.5, description: "Clear ASCII pipeline with directional arrows" },
      { criterion: "Decomposition Mechanics", marksAllocated: 1.5, description: "Explain how tables split safely" },
      { criterion: "Engineering Benefits", marksAllocated: 1, description: "Anomaly elimination and storage optimization" }
    ],
    quickRevision: "UNF -> Atomic -> 1NF -> Full Key -> 2NF -> No Transitive -> 3NF -> Superkey -> BCNF.",
    examinerTip: "Draw the progressive pipeline diagram clearly in the center of the page."
  },
  {
    id: "q8",
    marks: 7,
    category: "7-Mark Analytical Question",
    question: "Differentiate between 3NF and BCNF with a comparative table and a counter-example relation.",
    simpleExplanation: "Highlighting the exact scenario where a table satisfies 3NF but fails BCNF due to overlapping candidate keys.",
    idealAnswer: `### 1. Comparative Matrix

| Evaluation Parameter | Third Normal Form (3NF) | Boyce-Codd Normal Form (BCNF) |
| :--- | :--- | :--- |
| **Determinant Constraint** | For $X \\rightarrow A$, $X$ is Superkey OR $A$ is Prime | For $X \\rightarrow Y$, $X$ MUST strictly be a Superkey |
| **Strictness Level** | Relaxed (allows prime attribute loophole) | Strict (zero exceptions) |
| **Dependency Preservation** | Always guaranteed to preserve dependencies | May lose functional dependencies during decomposition |
| **Redundancy** | Minor redundancy possible with overlapping keys | Zero redundancy from functional dependencies |

### 2. Counter-Example Schema
Consider relation $R(\\text{Student}, \\text{Course}, \\text{Instructor})$ with dependencies:
- $(\\text{Student}, \\text{Course}) \\rightarrow \\text{Instructor}$ (Candidate Key)
- $\\text{Instructor} \\rightarrow \\text{Course}$

Here, $\\text{Course}$ is a prime attribute, so it is in **3NF**. However, $\\text{Instructor}$ is NOT a superkey, so it **FAILS BCNF**.`,
    keyPoints: ["4-Row Comparative Table", "Prime Attribute Loophole", "Dependency Preservation Trade-off", "Counter-Example Schema ($R(\\text{Student, Course, Instructor})$)"],
    diagramText: `3NF: Allows Instructor -> Course because Course is Prime\nBCNF: Rejects Instructor -> Course because Instructor is not Superkey`,
    commonMistakes: ["Forgetting to mention that BCNF does not always preserve functional dependencies", "Not providing a concrete schema counter-example"],
    markingScheme: [
      { criterion: "Comparative Matrix Format", marksAllocated: 2.5, description: "Table contrasting 3NF vs BCNF across 4 metrics" },
      { criterion: "Concrete Counter-Example Schema", marksAllocated: 2.5, description: "Demonstrate Student/Course/Instructor schema" },
      { criterion: "Dependency Preservation Analysis", marksAllocated: 2, description: "Explain why 3NF is sometimes preferred in practice" }
    ],
    quickRevision: "3NF allows $X \\rightarrow \\text{Prime}$; BCNF mandates $X = \\text{Superkey}$. 3NF preserves all FDs.",
    examinerTip: "Use the classic $\\text{Student-Course-Instructor}$ example to secure maximum marks."
  },
  {
    id: "q9",
    marks: 7,
    category: "7-Mark Analytical Question",
    question: "Explain the insertion, update, and deletion anomalies that occur in unnormalized schemas with concrete examples.",
    simpleExplanation: "Real-world examples showing how bad database designs accidentally delete critical data or cause conflicting duplicate records.",
    idealAnswer: `### 1. Overview of Relational Anomalies
In unnormalized schemas, data redundancy leads to three catastrophic runtime data anomalies.

### 2. Concrete Schema: \`Emp_Project(EmpID, EmpName, ProjID, ProjName, ProjBudget)\`

1. **Insertion Anomaly:** Cannot record a new project without assigning an employee. Inserting a project with \`EmpID = NULL\` violates Primary Key entity integrity.
2. **Deletion Anomaly:** If the only employee working on Project 'P100' leaves the company, deleting their row deletes all historical project details and budget records.
3. **Update / Modification Anomaly:** If Project 'P100' budget changes, we must update hundreds of employee rows. Missing a single row causes inconsistent, conflicting database records.

### 3. Normalization Fix
Decompose into \`Employee(EmpID, EmpName)\`, \`Project(ProjID, ProjName, ProjBudget)\`, and \`Assignment(EmpID, ProjID)\`.`,
    keyPoints: ["Insertion Anomaly", "Deletion Anomaly", "Update / Modification Anomaly", "Entity Integrity Breach", "Decomposition Remedy"],
    diagramText: `[Emp_Project] ──► Decompose to ──► [Employee] + [Project] + [Assignment]`,
    commonMistakes: ["Explaining anomalies abstractly without a concrete table example", "Confusing deletion anomaly with foreign key cascade"],
    markingScheme: [
      { criterion: "Insertion Anomaly with Schema", marksAllocated: 2, description: "Explain NULL primary key block" },
      { criterion: "Deletion Anomaly with Schema", marksAllocated: 2, description: "Explain unintended data loss" },
      { criterion: "Update Anomaly with Schema", marksAllocated: 2, description: "Explain conflicting duplicate rows" },
      { criterion: "Normalization Decomposed Schema", marksAllocated: 1, description: "Show decomposed 3NF remedy" }
    ],
    quickRevision: "Insertion (can't add without dummy key), Deletion (unintended data loss), Update (inconsistent duplicates).",
    examinerTip: "Always use a sample table like \`Emp_Project\` to illustrate all 3 anomalies."
  },
  {
    id: "q10",
    marks: 7,
    category: "7-Mark Analytical Question",
    question: "Describe Dependency-Preserving Decomposition and how to test for it using attribute closures.",
    simpleExplanation: "When breaking down tables, you must ensure you can still verify all original business rules and constraints without doing expensive table joins.",
    idealAnswer: `### 1. Dependency Preservation Concept
A decomposition $D = \\{R_1, R_2, \\dots, R_k\\}$ preserves dependencies with respect to $F$ if:
$$(F_1 \\cup F_2 \\cup \\dots \\cup F_k)^+ = F^+$$
where $F_i$ is the projection of functional dependencies onto relation $R_i$.

### 2. Step-by-Step Testing Procedure
1. For each dependency $X \\rightarrow Y \\in F$, check if it can be verified directly within a single decomposed relation $R_i$.
2. If not, compute attribute closure $X^+$ under $\\bigcup F_i$.
3. If $Y \\subseteq X^+$, the dependency is preserved; otherwise, it is lost.

### 3. Practical Trade-off
3NF guarantees both lossless join and dependency preservation, whereas BCNF may sacrifice dependency preservation.`,
    keyPoints: ["Projection of Dependencies $F_i$", "Closure Equality $(F_1 \\cup F_2)^+ = F^+$", "Attribute Closure Algorithm", "3NF vs BCNF Trade-off"],
    diagramText: `Original FDs (F) ──► Project to F1 & F2 ──► Verify (F1 U F2)+ = F+`,
    commonMistakes: ["Confusing dependency preservation with lossless join property", "Skipping closure calculation steps"],
    markingScheme: [
      { criterion: "Formal Dependency Preservation Definition", marksAllocated: 2, description: "State $(F_1 \\cup \\dots \\cup F_k)^+ = F^+$" },
      { criterion: "Attribute Closure Verification Algorithm", marksAllocated: 3, description: "Step-by-step closure computation" },
      { criterion: "Practical Engineering Trade-off", marksAllocated: 2, description: "3NF vs BCNF preservation comparison" }
    ],
    quickRevision: "Dependency Preservation = $(F_1 \\cup F_2)^+ = F^+$. 3NF guarantees preservation; BCNF may not.",
    examinerTip: "Explicitly state that dependency preservation avoids expensive SQL multi-table joins on write."
  },
  {
    id: "q11",
    marks: 7,
    category: "7-Mark Analytical Question",
    question: "Explain Fourth Normal Form (4NF) and Multi-Valued Dependencies ($X \\twoheadrightarrow Y$) with a schema example.",
    simpleExplanation: "4NF deals with independent multi-valued facts—like an employee having multiple independent phone numbers and multiple independent hobbies.",
    idealAnswer: `### 1. Multi-Valued Dependency (MVD)
An MVD $X \\twoheadrightarrow Y$ in relation $R(X, Y, Z)$ states that the presence of pairs $(x, y_1, z_1)$ and $(x, y_2, z_2)$ implies that $(x, y_1, z_2)$ and $(x, y_2, z_1)$ must also exist in $R$. $Y$ and $Z$ are completely independent of each other.

### 2. 4NF Rule
A relation $R$ is in 4NF if it is in BCNF and for every non-trivial MVD $X \\twoheadrightarrow Y$, $X$ is a **Super Key**.

### 3. Concrete Example: \`Student_Skills(StudentID, Skill, Language)\`
- $\\text{StudentID} \\twoheadrightarrow \\text{Skill}$
- $\\text{StudentID} \\twoheadrightarrow \\text{Language}$
Causes Cartesian product row explosion. Resolved by decomposing into \`Student_Skill(StudentID, Skill)\` and \`Student_Lang(StudentID, Language)\`.`,
    keyPoints: ["Multi-Valued Dependency $X \\twoheadrightarrow Y$", "Cartesian Product Anomaly", "4NF Superkey Condition", "Schema Decomposition Solution"],
    diagramText: `StudentID ->> Skill & StudentID ->> Lang\nDecompose to: [Student_Skill] + [Student_Lang] (Eliminates Cartesian Explosion)`,
    commonMistakes: ["Confusing multi-valued dependency with standard 1NF repeating groups", "Failing to explain independent Cartesian product rows"],
    markingScheme: [
      { criterion: "Multi-Valued Dependency (MVD) Definition", marksAllocated: 2.5, description: "Formal tuple interchange definition" },
      { criterion: "4NF Formal Condition", marksAllocated: 2, description: "State BCNF + MVD superkey rule" },
      { criterion: "Decomposition Solution & Cartesian Elimination", marksAllocated: 2.5, description: "Show Student-Skill-Language decomposition" }
    ],
    quickRevision: "4NF = BCNF + No Multi-Valued Dependencies ($X \\twoheadrightarrow Y$). Prevents Cartesian row explosions.",
    examinerTip: "Show the tuple interchange property: $(x, y_1, z_1) \\land (x, y_2, z_2) \\Rightarrow (x, y_1, z_2)$."
  },
  {
    id: "q12",
    marks: 7,
    category: "7-Mark Analytical Question",
    question: "When should a database architect choose Denormalization in high-performance production systems?",
    simpleExplanation: "Why companies like Netflix or Uber intentionally re-introduce controlled redundancy to make read queries blazing fast.",
    idealAnswer: `### 1. Concept of Denormalization
Denormalization is the deliberate, controlled re-introduction of redundancy into a normalized schema to optimize read query performance and reduce expensive multi-table joins.

### 2. High-Yield Production Scenarios
1. **Read-Heavy Online Analytics (OLAP / BI):** Pre-joining dimension tables with fact tables in Data Warehouses to enable instantaneous aggregate reporting.
2. **High-Frequency Dashboard Counters:** Storing \`Post.Like_Count\` directly in the Post table instead of running \`SELECT COUNT(*)\` across millions of rows.
3. **E-Commerce Historical Invoicing:** Storing frozen customer address and product price at time of purchase inside the Order table.

### 3. Trade-offs & Mitigations
- *Trade-off:* Increased write latency and potential inconsistency.
- *Mitigation:* Database triggers, write-behind caching, or asynchronous materialized views.`,
    keyPoints: ["Controlled Redundancy", "Multi-Table Join Reduction", "OLAP Data Warehousing", "Materialized Views & Triggers", "Historical Invoicing Immutability"],
    diagramText: `Normalized: Join 4 Tables (Slow Read) ──► Denormalized: 1 Table Query (Sub-10ms Read)`,
    commonMistakes: ["Claiming denormalization should replace normalization everywhere", "Ignoring the risk of write overhead and inconsistency"],
    markingScheme: [
      { criterion: "Denormalization Definition & Rationale", marksAllocated: 2, description: "Explain read optimization rationale" },
      { criterion: "3 Concrete Industrial Scenarios", marksAllocated: 3, description: "OLAP, counters, and historical invoices" },
      { criterion: "Trade-offs & Inconsistency Mitigations", marksAllocated: 2, description: "Triggers and materialized views" }
    ],
    quickRevision: "Denormalization = Controlled redundancy to eliminate SQL joins in read-heavy production systems.",
    examinerTip: "Mention trade-offs: faster reads vs slower writes and higher storage footprint."
  },

  // 6x 10-Mark Questions
  {
    id: "q13",
    marks: 10,
    category: "10-Mark Comprehensive Problem",
    question: "Given Relation R(A, B, C, D, E) and Functional Dependencies F, find all Candidate Keys and decompose R into BCNF step-by-step.",
    simpleExplanation: "Complete end-to-end numerical problem showing attribute closures, candidate key identification, and lossless BCNF decomposition.",
    idealAnswer: `### 1. Problem Specification
Given $R(A, B, C, D, E)$ with functional dependencies:
$$F = \\{ A \\rightarrow BC, \\quad CD \\rightarrow E, \\quad B \\rightarrow D, \\quad E \\rightarrow A \\}$$

---

### 2. Step 1: Attribute Closure & Candidate Key Identification
- $(A)^+ = \\{A, B, C, D, E\\} \\implies A \\text{ is a Candidate Key.}$
- $(E)^+ = \\{E, A, B, C, D\\} \\implies E \\text{ is a Candidate Key.}$
- $(BC)^+$: Since $B \\rightarrow D$, $(BC)^+ = (BCD)^+ = \\{B, C, D, E, A\\} \\implies BC \\text{ is a Candidate Key.}$
- $(CD)^+$: Since $CD \\rightarrow E$, $(CD)^+ = \\{C, D, E, A, B\\} \\implies CD \\text{ is a Candidate Key.}$

$$\\text{Candidate Keys} = \\{ A, E, BC, CD \\}$$

---

### 3. Step 2: Test Each Dependency for BCNF
1. $A \\rightarrow BC$: $A$ is a Candidate Key $\\implies$ **Satisfies BCNF**.
2. $CD \\rightarrow E$: $CD$ is a Candidate Key $\\implies$ **Satisfies BCNF**.
3. $B \\rightarrow D$: $B$ is NOT a Super Key $\\implies$ **VIOLATES BCNF!**

---

### 4. Step 3: Decompose Relation on Violating FD $B \\rightarrow D$
Decompose $R$ into:
1. $R_1(B, D)$ with FD $\\{ B \\rightarrow D \\}$. Key is $B$. **(In BCNF)**
2. $R_2(A, B, C, E)$ with FDs projected from $F$: $\\{ A \\rightarrow BC, E \\rightarrow A \\}$. Keys are $A, E$. **(In BCNF)**

---

### 5. Final Result Box
$$\\boxed{\\text{Decomposed Schemas: } R_1(B, D) \\text{ and } R_2(A, B, C, E) \\text{ with Lossless Join Guarantee.}}$$`,
    keyPoints: ["Attribute Closure Calculations", "Candidate Keys {A, E, BC, CD}", "BCNF Violation Detection on B -> D", "Lossless Join Verification", "Final Boxed Solution"],
    diagramText: `R(A, B, C, D, E) ──(Violates B -> D)──► R1(B, D) + R2(A, B, C, E) [Both in BCNF!]`,
    commonMistakes: ["Missing candidate keys (like $BC$ or $CD$)", "Failing to verify closure of intermediate subsets", "Forgetting the final boxed answer"],
    markingScheme: [
      { criterion: "Complete Attribute Closures & All Candidate Keys", marksAllocated: 3, description: "Calculate closures and identify all 4 keys" },
      { criterion: "Systematic BCNF Compliance Check", marksAllocated: 2, description: "Identify $B \\rightarrow D$ as the violating dependency" },
      { criterion: "Step-by-Step Lossless Decomposition", marksAllocated: 3, description: "Decompose into $R_1(B,D)$ and $R_2(A,B,C,E)$" },
      { criterion: "Final Verification & Boxed Presentation", marksAllocated: 2, description: "Verify sub-schema BCNF and box answer" }
    ],
    quickRevision: "1) Compute closures -> 2) Find candidate keys -> 3) Check $X \\rightarrow Y$ superkeys -> 4) Decompose on violation.",
    examinerTip: "Always show all intermediate attribute closure steps $(A)^+, (E)^+, (BC)^+, (CD)^+$ for full marks."
  },
  {
    id: "q14",
    marks: 10,
    category: "10-Mark Comprehensive Problem",
    question: "Design an enterprise university relational schema from scratch, normalize it to 3NF/BCNF, and explain the ER-to-Relational mapping rules.",
    simpleExplanation: "Comprehensive database design case study covering Entities, Cardinalities, Normalization, and Foreign Key constraints.",
    idealAnswer: `### 1. Enterprise University Case Study Scope
Entities: \`Student\`, \`Department\`, \`Course\`, \`Faculty\`, and \`Enrollment\`.

---

### 2. ER-to-Relational Mapping Rules
1. **Strong Entities:** Create dedicated table with primary key (\`StudentID\`, \`CourseID\`).
2. **1:N Relationships:** Place Foreign Key on the 'Many' side (\`Student.DeptID\` references \`Department.DeptID\`).
3. **M:N Relationships:** Create associative junction table with composite key (\`Enrollment(StudentID, CourseID, Grade, Semester)\`).

---

### 3. Normalized 3NF/BCNF Database Topology
\`\`\`
┌─────────────────────────┐         ┌─────────────────────────┐
│ Department              │ ◄─────┐ │ Student                 │
│ ─────────────────────── │       │ │ ─────────────────────── │
│ DeptID (PK)             │       └─┼─ DeptID (FK)             │
│ DeptName, OfficeBuilding│         │ StudentID (PK), Name    │
└─────────────────────────┘         └─────────────────────────┘
             ▲                                   │
             │                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│ Faculty                 │         │ Enrollment (Junction)   │
│ ─────────────────────── │         │ ─────────────────────── │
│ FacultyID (PK)          │         │ StudentID (PK, FK)      │
│ DeptID (FK), Email      │         │ CourseID (PK, FK)       │
└─────────────────────────┘         │ Semester, Grade         │
             ▲                      └─────────────────────────┘
             │                                   ▲
┌─────────────────────────┐                      │
│ Course                  │ ─────────────────────┘
│ ─────────────────────── │
│ CourseID (PK), Title    │
│ FacultyID (FK), Credits │
└─────────────────────────┘
\`\`\`

---

### 4. Integrity Constraints & Foreign Key Rules
- \`ON DELETE CASCADE\` on Enrollment records when a student record is purged.
- \`ON DELETE RESTRICT\` on Department records to prevent orphan students.`,
    keyPoints: ["5 Entity Relational Architecture", "ER-to-Relational Mapping Principles", "1:N & M:N Junction Rules", "3NF/BCNF Compliance", "Cascade vs Restrict Integrity"],
    diagramText: `Department ◄── Student ──► Enrollment ◄── Course ◄── Faculty`,
    commonMistakes: ["Omitting the associative junction table for M:N relationships", "Forgetting foreign key referential integrity rules"],
    markingScheme: [
      { criterion: "ER-to-Relational Mapping Rules Explained", marksAllocated: 2.5, description: "Strong entities, 1:N and M:N rules" },
      { criterion: "Complete Architectural Schema Topology", marksAllocated: 3.5, description: "All 5 tables with PKs and FKs diagrammed" },
      { criterion: "3NF / BCNF Normalization Justification", marksAllocated: 2, description: "Explain why schemas are anomaly-free" },
      { criterion: "Referential Integrity & Constraints", marksAllocated: 2, description: "Cascade and restrict rules" }
    ],
    quickRevision: "1:N = FK on many side · M:N = Junction table with composite PK · All tables in BCNF.",
    examinerTip: "Draw the relational topology diagram clearly showing PK and FK connections."
  },
  {
    id: "q15",
    marks: 10,
    category: "10-Mark Comprehensive Problem",
    question: "Explain Armstrong's Axioms, Soundness & Completeness, and derive the secondary inference rules (Union, Decomposition, Pseudo-transitivity).",
    simpleExplanation: "The foundational mathematical theorems that prove how functional dependencies operate in relational databases.",
    idealAnswer: `### 1. Armstrong's Primary Axioms
Let $F$ be a set of functional dependencies over relation $R$. The three primary axioms are:

1. **Axiom of Reflexivity:** If $Y \\subseteq X$, then $X \\rightarrow Y$.
2. **Axiom of Augmentation:** If $X \\rightarrow Y$, then $XZ \\rightarrow YZ$ for any attribute set $Z$.
3. **Axiom of Transitivity:** If $X \\rightarrow Y$ and $Y \\rightarrow Z$, then $X \\rightarrow Z$.

---

### 2. Soundness & Completeness
- **Soundness:** Any dependency inferred using Armstrong's axioms holds in every legal relation instance of $R$.
- **Completeness:** Repeated application of Armstrong's axioms generates ALL valid functional dependencies in $F^+$ (no missing dependencies).

---

### 3. Step-by-Step Proof of Secondary Inference Rules

#### A. Proof of Union Rule: If $X \\rightarrow Y$ and $X \\rightarrow Z$, then $X \\rightarrow YZ$.
1. Given $X \\rightarrow Y$, apply Augmentation with $X$: $X \\rightarrow XY$.
2. Given $X \\rightarrow Z$, apply Augmentation with $Y$: $XY \\rightarrow YZ$.
3. Apply Transitivity to $X \\rightarrow XY$ and $XY \\rightarrow YZ$: $\\mathbf{X \\rightarrow YZ}$. $\\quad \\blacksquare$

#### B. Proof of Decomposition Rule: If $X \\rightarrow YZ$, then $X \\rightarrow Y$ and $X \\rightarrow Z$.
1. Since $Y \\subseteq YZ$, by Reflexivity: $YZ \\rightarrow Y$.
2. Given $X \\rightarrow YZ$ and $YZ \\rightarrow Y$, by Transitivity: $\\mathbf{X \\rightarrow Y}$. $\\quad \\blacksquare$

#### C. Proof of Pseudo-Transitivity Rule: If $X \\rightarrow Y$ and $WY \\rightarrow Z$, then $WX \\rightarrow Z$.
1. Given $X \\rightarrow Y$, apply Augmentation with $W$: $WX \\rightarrow WY$.
2. Given $WX \\rightarrow WY$ and $WY \\rightarrow Z$, by Transitivity: $\\mathbf{WX \\rightarrow Z}$. $\\quad \\blacksquare$`,
    keyPoints: ["3 Primary Axioms (Reflexivity, Augmentation, Transitivity)", "Soundness & Completeness Definitions", "Union Proof", "Decomposition Proof", "Pseudo-transitivity Proof"],
    diagramText: `Primary Axioms (Reflexivity, Augmentation, Transitivity) ──► Derive ──► Union, Decomp, Pseudo-Transitivity`,
    commonMistakes: ["Stating rules without showing the formal deductive step-by-step proofs", "Confusing reflexivity with augmentation"],
    markingScheme: [
      { criterion: "3 Primary Armstrong's Axioms Formulated", marksAllocated: 2.5, description: "State reflexivity, augmentation, transitivity" },
      { criterion: "Soundness & Completeness Rigorous Definition", marksAllocated: 2, description: "Explain mathematical validity" },
      { criterion: "3 Step-by-Step Formal Proofs", marksAllocated: 4.5, description: "Complete deductive proofs for Union, Decomp, Pseudo-transitivity" },
      { criterion: "Boxed Summary & Notation", marksAllocated: 1, description: "Q.E.D. / Boxed conclusions" }
    ],
    quickRevision: "Primary: Reflexivity, Augmentation, Transitivity -> Derived: Union, Decomposition, Pseudo-transitivity.",
    examinerTip: "Show every deductive step explicitly with the axiom name in parentheses (e.g. 'by Augmentation')."
  },
  {
    id: "q16",
    marks: 10,
    category: "10-Mark Comprehensive Problem",
    question: "Describe the synthesis algorithm to decompose any relation into 3NF guaranteeing BOTH Lossless-Join and Dependency Preservation.",
    simpleExplanation: "Bernstein's synthesis algorithm that guarantees a perfect 3NF schema where no business rules or joins are lost.",
    idealAnswer: `### 1. The 3NF Synthesis (Bernstein's) Algorithm
Unlike BCNF decomposition which can lose dependencies, Bernstein's algorithm guarantees:
1. **Third Normal Form (3NF)**
2. **Lossless Join Decomposition**
3. **Complete Functional Dependency Preservation**

---

### 2. Step-by-Step Algorithm Pipeline

\`\`\`
[ Step 1: Compute Canonical Minimal Cover (Fc) ]
                        │
                        ▼
[ Step 2: Create a Relation Ri = X U {Y1, Y2...} for each X -> Y in Fc ]
                        │
                        ▼
[ Step 3: Candidate Key Check: If no Ri contains a candidate key, create R_key ]
                        │
                        ▼
[ Step 4: Redundancy Elimination: Drop Ri if Ri ⊆ Rj ]
\`\`\`

---

### 3. Solved Numerical Execution
Given $R(A, B, C, D)$ and $F = \\{ A \\rightarrow B, B \\rightarrow C, C \\rightarrow D, D \\rightarrow A \\}$:
1. Minimal cover $F_c = F$.
2. Create schemas: $R_1(A, B), R_2(B, C), R_3(C, D), R_4(D, A)$.
3. Check Candidate Keys: Candidate keys are $A, B, C, D$. Every sub-relation contains a candidate key.
4. Final decomposition: $\\{ R_1(A,B), R_2(B,C), R_3(C,D), R_4(D,A) \\}$.

---

### 4. Mathematical Guarantees
- **Lossless:** Ensured by presence of Candidate Key.
- **Preservation:** Ensured because every FD in $F_c$ is contained in a single relation.`,
    keyPoints: ["Minimal Canonical Cover $F_c$", "Bernstein's Synthesis Algorithm", "Candidate Key Insertion Step", "Sub-schema Pruning", "Dual Mathematical Guarantee"],
    diagramText: `Fc ──► Create Relations for each FD ──► Add Candidate Key table ──► Prune Subsets ──► Perfect 3NF!`,
    commonMistakes: ["Forgetting Step 3 (adding a candidate key table if none exists)", "Skipping the minimal cover simplification"],
    markingScheme: [
      { criterion: "Algorithm Overview & Guarantees", marksAllocated: 2, description: "State 3NF, Lossless, and Dependency preservation" },
      { criterion: "4-Stage Algorithm Pseudocode / Workflow", marksAllocated: 3.5, description: "Detail all 4 steps clearly" },
      { criterion: "Solved Numerical Problem with Synthesis Steps", marksAllocated: 3.5, description: "Execute synthesis step-by-step on sample relation" },
      { criterion: "Mathematical Proof of Guarantees", marksAllocated: 1, description: "Justify lossless join and preservation" }
    ],
    quickRevision: "Minimal Cover -> Create table for each FD -> Add Candidate Key table if missing -> Prune subsets.",
    examinerTip: "Emphasize that 3NF synthesis is polynomial-time and always avoids multi-table join anomalies."
  },
  {
    id: "q17",
    marks: 10,
    category: "10-Mark Comprehensive Problem",
    question: "Formulate a comprehensive exam preparation masterclass on Database Normalization covering all past 5 years university questions.",
    simpleExplanation: "The definitive revision dossier and strategy breakdown for scoring full marks in Database Normalization.",
    idealAnswer: `### 1. 5-Year Frequency Matrix & Weightage Breakdown
Database Normalization consistently represents $25\\%$ to $30\\%$ of the entire DBMS university exam paper.

- **Part A (3-Mark Questions):** Definitions of 1NF, 2NF, 3NF, BCNF, Anomaly types, and Lossless join formula.
- **Part B (7-Mark Questions):** 3NF vs BCNF comparison table, 4NF Multi-valued dependencies, and ER mapping rules.
- **Part C (10-Mark Questions):** Numerical BCNF decomposition from functional dependencies and Bernstein 3NF synthesis.

---

### 2. The 4-Step Exam Scoring Master Strategy
1. **Step 1 (First 2 Mins):** Write the formal definition and underline key phrases (\`insertion, update, deletion anomalies\`, \`superkey\`).
2. **Step 2 (Next 4 Mins):** Draw a clean ASCII schema diagram with clear table borders and directional arrows.
3. **Step 3 (Next 5 Mins):** Show all intermediate attribute closures $(A)^+, (B)^+$ and state why each sub-table satisfies the normal form.
4. **Step 4 (Final 1 Min):** Highlight and draw a double box around the final decomposed schemas.

---

### 3. Rapid Formula Cheat Sheet
- $\\text{1NF} \\implies \\text{Atomic Domain}$
- $\\text{2NF} \\implies \\text{1NF} + \\text{No Partial Dependency}$
- $\\text{3NF} \\implies \\text{2NF} + (X \\text{ is Superkey } \\lor A \\text{ is Prime})$
- $\\text{BCNF} \\implies \\forall X \\rightarrow Y, \\, X \\text{ is Superkey}$
- $\\text{Lossless Join} \\implies R_1 \\cap R_2 \\rightarrow R_1 \\lor R_1 \\cap R_2 \\rightarrow R_2$`,
    keyPoints: ["5-Year Exam Frequency Analysis", "3M, 7M, 10M Blueprint", "4-Step Time Allocation Formula", "Rapid Normal Form Cheat Sheet", "Boxed Final Presentation"],
    diagramText: `Exam Timeline: [0-2m: Definition] ──► [2-6m: Schema Diagram] ──► [6-11m: Closures & Proof] ──► [11-12m: Box Answer]`,
    commonMistakes: ["Spending too long on 3-mark definitions and running out of time for 10-mark numericals"],
    markingScheme: [
      { criterion: "5-Year Recurring Question Analysis", marksAllocated: 2.5, description: "Categorize 3M, 7M, and 10M recurring questions" },
      { criterion: "Time-Management & Presentation Formula", marksAllocated: 3.5, description: "Step-by-step 12-minute essay execution" },
      { criterion: "Comprehensive Formula Cheat Sheet", marksAllocated: 3, description: "1NF through BCNF equations and lossless join rule" },
      { criterion: "Model High-Scoring Response Framework", marksAllocated: 1, description: "Boxed conclusions and diagram standards" }
    ],
    quickRevision: "1NF (Atomic) -> 2NF (Full Key) -> 3NF (Prime/Superkey) -> BCNF (Strict Superkey) -> Lossless Join Formula.",
    examinerTip: "Underline technical terms with a pencil so the examiner spots them immediately."
  },
  {
    id: "q18",
    marks: 10,
    category: "10-Mark Comprehensive Problem",
    question: "Explain Multi-Table Indexing, B-Tree Clustered Indexes, and query optimization trade-offs in Normalized Relational Databases.",
    simpleExplanation: "How database engines physically execute queries across normalized tables using B-Tree indexes without scanning entire disks.",
    idealAnswer: `### 1. Normalized Relational Performance Overhead
While normalization eliminates update anomalies, it scatters related data across multiple tables, requiring frequent SQL \`JOIN\` operations. B-Tree indexing mitigates this join overhead.

---

### 2. B+ Tree Clustered vs Non-Clustered Indexes

| Parameter | Clustered Index (Primary Key) | Non-Clustered Index (Secondary Key) |
| :--- | :--- | :--- |
| **Physical Data Order** | Dictates physical row order on disk | Separate index structure with pointers to heap |
| **Count Per Table** | Exactly 1 per table | Multiple per table (typically 3 to 5) |
| **Lookup Speed** | Direct row access $\\mathcal{O}(\\log_B N)$ | Two-step lookup (index seek + bookmark lookup) |
| **Write Impact** | Page splits on arbitrary key inserts | Index maintenance overhead on \`INSERT/UPDATE\` |

---

### 3. Join Optimization Architecture
- **Hash Join:** Builds an in-memory hash table on the smaller relation and probes rows from the larger relation.
- **Merge Join:** Performs $\\mathcal{O}(M + N)$ linear scan when both input tables are pre-sorted on join keys via clustered indexes.
- **Nested Loop Join:** Used for small datasets with index seeks on the inner loop.`,
    keyPoints: ["B+ Tree Indexing", "Clustered vs Non-Clustered Comparison", "Hash Join vs Merge Join vs Nested Loop", "Write Overhead Trade-offs", "Join Optimization"],
    diagramText: `B+ Tree Root ──► Intermediate Nodes ──► Leaf Nodes (Linked List for Range Scans)`,
    commonMistakes: ["Assuming creating 20 indexes on a table has zero cost (it degrades write throughput significantly!)"],
    markingScheme: [
      { criterion: "Normalized Join Latency Problem", marksAllocated: 2, description: "Explain query overhead in normalized schemas" },
      { criterion: "Clustered vs Non-Clustered Index Matrix", marksAllocated: 3.5, description: "Comparative analysis of physical storage" },
      { criterion: "Join Algorithms (Hash, Merge, Nested Loop)", marksAllocated: 3.5, description: "Detail query execution planner strategies" },
      { criterion: "Write Maintenance Trade-off Analysis", marksAllocated: 1, description: "Explain index maintenance cost" }
    ],
    quickRevision: "Clustered index = Physical disk order · Non-clustered = Pointer tree · Merge join = $\\mathcal{O}(M+N)$ sorted scan.",
    examinerTip: "Explain Merge Join vs Hash Join to demonstrate deep database systems knowledge."
  }
];

export default function PracticeAnswerView({
  initialTopic,
  initialSubject,
  initialDocumentId,
}: PracticeAnswerViewProps) {
  const [topic, setTopic] = useState(initialTopic || 'Database Normalization (1NF, 2NF, 3NF, BCNF)');
  const [subject, setSubject] = useState(initialSubject || 'Database Management Systems');
  const [selectedMarks, setSelectedMarks] = useState<3 | 7 | 10>(10);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | '3M' | '7M' | '10M'>('ALL');
  const [activeTab, setActiveTab] = useState<
    'simple' | 'exam' | 'keypoints' | 'diagram' | 'mistakes' | 'marking' | 'revision' | 'compare'
  >('exam');

  const [loading, setLoading] = useState(false);
  const [questionBankLoading, setQuestionBankLoading] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  // Question Bank State
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(DEFAULT_18_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionBankItem>(DEFAULT_18_QUESTIONS[12]); // Default to 10M master problem

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialSubject) setSubject(initialSubject);
  }, [initialTopic, initialSubject]);

  const handleGenerateSingleQuestion = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setEvaluation(null);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/practice', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic,
          subject,
          marks: selectedMarks,
          mode: 'single',
          documentId: initialDocumentId || undefined,
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.practice) {
          const p = data.practice;
          const newItem: QuestionBankItem = {
            id: `q_${Date.now()}`,
            marks: selectedMarks,
            category: `${selectedMarks}-Mark University Question`,
            question: p.question || `${selectedMarks}-Mark Exam Question on ${topic}`,
            simpleExplanation: `Intuitive explanation: ${topic} establishes foundational principles to ensure systematic consistency, efficiency, and predictable execution across all standard operations.`,
            idealAnswer: p.idealAnswer || "Complete structured model answer.",
            keyPoints: p.keyPoints || ["Core Invariance", "Deterministic State Progression", "Throughput Optimization", "Boundary Constraint"],
            diagramText: `[Input System State] ──► [Central Transformation Unit] ──► [Verified Output State]`,
            commonMistakes: p.commonMistakes || ["Omitting schematic diagram", "Skipping initial boundary condition setup", "Confusing synchronous vs asynchronous state"],
            markingScheme: p.examinerChecklist || [
              { criterion: "Technical Definition & Principle", marksAllocated: selectedMarks * 0.3, description: "Formal accurate definition" },
              { criterion: "Derivation / Working Steps", marksAllocated: selectedMarks * 0.5, description: "Step-by-step logic" },
              { criterion: "Applications & Boxed Summary", marksAllocated: selectedMarks * 0.2, description: "Industrial applications" }
            ],
            quickRevision: `Key summary: Master definition, draw labeled schematic with directional arrows, and highlight boxed final result.`,
            examinerTip: "Draw labeled block diagrams with directional arrows for full presentation marks."
          };
          setCurrentQuestion(newItem);
          setQuestionBank(prev => [newItem, ...prev.filter(q => q.id !== newItem.id)]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFullBank = async () => {
    if (!topic.trim()) return;
    setQuestionBankLoading(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/practice', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic,
          subject,
          mode: 'bank',
          documentId: initialDocumentId || undefined,
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.bank && Array.isArray(data.bank.questions) && data.bank.questions.length > 0) {
          setQuestionBank(data.bank.questions);
          setCurrentQuestion(data.bank.questions[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuestionBankLoading(false);
    }
  };

  const handleCompareAnswer = async () => {
    if (!studentAnswer.trim()) return;
    setEvaluating(true);

    try {
      const customKey = typeof window !== 'undefined' ? localStorage.getItem('scholarmate_gemini_key') || '' : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (customKey) headers['x-gemini-key'] = customKey;

      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: currentQuestion.question,
          studentAnswer,
          maxMarks: currentQuestion.marks,
          checklist: currentQuestion.markingScheme
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.evaluation) {
          setEvaluation(data.evaluation);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const tabsList = [
    { id: 'simple', label: 'Simple Explanation' },
    { id: 'exam', label: 'Exam Model Answer' },
    { id: 'keypoints', label: 'Key Points' },
    { id: 'diagram', label: 'Diagram' },
    { id: 'mistakes', label: 'Common Mistakes' },
    { id: 'marking', label: 'Marking Scheme' },
    { id: 'revision', label: 'Quick Revision' },
    { id: 'compare', label: 'Compare & Score' }
  ];

  const filteredQuestions = questionBank.filter(q => {
    if (activeCategoryFilter === '3M') return q.marks === 3 || q.marks <= 3;
    if (activeCategoryFilter === '7M') return q.marks === 7 || q.marks === 5;
    if (activeCategoryFilter === '10M') return q.marks === 10;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#17253a] via-[#111c2e] to-[#0b1220] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
            <Award className="h-3.5 w-3.5" />
            <span>3-Mark, 7-Mark & 10-Mark University Answer Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            AI Exam Answer Generator & Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Generate and drill 15 to 20 comprehensive exam questions structured into <strong>3-Mark Short Definitions</strong>, <strong>7-Mark Analytical Schematics</strong>, and <strong>10-Mark Mathematical Derivations</strong>.
          </p>
        </div>
      </div>

      {/* Input Control Box */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-5 shadow-lg space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Database Management Systems"
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0b1220] text-xs text-white placeholder:text-slate-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Database Normalization (1NF, 2NF, 3NF, BCNF)..."
              className="w-full px-3.5 py-2 rounded-xl border border-white/10 bg-[#0b1220] text-xs text-white placeholder:text-slate-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Marks Format</label>
            <div className="flex items-center gap-1 rounded-xl bg-[#0b1220] p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setSelectedMarks(3)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMarks === 3 ? 'bg-[#54d6c7] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                3 Marks
              </button>
              <button
                type="button"
                onClick={() => setSelectedMarks(7)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMarks === 7 ? 'bg-[#54d6c7] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Marks
              </button>
              <button
                type="button"
                onClick={() => setSelectedMarks(10)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMarks === 10 ? 'bg-[#54d6c7] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                10 Marks
              </button>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-end gap-2">
            <button
              onClick={handleGenerateSingleQuestion}
              disabled={loading || !topic.trim()}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-50 text-slate-950 py-2 text-xs font-extrabold shadow-md transition-all cursor-pointer"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>Generate</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ListOrdered className="h-4 w-4 text-[#54d6c7]" />
            <span>Question Bank contains <strong>{questionBank.length}</strong> exam questions</span>
          </div>

          <button
            onClick={handleGenerateFullBank}
            disabled={questionBankLoading || !topic.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30 transition-all cursor-pointer"
          >
            {questionBankLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Layers className="h-3 w-3" />}
            <span>{questionBankLoading ? "Synthesizing 18 Questions..." : "Generate Full 18-Question Bank"}</span>
          </button>
        </div>
      </div>

      {/* Question Bank Explorer Strip */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-[#54d6c7]" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
              Question Bank Navigator ({filteredQuestions.length} Questions)
            </h3>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-[#0b1220] p-1 border border-white/5 text-[11px] font-bold">
            <button
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeCategoryFilter === 'ALL' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({questionBank.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('3M')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeCategoryFilter === '3M' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              3-Mark ({questionBank.filter(q => q.marks <= 3).length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('7M')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeCategoryFilter === '7M' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Mark ({questionBank.filter(q => q.marks === 7 || q.marks === 5).length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter('10M')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeCategoryFilter === '10M' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              10-Mark ({questionBank.filter(q => q.marks === 10).length})
            </button>
          </div>
        </div>

        {/* Scrollable Questions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {filteredQuestions.map((q, idx) => {
            const isSelected = currentQuestion.id === q.id;
            return (
              <button
                key={q.id || idx}
                onClick={() => {
                  setCurrentQuestion(q);
                  setEvaluation(null);
                }}
                className={`text-left p-3 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'border-[#54d6c7] bg-[#54d6c7]/15 shadow-md shadow-[#54d6c7]/10'
                    : 'border-white/5 bg-[#0b1220] hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                    q.marks === 3 ? 'bg-amber-400/20 text-amber-300' :
                    q.marks === 7 ? 'bg-cyan-400/20 text-cyan-300' :
                    'bg-emerald-400/20 text-emerald-300'
                  }`}>
                    {q.marks} Marks
                  </span>
                  <span className="text-slate-400 truncate max-w-[120px]">{q.category}</span>
                </div>
                <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                  {q.question}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Answer Workspace */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 shadow-xl space-y-6">
        {/* Question Header */}
        <div className="space-y-1.5 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#54d6c7]">
              {subject} · {currentQuestion.category}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-bold text-white font-mono">
              {currentQuestion.marks} Marks
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 8 Learning Tabs Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-2 no-scrollbar">
          {tabsList.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#54d6c7] text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Simple Explanation */}
        {activeTab === 'simple' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-2">
            <h3 className="text-xs font-bold text-[#54d6c7] uppercase">Intuitive Plain-English Explanation</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentQuestion.simpleExplanation}
            </p>
          </div>
        )}

        {/* Tab 2: Exam Model Answer (3M / 7M / 10M) */}
        {activeTab === 'exam' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 border-b border-white/10 pb-2">
              <span className="font-bold text-[#54d6c7]">Official Model Answer ({currentQuestion.marks} Marks)</span>
              <span className="text-[11px] text-[#f6c85f]">{currentQuestion.examinerTip}</span>
            </div>
            <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 font-sans">
              {currentQuestion.idealAnswer}
            </div>
          </div>
        )}

        {/* Tab 3: Key Points */}
        {activeTab === 'keypoints' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#54d6c7] uppercase">Key Evaluator Checkpoints</h3>
            <ul className="space-y-2">
              {currentQuestion.keyPoints.map((kp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="h-4 w-4 text-[#54d6c7] shrink-0 mt-0.5" />
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 4: Diagram */}
        {activeTab === 'diagram' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#6ea8fe] uppercase">Architectural Schematic Diagram</h3>
            <pre className="p-4 rounded-xl bg-slate-950 border border-white/10 font-mono text-xs text-[#54d6c7] overflow-x-auto whitespace-pre leading-relaxed">
              {currentQuestion.diagramText}
            </pre>
          </div>
        )}

        {/* Tab 5: Common Mistakes */}
        {activeTab === 'mistakes' && (
          <div className="rounded-2xl border border-[#f47c7c]/20 bg-[#f47c7c]/5 p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#f47c7c] uppercase">Top Student Mistakes & Traps</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentQuestion.commonMistakes.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#f47c7c] font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 6: Marking Scheme */}
        {activeTab === 'marking' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#f6c85f] uppercase">Official Marking Scheme Rubric ({currentQuestion.marks} Marks Total)</h3>
            <div className="space-y-2">
              {currentQuestion.markingScheme.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-white">{item.criterion}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                  <span className="font-mono font-bold text-[#54d6c7] shrink-0 ml-3">+{item.marksAllocated}M</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Quick Revision */}
        {activeTab === 'revision' && (
          <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-2">
            <h3 className="text-xs font-bold text-[#70d6a8] uppercase">60-Second Flash Summary</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed">
              {currentQuestion.quickRevision}
            </p>
          </div>
        )}

        {/* Tab 8: Compare & Score */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Edit3 className="h-4 w-4 text-[#54d6c7]" />
                  <span>Submit Your Written Answer for Automated AI Evaluation</span>
                </label>
                <span className="text-[10px] text-slate-400">Max {currentQuestion.marks} Marks</span>
              </div>

              <textarea
                rows={6}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your answer here to receive mark-by-mark scoring and examiner feedback..."
                className="w-full p-4 rounded-2xl border border-white/10 bg-slate-950 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#54d6c7]"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleCompareAnswer}
                  disabled={evaluating || !studentAnswer.trim()}
                  className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] disabled:opacity-40 text-slate-950 font-black px-6 py-2.5 text-xs shadow-md transition-all cursor-pointer"
                >
                  {evaluating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>Compare & Score My Answer</span>
                </button>
              </div>
            </div>

            {/* Evaluation Results */}
            {evaluation && (
              <div className="rounded-2xl border border-[#54d6c7]/30 bg-[#54d6c7]/10 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-white">Scored: {evaluation.scoreObtained} / {evaluation.maxMarks} Marks ({evaluation.percentage}%)</span>
                  <span className="text-xs text-[#54d6c7] font-bold">Examiner Evaluation</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{evaluation.feedback}</p>
                {evaluation.checklistMatches && evaluation.checklistMatches.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-300">Criteria Breakdown:</span>
                    {evaluation.checklistMatches.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-black/20">
                        <span className="text-slate-300">{c.criterion}</span>
                        <span className={c.awarded ? "text-emerald-400 font-bold font-mono" : "text-rose-400 font-bold font-mono"}>
                          +{c.marksAwarded}M
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-[#f6c85f]">
                  💡 <strong>Examiner Tip:</strong> {evaluation.improvementTip}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

