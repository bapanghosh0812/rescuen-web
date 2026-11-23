import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";

// Verifies a sign-in token against Google's public keys. No private key is
// needed, so there is nothing sensitive to store or leak.
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export async function verifyIdToken(token: string): Promise<{ uid: string } | null> {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return null;
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      requiredClaims: ["sub", "exp", "iat", "auth_time"],
    });
    if (!payload.sub || Number(payload.auth_time) * 1000 > Date.now()) return null;
    return { uid: payload.sub };
  } catch {
    return null;
  }
}
