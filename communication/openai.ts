import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const OPENAI_ORGANIZATION = Deno.env.get("OPENAI_ORGANIZATION");

const configuration = new Configuration({
  organization: OPENAI_ORGANIZATION,
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default openai;
