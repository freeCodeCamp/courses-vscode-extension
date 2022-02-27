import { handleConfig } from "../handles";
import { getConfig } from "../usefuls";

export default async function test() {
  console.log("test again");
  try {
    const config = await getConfig();
    await handleConfig(config, "test");
    return Promise.resolve(`Running command: ${config?.scripts?.test}`);
  } catch (e) {
    return Promise.reject(e);
  }
}
