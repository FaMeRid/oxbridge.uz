import { loadTestHistory, saveTestHistory } from "@/utils/testHistoryStorage";

export function saveResult(result, user = null) {
  const history = loadTestHistory(user);
  history.push({
    ...result,
    date: new Date().toISOString(),
  });
  saveTestHistory(user, history);
}
