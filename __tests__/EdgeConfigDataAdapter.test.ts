import { EdgeConfigDataAdapter } from "../EdgeConfigDataAdapter";
import { createClient } from "@vercel/edge-config";
import fetchMock from "jest-fetch-mock";

describe("Validate edge config adapter functionality", () => {
  const edgeConfigClient = createClient(process.env.EDGE_CONFIG);
  const dataAdapter = new EdgeConfigDataAdapter({
    edgeConfigItemKey: "statsig-companyid",
    edgeConfigClient,
  });

  beforeEach(async () => {
    fetchMock.enableMocks();
    fetchMock.mockResponse('"test123"');
    await dataAdapter.initialize();
  });

  afterEach(async () => {
    await dataAdapter.shutdown();
  });

  test("Simple get", async () => {
    const { result: gates } = await dataAdapter.get("statsig.cache");
    if (gates == null) {
      return;
    }
    expect(gates).toEqual('"test123"');
  });
});
