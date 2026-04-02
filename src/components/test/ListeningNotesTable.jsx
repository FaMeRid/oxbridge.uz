import React, { Fragment, useMemo } from "react";
import "./ListeningNotesTable.css";

function TextWithBreaks({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </Fragment>
  ));
}

function CellContent({ cell, answers, onChange, labelForInput }) {
  if (cell.type === "text") {
    return (
      <span className="lnt-text">
        <TextWithBreaks text={cell.content} />
      </span>
    );
  }

  if (cell.type === "segments") {
    return (
      <span className="lnt-segments">
        {cell.parts.map((p, i) => {
          if (p.type === "text") {
            return (
              <Fragment key={i}>
                <TextWithBreaks text={p.text} />
              </Fragment>
            );
          }
          if (p.type === "input") {
            return (
              <input
                key={i}
                type="text"
                className="lnt-input"
                autoComplete="off"
                aria-label={labelForInput(p.id)}
                value={answers[p.id] ?? ""}
                onChange={(e) => onChange(p.id, e.target.value)}
              />
            );
          }
          return null;
        })}
      </span>
    );
  }

  return null;
}

export default function ListeningNotesTable({ columns, rows, answers, onChange, questions }) {
  const labelById = useMemo(() => {
    const m = {};
    (questions || []).forEach((q) => {
      m[q.id] = q.question || q.id;
    });
    return m;
  }, [questions]);

  const labelForInput = (id) => labelById[id] || `Answer ${id}`;

  return (
    <div className="lnt-wrapper">
      <table className="lnt-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, ri) => (
            <tr key={ri}>
              {cells.map((cell, ci) => (
                <td
                  key={ci}
                  data-lnt-label={columns[ci] || ""}
                >
                  <CellContent
                    cell={cell}
                    answers={answers}
                    onChange={onChange}
                    labelForInput={labelForInput}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
