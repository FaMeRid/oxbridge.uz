export default function Question({ q, value, onChange }) {
  if (q.type === "input") {
    return (
      <div>
        <p>{q.question}</p>
        <input
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
        />
      </div>
    );
  }

  const optionLabelStyle = {
    display: "block",
    margin: "10px 0",
    cursor: "pointer",
    fontSize: "0.92rem",
    lineHeight: 1.45,
    color: "var(--text)",
  };

  if (q.type === "radio") {
    return (
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600, color: "var(--navy)" }}>{q.question}</p>
        {q.options.map((opt) => (
          <label key={opt} style={optionLabelStyle}>
            <input
              type="radio"
              name={q.id}
              checked={value === opt}
              onChange={() => onChange(q.id, opt)}
              style={{ marginRight: 10, accentColor: "var(--crimson)" }}
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "checkbox") {
    const maxPick = Array.isArray(q.answer) ? q.answer.length : Infinity;
    return (
      <div>
        <p style={{ marginBottom: 12, fontWeight: 600, color: "var(--navy)" }}>{q.question}</p>
        {q.options.map((opt) => (
          <label key={opt} style={optionLabelStyle}>
            <input
              type="checkbox"
              checked={value?.includes(opt) || false}
              onChange={(e) => {
                let newVal = value || [];

                if (e.target.checked) {
                  if (newVal.length >= maxPick) return;
                  newVal = [...newVal, opt];
                } else {
                  newVal = newVal.filter((v) => v !== opt);
                }

                onChange(q.id, newVal);
              }}
              style={{ marginRight: 10, accentColor: "var(--crimson)" }}
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  return null;
}