import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://umweltbundesamt.api.proxy.bund.dev",
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // remove base path
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
