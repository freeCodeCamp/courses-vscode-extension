import { handleConfig } from "../handles";
import { getConfig } from "../usefuls";

export default async function test() {
  try {
    const config = await getConfig();
    handleConfig(config, "test");
    return Promise.resolve(`Running command: ${config?.scripts?.test}`);
  } catch (e) {
    return Promise.reject(e);
  }
}
