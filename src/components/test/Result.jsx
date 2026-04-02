export default function Result({ score, total }) {
  const band = getBand(score);

  return (
    <div>
      <h2>Test Complete</h2>

      <p>Score: {score} / {total}</p>
      <h3>Band: {band}</h3>

      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
}

function getBand(score) {
  if (score >= 35) return 8;
  if (score >= 30) return 7;
  if (score >= 25) return 6;
  if (score >= 20) return 5;
  return 4;
}