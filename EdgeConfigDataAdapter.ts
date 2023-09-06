import { AdapterResponse, IDataAdapter } from "statsig-node";
import type { EdgeConfigClient } from "@vercel/edge-config";

export class EdgeConfigDataAdapter implements IDataAdapter {
  /**
   * The key under which Statisg specs are stored in Edge Config
   */
  private edgeConfigItemKey: string;
  /**
   * A fully configured Edge Config client
   */
  private edgeConfigClient: EdgeConfigClient;
  private supportConfigSpecPolling: boolean = false;

  public constructor(options: {
    /**
     * The key under which Statsig specs are stored in Edge Config
     */
    edgeConfigItemKey: string;
    /**
     * A fully configured Edge Config client.
     *
     * @example <caption>Creating an Edge Config client</caption>
     *
     * ```js
     * import { createClient } from "@vercel/edge-config";
     *
     * createClient(process.env.EDGE_CONFIG)
     * ```
     */
    edgeConfigClient: EdgeConfigClient;
  }) {
    this.edgeConfigItemKey = options.edgeConfigItemKey;
    this.edgeConfigClient = options.edgeConfigClient;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async get(key: string): Promise<AdapterResponse> {
    if (key !== "statsig.cache") {
      return {
        error: new Error(`Edge Config Adapter Only Supports Config Specs`),
      };
    }

    const data = await this.edgeConfigClient.get(this.edgeConfigItemKey);
    if (data === undefined) {
      return { error: new Error(`key (${key}) does not exist`) };
    }
    return { result: JSON.stringify(data) };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async set(
    key: string,
    value: string,
    time?: number | undefined
  ): Promise<void> {
    // no-op. Statsig's Edge Config integration keeps config specs synced through Statsig's service
  }

  public async initialize(): Promise<void> {
    const data = await this.edgeConfigClient.get(this.edgeConfigItemKey);

    if (data) {
      this.supportConfigSpecPolling = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async shutdown(): Promise<void> {}

  public supportsPollingUpdatesFor(key: string): boolean {
    if (key === "statsig.cache") {
      return this.supportConfigSpecPolling;
    }
    return false;
  }
}
