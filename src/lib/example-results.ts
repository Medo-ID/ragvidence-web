// Published comparison results from public/sample-report.json.
export const exampleResults = [
  {
    "name": "bm25",
    "sufficient": 3,
    "total": 4,
    "meanContext": 161
  },
  {
    "name": "parent-child",
    "sufficient": 4,
    "total": 4,
    "meanContext": 741
  },
  {
    "name": "compress",
    "sufficient": 3,
    "total": 4,
    "meanContext": 200
  }
] as const;
