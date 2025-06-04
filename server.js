import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import * as vite from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;

async function createServer() {
  const app = express();
  app.use(compression());

  let viteServer;
  if (!isProduction) {
    viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(viteServer.middlewares);
  } else {
    app.use(sirv('dist/client', { gzip: true }));
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      let template, render;

      if (!isProduction) {
        template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await viteServer.transformIndexHtml(url, template);
        render = (await viteServer.ssrLoadModule('/src/entry-server.tsx')).render;
      } else {
        template = fs.readFileSync(path.resolve('dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      }

      const { html: appHtml } = await render(url);
      const html = template.replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (!isProduction) {
        viteServer.ssrFixStacktrace(e);
      }
      console.error(e.stack);
      res.status(500).end(e.stack);
    }
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();