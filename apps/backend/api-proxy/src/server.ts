import express from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import cors from "cors";
const app = express();
const PORT = 4000;
const AUTH_SERVICE = "http://localhost:4001/v1/auth";

// Enable CORS for all routes
app.use(cors());

// Add morgan for logging
// app.use(morgan('dev'));

// Proxy middleware configuration

const apiProxyAuth = createProxyMiddleware(<Options>{
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    "^/v1/auth": "/auth", // Remove /api prefix
  },
  onProxyReq: (proxyReq: any) => {
    console.log(`Proxying request to: ${AUTH_SERVICE}${proxyReq.path}`);
  },
  onProxyRes: (proxyRes: any, req: any) => {
    console.log(
      `Received response from: ${AUTH_SERVICE}${req.url} with status: ${proxyRes.statusCode}`
    );
  },
  onError: (err: any, res: any) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy Error");
  },
});

// Use the proxy middleware for all routes
app.use("/v1/auth", apiProxyAuth);

// Add a catch-all route for debugging
app.use("*", (req, res) => {
  console.log("Unhandled request:", req.method, req.originalUrl);
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`API Proxy running on port ${PORT}`);
  console.log(
    `Proxying requests to ${AUTH_SERVICE || "N/A"} and 
      
    `
  );
});
