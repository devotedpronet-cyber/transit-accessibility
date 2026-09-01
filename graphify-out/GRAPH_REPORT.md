# Graph Report - experiment1  (2026-09-01)

## Corpus Check
- 3 files · ~77,285 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 16 nodes · 19 edges · 3 communities
- Extraction: 53% EXTRACTED · 47% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- EMV Card Payment Regulation
- Casino Cage Payment Regulation
- Bank Card Payment Regulation

## God Nodes (most connected - your core abstractions)
1. `Card Payment Regulation Concept Image` - 4 edges
2. `Casino Cage Card, Card Terminal, and Gavel Image` - 4 edges
3. `Concept: Payments Industry Legal/Regulatory Oversight` - 3 edges
4. `Concept: Gambling/Payments Regulation and Legal Compliance` - 3 edges
5. `Gavel and Payment Terminal Image` - 3 edges
6. `Card Payment Terminal (POS Device)` - 3 edges
7. `POS Payment Terminal` - 2 edges
8. `Wooden Judge's Gavel` - 2 edges
9. `Blank EMV Chip Cards` - 2 edges
10. `Card Payment Terminal Device` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (3 total, 0 thin omitted)

### Community 0 - "EMV Card Payment Regulation"
Cohesion: 0.47
Nodes (6): Blank EMV Chip Cards, Concept: Payments Industry Legal/Regulatory Oversight, Wooden Judge's Gavel, Card Payment Regulation Concept Image, PIN Pad Device, POS Payment Terminal

### Community 1 - "Casino Cage Payment Regulation"
Cohesion: 0.60
Nodes (5): Stacks of Blank Cage Cards, Concept: Gambling/Payments Regulation and Legal Compliance, Casino Cage Card, Card Terminal, and Gavel Image, Wooden Judge's Gavel, Card Payment Terminal Device

### Community 2 - "Bank Card Payment Regulation"
Cohesion: 0.60
Nodes (5): Stack of Blank White Bank Cards, Concept: Legal/Regulatory Oversight of Payments, Wooden Judge's Gavel, Gavel and Payment Terminal Image, Card Payment Terminal (POS Device)

## Knowledge Gaps
- **2 isolated node(s):** `PIN Pad Device`, `Stacks of Blank Cage Cards`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 3 inferred relationships involving `Concept: Payments Industry Legal/Regulatory Oversight` (e.g. with `Blank EMV Chip Cards` and `Wooden Judge's Gavel`) actually correct?**
  _`Concept: Payments Industry Legal/Regulatory Oversight` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Concept: Gambling/Payments Regulation and Legal Compliance` (e.g. with `Casino Cage Card, Card Terminal, and Gavel Image` and `Wooden Judge's Gavel`) actually correct?**
  _`Concept: Gambling/Payments Regulation and Legal Compliance` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PIN Pad Device`, `Stacks of Blank Cage Cards` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._