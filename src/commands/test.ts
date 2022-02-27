import { handleConfig } from "../handles";
import { getConfig } from "../usefuls";

export default async function test() {
  try {
    const config = await getConfig();
    await handleConfig(config, "test");
    return Promise.resolve(
      `Running command: ${JSON.stringify(config?.scripts?.test, null, 2)}`
    );
  } catch (e) {
    return Promise.reject(e);
  }
}
