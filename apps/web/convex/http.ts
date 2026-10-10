import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./auth";
import { log } from "./usage";

const http = httpRouter();

// Better Auth's endpoints, under /api/auth on the deployment's .convex.site URL.
authComponent.registerRoutes(http, createAuth);

// The usage log behind /admin/stats; the site posts here with a shared secret.
http.route({ path: "/usage/log", method: "POST", handler: log });

export default http;
