import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@workspace/validations";
import { Hono, type Context } from "hono";
import { validationErrorResponse } from "../../../../utils/validate-error-res";
import {
  deleteAuthRefreshToken,
  login,
  signup,
} from "../../../../db/services/auth";
import {
  clearAuthCookies,
  generateTokens,
  setAuthCookies,
  storeRefreshToken,
} from "../../../../utils/auth-token";
import { getSignedCookie } from "hono/cookie";
import { envConfig } from "../../../../config";
import { verify } from "hono/jwt";

const adminAuthRoutes = new Hono();

export type ServiceDataPromise = Promise<{
  status: "success" | "error";
  data: { id: string; email: string; name?: string } | null;
  message?: string;
}>;

const handleAuth = async (
  c: Context,
  serviceDataPromise: ServiceDataPromise
) => {
  const serviceData = await serviceDataPromise;

  if (serviceData.status !== "success" || !serviceData.data?.id) {
    return c.json(
      {
        success: false,
        message: serviceData.message || "Authentication failed",
      },
      401
    );
  }

  const { id, email, name } = serviceData.data;
  const userAgent = c.req.header("User-Agent") || "unknown";

  const { accessToken, refreshToken, refreshExpDate } = await generateTokens(
    id,
    email,
    name || "-"
  );

  await storeRefreshToken(id, refreshToken, refreshExpDate, userAgent);
  await setAuthCookies(c, accessToken, refreshToken);

  return c.json(
    {
      message: "Authentication successful",
      data: serviceData.data,
      success: true,
    },
    201
  );
};

adminAuthRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const body = c.req.valid("json");
  const resolvedData = await login(body);
  return handleAuth(c, Promise.resolve(resolvedData));
});

/*
// uncomment when u want to create an admin
adminAuthRoutes.post("/signup", zValidator("json", loginSchema), async (c) => {
  const data = await signup(c.req.valid("json"));
  if (data.status === "error") {
    return c.json(data, 400);
  } else {
    return c.json(data);
  }
});

*/

adminAuthRoutes.post("/logout", async (c) => {
  const refreshToken = await getSignedCookie(
    c,
    envConfig.JWT_REFRESH_SECRET,
    "idoloMerchRefreshToken"
  );

  if (refreshToken) {
    try {
      const decoded = (await verify(
        refreshToken,
        envConfig.JWT_REFRESH_SECRET!
      )) as { id: string };
      if (decoded.id) await deleteAuthRefreshToken(decoded.id);
    } catch {
      console.warn("Invalid or expired refresh token during logout");
    }
  }

  await clearAuthCookies(c);
  return c.json({ message: "Logout successful", status: "success" }, 200);
});
export default adminAuthRoutes;
