export async function shareResult(params: {
  score: number;
  summary: string;
  answerLabel: string;
  title: string;
  modeName?: string;
  playerName?: string;
}): Promise<void> {
  const who = params.playerName ? `${params.playerName} scored` : "I scored";
  const text = `${who} ${params.score}/1000 on History Guessr${params.modeName ? ` (${params.modeName})` : ""}.

Challenge: ${params.title}
${params.summary}
The answer was ${params.answerLabel}.

Guess where history happened.`;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!copied) {
      throw new Error("Could not copy result to clipboard.");
    }
  }
}
