# RAGvidence technique comparison

Input: docs

Status: complete · Policy: fixed_k · Phase: dev

Baseline: bm25

- Keeping the baseline is valid. Choose using these cases and your requirements.
- Equal k does not imply equal context volume; resources are reported separately.
- Intervals pair questions or families. Repeated timings are not extra samples.
- These observations do not prove what caused a particular failure.

## bm25

Status: complete

Evidence scope: exact_returned_spans

- Reviewed evidence is scored against the union of exact original-text spans.
dev/all: 3 / 4 answerable sufficient · Coverage: 0.875 · MRR: 1.0 · Precision: 1.0
heldout/all: 0 / 0 answerable sufficient · Coverage: N/A · MRR: N/A · Precision: N/A

Mean known query ms: 0.9464632503295434 (0 missing)
Mean context: 161.25 characters
Estimated supplied-usage cost: N/A N/A

### How long should I hold the reset button, and what power is required?

Rank 1 · manual.md · Source text · Original characters 23–116

<pre>## Reset pairing

Hold the reset button for eight seconds to clear pairing. The status light </pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 1.0066920003737323,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.2885582447052,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long should I hold the reset button, and what power is required?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.05174799662199803,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.2885582447052,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 160,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### How long is the warranty and what damage is excluded?

Rank 1 · manual.md · Source text · Original characters 227–326

<pre>## Warranty

The warranty lasts two years. Keep your receipt. Accidental water damage is excluded. </pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.1346060016658157,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.4753642082214355,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Warranty\n\nThe warranty lasts two years. Keep your receipt. Accidental water damage is excluded. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long is the warranty and what damage is excluded?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.030398001399589702,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.4753642082214355,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Warranty\n\nThe warranty lasts two years. Keep your receipt. Accidental water damage is excluded. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 161,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### How often should I charge an unused device?

Rank 1 · manual.md · Source text · Original characters 379–477

<pre>## Battery care

Store the device in a cool, dry place. Charge it every three months when unused. </pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.06290899909799919,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.5058517456054688,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Battery care\n\nStore the device in a cool, dry place. Charge it every three months when unused. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How often should I charge an unused device?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.023254000552697107,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.5058517456054688,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Battery care\n\nStore the device in a cool, dry place. Charge it every three months when unused. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 164,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### Where is tracked delivery available?

Rank 1 · manual.md · Source text · Original characters 564–662

<pre>## Delivery

Standard delivery takes five working days. Tracked delivery is available in Morocco. </pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.05601600059890188,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.3280820846557617,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\nStandard delivery takes five working days. Tracked delivery is available in Morocco. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;Where is tracked delivery available?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.032312000257661566,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.3280820846557617,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\nStandard delivery takes five working days. Tracked delivery is available in Morocco. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 160,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


## parent-child

Status: complete

Evidence scope: exact_returned_spans

- Reviewed evidence is scored against the union of exact original-text spans.
- Child retrieval returns full parent source units. Evidence metrics describe parent context; they do not establish that the matching child contains every fact. Child candidate limits can return fewer than k unique parents.
dev/all: 4 / 4 answerable sufficient · Coverage: 1.0 · MRR: 1.0 · Precision: 1.0
heldout/all: 0 / 0 answerable sufficient · Coverage: N/A · MRR: N/A · Precision: N/A

Mean known query ms: 0.19640549999166979 (0 missing)
Mean context: 741.0 characters
Estimated supplied-usage cost: N/A N/A

### How long should I hold the reset button, and what power is required?

Rank 1 · manual.md · Source text · Original characters 0–713

<pre># Orion device manual

## Reset pairing

Hold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.

## Warranty

The warranty lasts two years. Keep your receipt. Accidental water damage is excluded. Contact the support team before returning a device.

## Battery care

Store the device in a cool, dry place. Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.

## Delivery

Standard delivery takes five working days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel arrives.
</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;children&quot;,
    &quot;elapsed_ms&quot;: 0.10649300020304509,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;child-0&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.315727949142456,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-2&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.4516243934631348,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;eep USB-C power connected throughout the reset.\n\n## Warranty\n\nThe warranty lasts two years. Keep &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-7&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.6855702996253967,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ing days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-3&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.6573668718338013,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ars. Keep your receipt. Accidental water damage is excluded. Contact the support team before &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-1&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.16223493218421936,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-5&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.10600543022155762,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-4&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.10283465683460236,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;am before returning a device.\n\n## Battery care\n\nStore the device in a cool, dry place. Charge it &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-6&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;teries at an approved collection point.\n\n## Delivery\n\nStandard delivery takes five working days. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-8&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;he parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long should I hold the reset button, and what power is required?&quot;,
      &quot;limit&quot;: 20,
      &quot;locations&quot;: [
        {
          &quot;child_id&quot;: &quot;child-0&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 0,
          &quot;end&quot;: 99
        },
        {
          &quot;child_id&quot;: &quot;child-2&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 178,
          &quot;end&quot;: 275
        },
        {
          &quot;child_id&quot;: &quot;child-7&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 610,
          &quot;end&quot;: 704
        },
        {
          &quot;child_id&quot;: &quot;child-3&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 265,
          &quot;end&quot;: 358
        },
        {
          &quot;child_id&quot;: &quot;child-1&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 89,
          &quot;end&quot;: 188
        },
        {
          &quot;child_id&quot;: &quot;child-5&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 435,
          &quot;end&quot;: 533
        },
        {
          &quot;child_id&quot;: &quot;child-4&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 348,
          &quot;end&quot;: 445
        },
        {
          &quot;child_id&quot;: &quot;child-6&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 523,
          &quot;end&quot;: 620
        },
        {
          &quot;child_id&quot;: &quot;child-8&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 694,
          &quot;end&quot;: 713
        }
      ]
    }
  },
  {
    &quot;name&quot;: &quot;parent_expansion&quot;,
    &quot;elapsed_ms&quot;: 0.014877998182782903,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.315727949142456,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-0&quot;,
          &quot;matched_child_start&quot;: 0,
          &quot;matched_child_end&quot;: 99,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long should I hold the reset button, and what power is required?&quot;
    }
  },
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.2124839993484784,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.315727949142456,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-0&quot;,
          &quot;matched_child_start&quot;: 0,
          &quot;matched_child_end&quot;: 99,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long should I hold the reset button, and what power is required?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.0383830010832753,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.315727949142456,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-0&quot;,
          &quot;matched_child_start&quot;: 0,
          &quot;matched_child_end&quot;: 99,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 741,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### How long is the warranty and what damage is excluded?

Rank 1 · manual.md · Source text · Original characters 0–713

<pre># Orion device manual

## Reset pairing

Hold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.

## Warranty

The warranty lasts two years. Keep your receipt. Accidental water damage is excluded. Contact the support team before returning a device.

## Battery care

Store the device in a cool, dry place. Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.

## Delivery

Standard delivery takes five working days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel arrives.
</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;children&quot;,
    &quot;elapsed_ms&quot;: 0.09070300075109117,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;child-3&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.69175124168396,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ars. Keep your receipt. Accidental water damage is excluded. Contact the support team before &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-2&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.2320934534072876,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;eep USB-C power connected throughout the reset.\n\n## Warranty\n\nThe warranty lasts two years. Keep &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-7&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 1.2126452922821045,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ing days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-1&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.16223493218421936,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-0&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.10937795042991638,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-5&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.10600543022155762,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-4&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.10283465683460236,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;am before returning a device.\n\n## Battery care\n\nStore the device in a cool, dry place. Charge it &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-6&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;teries at an approved collection point.\n\n## Delivery\n\nStandard delivery takes five working days. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-8&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;he parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long is the warranty and what damage is excluded?&quot;,
      &quot;limit&quot;: 20,
      &quot;locations&quot;: [
        {
          &quot;child_id&quot;: &quot;child-3&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 265,
          &quot;end&quot;: 358
        },
        {
          &quot;child_id&quot;: &quot;child-2&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 178,
          &quot;end&quot;: 275
        },
        {
          &quot;child_id&quot;: &quot;child-7&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 610,
          &quot;end&quot;: 704
        },
        {
          &quot;child_id&quot;: &quot;child-1&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 89,
          &quot;end&quot;: 188
        },
        {
          &quot;child_id&quot;: &quot;child-0&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 0,
          &quot;end&quot;: 99
        },
        {
          &quot;child_id&quot;: &quot;child-5&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 435,
          &quot;end&quot;: 533
        },
        {
          &quot;child_id&quot;: &quot;child-4&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 348,
          &quot;end&quot;: 445
        },
        {
          &quot;child_id&quot;: &quot;child-6&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 523,
          &quot;end&quot;: 620
        },
        {
          &quot;child_id&quot;: &quot;child-8&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 694,
          &quot;end&quot;: 713
        }
      ]
    }
  },
  {
    &quot;name&quot;: &quot;parent_expansion&quot;,
    &quot;elapsed_ms&quot;: 0.006140999175840989,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.69175124168396,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-3&quot;,
          &quot;matched_child_start&quot;: 265,
          &quot;matched_child_end&quot;: 358,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long is the warranty and what damage is excluded?&quot;
    }
  },
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.10927699986496009,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.69175124168396,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-3&quot;,
          &quot;matched_child_start&quot;: 265,
          &quot;matched_child_end&quot;: 358,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long is the warranty and what damage is excluded?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.02230300015071407,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.69175124168396,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-3&quot;,
          &quot;matched_child_start&quot;: 265,
          &quot;matched_child_end&quot;: 358,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 741,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### How often should I charge an unused device?

Rank 1 · manual.md · Source text · Original characters 0–713

<pre># Orion device manual

## Reset pairing

Hold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.

## Warranty

The warranty lasts two years. Keep your receipt. Accidental water damage is excluded. Contact the support team before returning a device.

## Battery care

Store the device in a cool, dry place. Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.

## Delivery

Standard delivery takes five working days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel arrives.
</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;children&quot;,
    &quot;elapsed_ms&quot;: 0.07850899783079512,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;child-4&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.2256488800048828,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;am before returning a device.\n\n## Battery care\n\nStore the device in a cool, dry place. Charge it &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-5&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.209876298904419,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-6&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.7703071236610413,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;teries at an approved collection point.\n\n## Delivery\n\nStandard delivery takes five working days. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-0&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.5270749926567078,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-1&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-2&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;eep USB-C power connected throughout the reset.\n\n## Warranty\n\nThe warranty lasts two years. Keep &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-3&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ars. Keep your receipt. Accidental water damage is excluded. Contact the support team before &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-7&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ing days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-8&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;he parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How often should I charge an unused device?&quot;,
      &quot;limit&quot;: 20,
      &quot;locations&quot;: [
        {
          &quot;child_id&quot;: &quot;child-4&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 348,
          &quot;end&quot;: 445
        },
        {
          &quot;child_id&quot;: &quot;child-5&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 435,
          &quot;end&quot;: 533
        },
        {
          &quot;child_id&quot;: &quot;child-6&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 523,
          &quot;end&quot;: 620
        },
        {
          &quot;child_id&quot;: &quot;child-0&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 0,
          &quot;end&quot;: 99
        },
        {
          &quot;child_id&quot;: &quot;child-1&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 89,
          &quot;end&quot;: 188
        },
        {
          &quot;child_id&quot;: &quot;child-2&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 178,
          &quot;end&quot;: 275
        },
        {
          &quot;child_id&quot;: &quot;child-3&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 265,
          &quot;end&quot;: 358
        },
        {
          &quot;child_id&quot;: &quot;child-7&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 610,
          &quot;end&quot;: 704
        },
        {
          &quot;child_id&quot;: &quot;child-8&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 694,
          &quot;end&quot;: 713
        }
      ]
    }
  },
  {
    &quot;name&quot;: &quot;parent_expansion&quot;,
    &quot;elapsed_ms&quot;: 0.004458997864276171,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.2256488800048828,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-4&quot;,
          &quot;matched_child_start&quot;: 348,
          &quot;matched_child_end&quot;: 445,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How often should I charge an unused device?&quot;
    }
  },
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.09374799992656335,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.2256488800048828,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-4&quot;,
          &quot;matched_child_start&quot;: 348,
          &quot;matched_child_end&quot;: 445,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How often should I charge an unused device?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.020509000023594126,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.2256488800048828,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-4&quot;,
          &quot;matched_child_start&quot;: 348,
          &quot;matched_child_end&quot;: 445,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 741,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### Where is tracked delivery available?

Rank 1 · manual.md · Source text · Original characters 0–713

<pre># Orion device manual

## Reset pairing

Hold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.

## Warranty

The warranty lasts two years. Keep your receipt. Accidental water damage is excluded. Contact the support team before returning a device.

## Battery care

Store the device in a cool, dry place. Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.

## Delivery

Standard delivery takes five working days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel arrives.
</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;children&quot;,
    &quot;elapsed_ms&quot;: 0.09911899906001054,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;child-7&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.4967360496520996,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ing days. Tracked delivery is available in Morocco. Keep the tracking number until the parcel &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-6&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 0.8006759881973267,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;teries at an approved collection point.\n\n## Delivery\n\nStandard delivery takes five working days. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-3&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.5443947315216064,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;ars. Keep your receipt. Accidental water damage is excluded. Contact the support team before &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-0&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-1&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-2&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;eep USB-C power connected throughout the reset.\n\n## Warranty\n\nThe warranty lasts two years. Keep &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-4&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;am before returning a device.\n\n## Battery care\n\nStore the device in a cool, dry place. Charge it &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-5&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Charge it every three months when unused. Use only the supplied USB-C cable. Recycle batteries at &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;child-8&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;he parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;Where is tracked delivery available?&quot;,
      &quot;limit&quot;: 20,
      &quot;locations&quot;: [
        {
          &quot;child_id&quot;: &quot;child-7&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 610,
          &quot;end&quot;: 704
        },
        {
          &quot;child_id&quot;: &quot;child-6&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 523,
          &quot;end&quot;: 620
        },
        {
          &quot;child_id&quot;: &quot;child-3&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 265,
          &quot;end&quot;: 358
        },
        {
          &quot;child_id&quot;: &quot;child-0&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 0,
          &quot;end&quot;: 99
        },
        {
          &quot;child_id&quot;: &quot;child-1&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 89,
          &quot;end&quot;: 188
        },
        {
          &quot;child_id&quot;: &quot;child-2&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 178,
          &quot;end&quot;: 275
        },
        {
          &quot;child_id&quot;: &quot;child-4&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 348,
          &quot;end&quot;: 445
        },
        {
          &quot;child_id&quot;: &quot;child-5&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 435,
          &quot;end&quot;: 533
        },
        {
          &quot;child_id&quot;: &quot;child-8&quot;,
          &quot;parent_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;start&quot;: 694,
          &quot;end&quot;: 713
        }
      ]
    }
  },
  {
    &quot;name&quot;: &quot;parent_expansion&quot;,
    &quot;elapsed_ms&quot;: 0.004319001163821667,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.4967360496520996,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-7&quot;,
          &quot;matched_child_start&quot;: 610,
          &quot;matched_child_end&quot;: 704,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;Where is tracked delivery available?&quot;
    }
  },
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.11735299995052628,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.4967360496520996,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-7&quot;,
          &quot;matched_child_start&quot;: 610,
          &quot;matched_child_end&quot;: 704,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;Where is tracked delivery available?&quot;,
      &quot;limit&quot;: 1,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.02047899761237204,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.4967360496520996,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected throughout the reset.\n\n## Warranty\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;matched_child_id&quot;: &quot;child-7&quot;,
          &quot;matched_child_start&quot;: 610,
          &quot;matched_child_end&quot;: 704,
          &quot;returned_context&quot;: &quot;full_parent&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 741,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


## compress

Status: complete

Evidence scope: exact_returned_spans

- Reviewed evidence is scored against the union of exact original-text spans.
- Extractive compression can remove required facts or qualifications; evidence is rescored from only the returned spans.
dev/all: 3 / 4 answerable sufficient · Coverage: 0.875 · MRR: 1.0 · Precision: 1.0
heldout/all: 0 / 0 answerable sufficient · Coverage: N/A · MRR: N/A · Precision: N/A

Mean known query ms: 0.6701004995193216 (0 missing)
Mean context: 199.5 characters
Estimated supplied-usage cost: N/A N/A

### How long should I hold the reset button, and what power is required?

Rank 1 · manual.md · Source text · Original characters 23–41

<pre>## Reset pairing

</pre>

Rank 1 · manual.md · Source text · Original characters 41–98

<pre>Hold the reset button for eight seconds to clear pairing.</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.14205899788066745,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.2885582447052,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 0.9809407591819763,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;connected throughout the reset.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.8127185106277466,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;tus light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.6282253265380859,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Warranty\n\nThe warranty lasts two years. Keep your receipt. Accidental water damage is excluded. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.5550644397735596,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\nStandard delivery takes five working days. Tracked delivery is available in Morocco. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.15764456987380981,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Morocco. Keep the tracking number until the parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.11353020370006561,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;excluded. Contact the support team before returning a device.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.08988720178604126,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;n unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.08405247330665588,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Battery care\n\nStore the device in a cool, dry place. Charge it every three months when unused. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-c341c5c87a667038141c&quot;,
        &quot;rank&quot;: 10,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long should I hold the reset button, and what power is required?&quot;,
      &quot;limit&quot;: 20,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;compression&quot;,
    &quot;elapsed_ms&quot;: 0.348312001733575,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.2885582447052,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 18
          },
          {
            &quot;start&quot;: 18,
            &quot;end&quot;: 75
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 0.9809407591819763,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;connected throughout the reset.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 2
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 31
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.8127185106277466,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Disconnect the companion app before starting.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 3
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 24,
            &quot;end&quot;: 70
          },
          {
            &quot;start&quot;: 70,
            &quot;end&quot;: 98
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.6282253265380859,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;The warranty lasts two years.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 4
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 13,
            &quot;end&quot;: 42
          },
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.5550644397735596,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Tracked delivery is available in Morocco.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 5
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.15764456987380981,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Keep the tracking number until the parcel arrives.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 6
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 60
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.11353020370006561,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Contact the support team before returning a device.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 7
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 61
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.08988720178604126,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Use only the supplied USB-C cable.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 8
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 44
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.08405247330665588,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Store the device in a cool, dry place.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 9
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;mode&quot;: &quot;sentences&quot;,
      &quot;max_spans_per_source&quot;: 2,
      &quot;input_ids&quot;: [
        &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;passage-1518103967d65de40d95&quot;,
        &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;passage-c341c5c87a667038141c&quot;
      ],
      &quot;order&quot;: &quot;candidate rank, then original character offset&quot;,
      &quot;budget_policy&quot;: &quot;final context selection keeps whole compressed source groups&quot;,
      &quot;failure_policy&quot;: &quot;fail&quot;,
      &quot;state&quot;: &quot;complete&quot;,
      &quot;selections&quot;: {
        &quot;passage-5bdc4916bcb2462d0250&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 18
          },
          {
            &quot;start&quot;: 18,
            &quot;end&quot;: 75
          }
        ],
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 31
          }
        ],
        &quot;passage-fc31aa14f18cf8b2a89a&quot;: [
          {
            &quot;start&quot;: 24,
            &quot;end&quot;: 70
          },
          {
            &quot;start&quot;: 70,
            &quot;end&quot;: 98
          }
        ],
        &quot;passage-4be5e239b1ab47982a8e&quot;: [
          {
            &quot;start&quot;: 13,
            &quot;end&quot;: 42
          },
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ],
        &quot;passage-1518103967d65de40d95&quot;: [
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ],
        &quot;passage-3657f06cb41040af19b1&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 60
          }
        ],
        &quot;passage-6c50fe60990136f40ac3&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 61
          }
        ],
        &quot;passage-a73c9da59294e4af482b&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 44
          }
        ],
        &quot;passage-32a3368b3b75076e202c&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          }
        ],
        &quot;passage-c341c5c87a667038141c&quot;: []
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.030297000193968415,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 2.2885582447052,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 18
          },
          {
            &quot;start&quot;: 18,
            &quot;end&quot;: 75
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 211,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### How long is the warranty and what damage is excluded?

Rank 1 · manual.md · Source text · Original characters 240–269

<pre>The warranty lasts two years.</pre>

Rank 1 · manual.md · Source text · Original characters 288–325

<pre> Accidental water damage is excluded.</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.09299700104747899,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.4753642082214355,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Warranty\n\nThe warranty lasts two years. Keep your receipt. Accidental water damage is excluded. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.1101288795471191,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\nStandard delivery takes five working days. Tracked delivery is available in Morocco. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.7659269571304321,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;excluded. Contact the support team before returning a device.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.15764456987380981,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Morocco. Keep the tracking number until the parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.14540082216262817,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;connected throughout the reset.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.13330140709877014,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.09311925619840622,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;tus light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.08988720178604126,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;n unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.08405247330665588,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Battery care\n\nStore the device in a cool, dry place. Charge it every three months when unused. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-c341c5c87a667038141c&quot;,
        &quot;rank&quot;: 10,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How long is the warranty and what damage is excluded?&quot;,
      &quot;limit&quot;: 20,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;compression&quot;,
    &quot;elapsed_ms&quot;: 0.2553249978518579,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.4753642082214355,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;The warranty lasts two years.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 13,
            &quot;end&quot;: 42
          },
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.1101288795471191,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Tracked delivery is available in Morocco.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 2
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.7659269571304321,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;excluded.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 3
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 9
          },
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 61
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.15764456987380981,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Keep the tracking number until the parcel arrives.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 4
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 60
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.14540082216262817,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;connected throughout the reset.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 5
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 31
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.13330140709877014,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Hold the reset button for eight seconds to clear pairing.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 6
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 18,
            &quot;end&quot;: 75
          },
          {
            &quot;start&quot;: 75,
            &quot;end&quot;: 93
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.09311925619840622,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Disconnect the companion app before starting.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 7
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 24,
            &quot;end&quot;: 70
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.08988720178604126,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Use only the supplied USB-C cable.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 8
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 44
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.08405247330665588,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Store the device in a cool, dry place.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 9
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;mode&quot;: &quot;sentences&quot;,
      &quot;max_spans_per_source&quot;: 2,
      &quot;input_ids&quot;: [
        &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;passage-1518103967d65de40d95&quot;,
        &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;passage-c341c5c87a667038141c&quot;
      ],
      &quot;order&quot;: &quot;candidate rank, then original character offset&quot;,
      &quot;budget_policy&quot;: &quot;final context selection keeps whole compressed source groups&quot;,
      &quot;failure_policy&quot;: &quot;fail&quot;,
      &quot;state&quot;: &quot;complete&quot;,
      &quot;selections&quot;: {
        &quot;passage-4be5e239b1ab47982a8e&quot;: [
          {
            &quot;start&quot;: 13,
            &quot;end&quot;: 42
          },
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ],
        &quot;passage-1518103967d65de40d95&quot;: [
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ],
        &quot;passage-6c50fe60990136f40ac3&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 9
          },
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 61
          }
        ],
        &quot;passage-3657f06cb41040af19b1&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 60
          }
        ],
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 31
          }
        ],
        &quot;passage-5bdc4916bcb2462d0250&quot;: [
          {
            &quot;start&quot;: 18,
            &quot;end&quot;: 75
          },
          {
            &quot;start&quot;: 75,
            &quot;end&quot;: 93
          }
        ],
        &quot;passage-fc31aa14f18cf8b2a89a&quot;: [
          {
            &quot;start&quot;: 24,
            &quot;end&quot;: 70
          }
        ],
        &quot;passage-a73c9da59294e4af482b&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 44
          }
        ],
        &quot;passage-32a3368b3b75076e202c&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          }
        ],
        &quot;passage-c341c5c87a667038141c&quot;: []
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.037431000237120315,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.4753642082214355,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;The warranty lasts two years.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 13,
            &quot;end&quot;: 42
          },
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 192,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### How often should I charge an unused device?

Rank 1 · manual.md · Source text · Original characters 396–434

<pre>Store the device in a cool, dry place.</pre>

Rank 1 · manual.md · Source text · Original characters 434–476

<pre> Charge it every three months when unused.</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.08480199903715402,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.5058517456054688,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Battery care\n\nStore the device in a cool, dry place. Charge it every three months when unused. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.2111560106277466,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;n unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-c341c5c87a667038141c&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.6842033267021179,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.5042375326156616,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;excluded. Contact the support team before returning a device.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;tus light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;connected throughout the reset.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Warranty\n\nThe warranty lasts two years. Keep your receipt. Accidental water damage is excluded. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\nStandard delivery takes five working days. Tracked delivery is available in Morocco. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;rank&quot;: 10,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Morocco. Keep the tracking number until the parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;How often should I charge an unused device?&quot;,
      &quot;limit&quot;: 20,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;compression&quot;,
    &quot;elapsed_ms&quot;: 0.17413000023225322,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.5058517456054688,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Store the device in a cool, dry place.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          },
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 1.2111560106277466,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;n unused.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 2
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 9
          },
          {
            &quot;start&quot;: 44,
            &quot;end&quot;: 95
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-c341c5c87a667038141c&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.6842033267021179,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 3
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 23
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.5042375326156616,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Contact the support team before returning a device.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 4
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 61
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;mode&quot;: &quot;sentences&quot;,
      &quot;max_spans_per_source&quot;: 2,
      &quot;input_ids&quot;: [
        &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;passage-c341c5c87a667038141c&quot;,
        &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;passage-1518103967d65de40d95&quot;,
        &quot;passage-3657f06cb41040af19b1&quot;
      ],
      &quot;order&quot;: &quot;candidate rank, then original character offset&quot;,
      &quot;budget_policy&quot;: &quot;final context selection keeps whole compressed source groups&quot;,
      &quot;failure_policy&quot;: &quot;fail&quot;,
      &quot;state&quot;: &quot;complete&quot;,
      &quot;selections&quot;: {
        &quot;passage-32a3368b3b75076e202c&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          },
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ],
        &quot;passage-a73c9da59294e4af482b&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 9
          },
          {
            &quot;start&quot;: 44,
            &quot;end&quot;: 95
          }
        ],
        &quot;passage-c341c5c87a667038141c&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 23
          }
        ],
        &quot;passage-6c50fe60990136f40ac3&quot;: [
          {
            &quot;start&quot;: 9,
            &quot;end&quot;: 61
          }
        ],
        &quot;passage-5bdc4916bcb2462d0250&quot;: [],
        &quot;passage-fc31aa14f18cf8b2a89a&quot;: [],
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;: [],
        &quot;passage-4be5e239b1ab47982a8e&quot;: [],
        &quot;passage-1518103967d65de40d95&quot;: [],
        &quot;passage-3657f06cb41040af19b1&quot;: []
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.022352000087266788,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 1.5058517456054688,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;Store the device in a cool, dry place.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 17,
            &quot;end&quot;: 55
          },
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 214,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


### Where is tracked delivery available?

Rank 1 · manual.md · Source text · Original characters 564–577

<pre>## Delivery

</pre>

Rank 1 · manual.md · Source text · Original characters 619–661

<pre> Tracked delivery is available in Morocco.</pre>

<details><summary>Observed stages and selection evidence</summary>
<pre>[
  {
    &quot;name&quot;: &quot;retrieval&quot;,
    &quot;elapsed_ms&quot;: 0.07471200297004543,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.3280820846557617,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\nStandard delivery takes five working days. Tracked delivery is available in Morocco. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 0.5351060628890991,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Warranty\n\nThe warranty lasts two years. Keep your receipt. Accidental water damage is excluded. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-c341c5c87a667038141c&quot;,
        &quot;rank&quot;: 3,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;# Orion device manual\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;rank&quot;: 4,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Reset pairing\n\nHold the reset button for eight seconds to clear pairing. The status light &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;rank&quot;: 5,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;tus light flashes twice. Disconnect the companion app before starting. Keep USB-C power connected &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;rank&quot;: 6,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;connected throughout the reset.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;rank&quot;: 7,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;excluded. Contact the support team before returning a device.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;rank&quot;: 8,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Battery care\n\nStore the device in a cool, dry place. Charge it every three months when unused. &quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;rank&quot;: 9,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;n unused. Use only the supplied USB-C cable. Recycle batteries at an approved collection point.\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-3657f06cb41040af19b1&quot;,
        &quot;rank&quot;: 10,
        &quot;score&quot;: 0.0,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Morocco. Keep the tracking number until the parcel arrives.\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;
        }
      }
    ],
    &quot;details&quot;: {
      &quot;query&quot;: &quot;Where is tracked delivery available?&quot;,
      &quot;limit&quot;: 20,
      &quot;index_cache&quot;: &quot;not_applicable&quot;,
      &quot;model_cache&quot;: &quot;unknown&quot;,
      &quot;runtime_versions&quot;: {
        &quot;bm25s&quot;: &quot;0.2.14&quot;,
        &quot;numpy&quot;: &quot;2.5.4&quot;,
        &quot;fastembed&quot;: &quot;0.9.0&quot;,
        &quot;onnxruntime&quot;: &quot;1.31.0&quot;,
        &quot;tokenizers&quot;: &quot;0.23.3&quot;
      }
    }
  },
  {
    &quot;name&quot;: &quot;compression&quot;,
    &quot;elapsed_ms&quot;: 0.18633400031831115,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.3280820846557617,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 13
          },
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ]
      },
      {
        &quot;source_unit_id&quot;: &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;rank&quot;: 2,
        &quot;score&quot;: 0.5351060628890991,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot; Accidental water damage is excluded.&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 2
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;mode&quot;: &quot;sentences&quot;,
      &quot;max_spans_per_source&quot;: 2,
      &quot;input_ids&quot;: [
        &quot;passage-1518103967d65de40d95&quot;,
        &quot;passage-4be5e239b1ab47982a8e&quot;,
        &quot;passage-c341c5c87a667038141c&quot;,
        &quot;passage-5bdc4916bcb2462d0250&quot;,
        &quot;passage-fc31aa14f18cf8b2a89a&quot;,
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;,
        &quot;passage-6c50fe60990136f40ac3&quot;,
        &quot;passage-32a3368b3b75076e202c&quot;,
        &quot;passage-a73c9da59294e4af482b&quot;,
        &quot;passage-3657f06cb41040af19b1&quot;
      ],
      &quot;order&quot;: &quot;candidate rank, then original character offset&quot;,
      &quot;budget_policy&quot;: &quot;final context selection keeps whole compressed source groups&quot;,
      &quot;failure_policy&quot;: &quot;fail&quot;,
      &quot;state&quot;: &quot;complete&quot;,
      &quot;selections&quot;: {
        &quot;passage-1518103967d65de40d95&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 13
          },
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ],
        &quot;passage-4be5e239b1ab47982a8e&quot;: [
          {
            &quot;start&quot;: 61,
            &quot;end&quot;: 98
          }
        ],
        &quot;passage-c341c5c87a667038141c&quot;: [],
        &quot;passage-5bdc4916bcb2462d0250&quot;: [],
        &quot;passage-fc31aa14f18cf8b2a89a&quot;: [],
        &quot;passage-a9bffaf7e82ff6d02b1e&quot;: [],
        &quot;passage-6c50fe60990136f40ac3&quot;: [],
        &quot;passage-32a3368b3b75076e202c&quot;: [],
        &quot;passage-a73c9da59294e4af482b&quot;: [],
        &quot;passage-3657f06cb41040af19b1&quot;: []
      }
    }
  },
  {
    &quot;name&quot;: &quot;context_selection&quot;,
    &quot;elapsed_ms&quot;: 0.026129997422685847,
    &quot;hits&quot;: [
      {
        &quot;source_unit_id&quot;: &quot;passage-1518103967d65de40d95&quot;,
        &quot;rank&quot;: 1,
        &quot;score&quot;: 3.3280820846557617,
        &quot;evidence_ids&quot;: [],
        &quot;preview&quot;: &quot;## Delivery\n\n&quot;,
        &quot;metadata&quot;: {
          &quot;document_id&quot;: &quot;doc-aaa8b734a101d7f34afb&quot;,
          &quot;compression_input_rank&quot;: 1
        },
        &quot;context_spans&quot;: [
          {
            &quot;start&quot;: 0,
            &quot;end&quot;: 13
          },
          {
            &quot;start&quot;: 55,
            &quot;end&quot;: 97
          }
        ]
      }
    ],
    &quot;details&quot;: {
      &quot;adapter&quot;: &quot;unicode-codepoints-v1&quot;,
      &quot;unit&quot;: &quot;characters&quot;,
      &quot;exact&quot;: true,
      &quot;count&quot;: 181,
      &quot;budget&quot;: null,
      &quot;scope&quot;: &quot;rendered_retrieval_context&quot;,
      &quot;skipped&quot;: [],
      &quot;policy&quot;: &quot;ranked-whole-passages-v1&quot;
    }
  }
]</pre>
</details>


## parent-child versus bm25

Observed gains/losses under the declared policy; no automatic winner

<pre>{
  &quot;splits&quot;: {
    &quot;dev&quot;: {
      &quot;all&quot;: {
        &quot;answerable_questions&quot;: 4,
        &quot;changes&quot;: {
          &quot;improved&quot;: 1,
          &quot;regressed&quot;: 0,
          &quot;stable_pass&quot;: 3,
          &quot;stable_fail&quot;: 0
        },
        &quot;intervals&quot;: {
          &quot;sufficiency_rate&quot;: {
            &quot;estimate&quot;: 0.25,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.75,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          },
          &quot;mean_evidence_coverage&quot;: {
            &quot;estimate&quot;: 0.125,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.375,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          },
          &quot;mean_reciprocal_rank&quot;: {
            &quot;estimate&quot;: 0.0,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.0,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          },
          &quot;mean_precision_at_k&quot;: {
            &quot;estimate&quot;: 0.0,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.0,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          }
        }
      }
    },
    &quot;heldout&quot;: {
      &quot;all&quot;: {
        &quot;answerable_questions&quot;: 0,
        &quot;changes&quot;: {
          &quot;improved&quot;: 0,
          &quot;regressed&quot;: 0,
          &quot;stable_pass&quot;: 0,
          &quot;stable_fail&quot;: 0
        },
        &quot;intervals&quot;: {
          &quot;sufficiency_rate&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          },
          &quot;mean_evidence_coverage&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          },
          &quot;mean_reciprocal_rank&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          },
          &quot;mean_precision_at_k&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          }
        }
      }
    }
  },
  &quot;questions&quot;: [
    {
      &quot;question_id&quot;: &quot;Q1&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;improved&quot;,
      &quot;gained&quot;: [
        &quot;POWER&quot;
      ],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 1.0,
        &quot;mean_evidence_coverage&quot;: 0.5,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    },
    {
      &quot;question_id&quot;: &quot;Q2&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_pass&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    },
    {
      &quot;question_id&quot;: &quot;Q3&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_pass&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    },
    {
      &quot;question_id&quot;: &quot;Q4&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_pass&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    }
  ]
}</pre>

## compress versus bm25

Observed gains/losses under the declared policy; no automatic winner

<pre>{
  &quot;splits&quot;: {
    &quot;dev&quot;: {
      &quot;all&quot;: {
        &quot;answerable_questions&quot;: 4,
        &quot;changes&quot;: {
          &quot;improved&quot;: 0,
          &quot;regressed&quot;: 0,
          &quot;stable_pass&quot;: 3,
          &quot;stable_fail&quot;: 1
        },
        &quot;intervals&quot;: {
          &quot;sufficiency_rate&quot;: {
            &quot;estimate&quot;: 0.0,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.0,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          },
          &quot;mean_evidence_coverage&quot;: {
            &quot;estimate&quot;: 0.0,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.0,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          },
          &quot;mean_reciprocal_rank&quot;: {
            &quot;estimate&quot;: 0.0,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.0,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          },
          &quot;mean_precision_at_k&quot;: {
            &quot;estimate&quot;: 0.0,
            &quot;question_count&quot;: 4,
            &quot;group_count&quot;: 4,
            &quot;lower&quot;: 0.0,
            &quot;upper&quot;: 0.0,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;Small samples and reused public heldout data limit inference&quot;
          }
        }
      }
    },
    &quot;heldout&quot;: {
      &quot;all&quot;: {
        &quot;answerable_questions&quot;: 0,
        &quot;changes&quot;: {
          &quot;improved&quot;: 0,
          &quot;regressed&quot;: 0,
          &quot;stable_pass&quot;: 0,
          &quot;stable_fail&quot;: 0
        },
        &quot;intervals&quot;: {
          &quot;sufficiency_rate&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          },
          &quot;mean_evidence_coverage&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          },
          &quot;mean_reciprocal_rank&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          },
          &quot;mean_precision_at_k&quot;: {
            &quot;estimate&quot;: null,
            &quot;question_count&quot;: 0,
            &quot;group_count&quot;: 0,
            &quot;lower&quot;: null,
            &quot;upper&quot;: null,
            &quot;seed&quot;: 42,
            &quot;samples&quot;: 2000,
            &quot;method&quot;: &quot;paired-cluster-percentile-bootstrap-v1&quot;,
            &quot;numpy_version&quot;: &quot;2.5.4&quot;,
            &quot;confidence&quot;: 0.95,
            &quot;note&quot;: &quot;No interval: fewer than two independent declared groups&quot;
          }
        }
      }
    }
  },
  &quot;questions&quot;: [
    {
      &quot;question_id&quot;: &quot;Q1&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_fail&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [
        &quot;POWER&quot;
      ],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    },
    {
      &quot;question_id&quot;: &quot;Q2&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_pass&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    },
    {
      &quot;question_id&quot;: &quot;Q3&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_pass&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    },
    {
      &quot;question_id&quot;: &quot;Q4&quot;,
      &quot;split&quot;: &quot;dev&quot;,
      &quot;tags&quot;: [],
      &quot;answerable&quot;: true,
      &quot;change&quot;: &quot;stable_pass&quot;,
      &quot;gained&quot;: [],
      &quot;lost&quot;: [],
      &quot;missing&quot;: [],
      &quot;deltas&quot;: {
        &quot;sufficiency_rate&quot;: 0.0,
        &quot;mean_evidence_coverage&quot;: 0.0,
        &quot;mean_reciprocal_rank&quot;: 0.0,
        &quot;mean_precision_at_k&quot;: 0.0
      }
    }
  ]
}</pre>

## Limitations

- Grids are exploratory. Intervals are not adjusted for multiple comparisons.
- Heldout reuse is tracked under this output root, without protection against edits.
- Vector reuse is observed. Model/OS cache warmth and external traces are unknown.
- Missing timing/cost is unavailable. Supplied usage/pricing yields labeled estimates.
- nDCG requires graded relevance gains. Answer quality is not evaluated.
