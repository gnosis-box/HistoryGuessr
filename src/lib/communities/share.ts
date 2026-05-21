import { getAppOrigin } from "@/utils/appUrl";

export function buildQuizShareUrl(
  communityId: string,
  quizId: string,
): string {
  const url = new URL(getAppOrigin());
  url.searchParams.set("community", communityId);
  url.searchParams.set("quiz", quizId);
  return url.toString();
}

export function parseQuizShareParams(
  search: string,
): { communityId: string; quizId: string } | null {
  const params = new URLSearchParams(search);
  const communityId = params.get("community");
  const quizId = params.get("quiz");
  if (!communityId || !quizId) return null;
  return { communityId, quizId };
}

export async function copyShareLink(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}
