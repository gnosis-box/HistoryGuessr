import { getAppOrigin } from "@/utils/appUrl";
import { encodeQuizShareBundle, type QuizShareBundle } from "./shareBundle";

export function buildQuizShareUrl(
  communityId: string,
  quizId: string,
  bundle?: QuizShareBundle | null,
): string {
  const url = new URL(getAppOrigin());
  url.searchParams.set("community", communityId);
  url.searchParams.set("quiz", quizId);
  if (bundle) {
    url.searchParams.set("share", encodeQuizShareBundle(bundle));
  }
  return url.toString();
}

export function parseQuizShareParams(
  search: string,
): { communityId: string; quizId: string; sharePayload?: string } | null {
  const params = new URLSearchParams(search);
  const communityId = params.get("community");
  const quizId = params.get("quiz");
  const sharePayload = params.get("share") ?? undefined;
  if (!communityId || !quizId) return null;
  return { communityId, quizId, sharePayload };
}

export async function copyShareLink(url: string): Promise<void> {
  await navigator.clipboard.writeText(url);
}
