import { createHandler } from "@solidjs/start/entry";
import { StartServer } from "@solidjs/start/server";


export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>热烈的杯</title>
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="https://jsdelivr.b-cdn.net/npm/@pqina/pintura/pintura.css" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          <script src="https://jsdelivr.b-cdn.net/gh/mydracula/image@master/20240205/93273d94959848b49de98f593169704e.js"></script>
          <script src="https://jsdelivr.b-cdn.net/npm/@pqina/pintura/pintura-umd.js"></script>
          {scripts}
        </body>
      </html>
    )}
  />
));