# Statsig Node Server SDK - Edge Config Adapter

[![npm version](https://badge.fury.io/js/statsig-node-vercel.svg)](https://badge.fury.io/js/statsig-node-vercel)

A first party Edge Config integration with the [Statsig server-side Node.js SDK](https://github.com/statsig-io/node-js-server-sdk).

## Quick Setup

1. Install the Statsig Node SDK

```sh
npm install statsig-node@5.3.0
```

2. Install this package and the Edge Config SDK

```sh
npm install statsig-node-vercel @vercel/edge-config
```

3. Install the [Statsig Vercel Integration](https://vercel.com/integrations/statsig)
4. Import the packages

```js
import { EdgeConfigDataAdapter } from "statsig-node-vercel";
import { createClient } from "@vercel/edge-config";
```

5. Create an instance of the `EdgeConfigDataAdapter`

```js
const edgeConfigClient = createClient(process.env.EDGE_CONFIG);
const dataAdapter = new EdgeConfigDataAdapter("KEY_FROM_INSTALLATION");
```

6. When initializing the `statsig` sdk, add the adapter to options

```js
await statsig.initialize("server-secret-key", { dataAdapter: dataAdapter });
```
