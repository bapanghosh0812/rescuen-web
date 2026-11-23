// Shared rate limit for every API call, enforced by Netlify before our code runs.
// If this guard itself ever fails, the request still goes through.
export default async () => undefined;

export const config = {
  path: "/api/*",
  onError: "bypass",
  rateLimit: { windowLimit: 60, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
