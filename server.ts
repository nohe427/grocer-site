import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import {  } from './src/server/main';
import { customerAgent, feedback } from './src/server/genkitFlows/flows';
import bodyParser from 'body-parser';
import { ai } from './src/server/config/ai';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  server.use(bodyParser.json())
  // server.post('/api/**', async (req, res) => {
  //   console.log(req.body);
  //   res.send('hi mom');
  // });
  server.post('/api/customerAgent', async (req, res) => {
    console.log(req.body);
    const result = await customerAgent.run({text: req.body.data.text, image: req.body.data.image});
    res
      .status(200)
      .setHeader('x-genkit-trace-id', result.telemetry.traceId)
      .setHeader('x-genkit-span-id', result.telemetry.spanId)
      .send(JSON.stringify({"result": result.result}));
  });

  server.post('/api/feedback', async (req, res) => {
      console.log('feedback');
      const result = await feedback.run(req.body.data);
      console.log(result);
      res.status(200).send(JSON.stringify(result));
  })
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
