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
    fetchMock.mockResponse('{"a":1}');
    await dataAdapter.initialize();
  });

  afterEach(async () => {
    await dataAdapter.shutdown();
  });

  test("Simple get", async () => {
    const { result: gates } = await dataAdapter.get("statsig.cache");
    expect(gates).toEqual({a: 1});
  });
  
  test('Simple get v2 key', async () => {
    const { result: gates }  = await dataAdapter.get("statsig|/v1/download_config_specs|plain_text|1234");
    expect(gates).toEqual({a: 1});
  });

  test('Simple get v2 key with dcs v2', async () => {
    const { result: gates }  = await dataAdapter.get("statsig|/v2/download_config_specs|plain_text|1234");
    expect(gates).toEqual({a: 1});
  });
});
