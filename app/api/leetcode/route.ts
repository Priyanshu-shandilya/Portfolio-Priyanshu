import { NextResponse } from "next/server";

const USERNAME = process.env.LEETCODE_USERNAME ?? "priyanshushandilya";

const QUERY = /* GraphQL */ `
  query userStats($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        ranking
        userAvatar
        realName
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      userCalendar {
        streak
        totalActiveDays
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
      attendedContestsCount
      topPercentage
    }
  }
`;

type Bucket = { difficulty: string; count: number; submissions?: number };

const pick = (arr: Bucket[] | undefined, key: string) =>
  arr?.find((b) => b.difficulty === key)?.count ?? 0;

// Always fetch fresh — this route is polled by the client, so we don't
// want Next.js or the fetch layer serving a stale cached response.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        Origin: "https://leetcode.com",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
      },
      body: JSON.stringify({ query: QUERY, variables: { username: USERNAME } }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `LeetCode responded with ${res.status}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const user = json?.data?.matchedUser;

    if (!user) {
      return NextResponse.json(
        { error: `No LeetCode user named "${USERNAME}"` },
        { status: 404 }
      );
    }

    const solved = user.submitStatsGlobal?.acSubmissionNum as Bucket[];
    const attempted = user.submitStatsGlobal?.totalSubmissionNum as Bucket[];
    const total = json?.data?.allQuestionsCount as Bucket[];
    const contest = json?.data?.userContestRanking;

    const totalSubmissions = pick(attempted, "All");
    const acceptedSubmissions =
      attempted?.find((b) => b.difficulty === "All")?.submissions ?? 0;
    const acSubmissions =
      solved?.find((b) => b.difficulty === "All")?.submissions ?? 0;

    return NextResponse.json(
      {
        username: user.username,
        profileUrl: `https://leetcode.com/u/${user.username}/`,
        avatar: user.profile?.userAvatar ?? null,
        ranking: user.profile?.ranking ?? null,
        streak: user.userCalendar?.streak ?? 0,
        activeDays: user.userCalendar?.totalActiveDays ?? 0,
        solved: {
          all: pick(solved, "All"),
          easy: pick(solved, "Easy"),
          medium: pick(solved, "Medium"),
          hard: pick(solved, "Hard"),
        },
        totals: {
          all: pick(total, "All"),
          easy: pick(total, "Easy"),
          medium: pick(total, "Medium"),
          hard: pick(total, "Hard"),
        },
        acceptanceRate:
          acceptedSubmissions > 0
            ? Math.round((acSubmissions / acceptedSubmissions) * 1000) / 10
            : null,
        submissions: totalSubmissions,
        contest: contest
          ? {
              rating: Math.round(contest.rating),
              globalRanking: contest.globalRanking,
              attended: contest.attendedContestsCount,
              topPercentage: contest.topPercentage,
            }
          : null,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach LeetCode right now." },
      { status: 500 }
    );
  }
}