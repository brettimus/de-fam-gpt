// routes/chat.tsx
import { config as configureEnv } from "https://deno.land/x/dotenv/mod.ts";
import {
  Configuration,
  OpenAIApi,
  ListModelsResponse,
  Model,
} from "npm:openai@3.2.1";

import { Handlers, PageProps } from "$fresh/server.ts";

const { OPENAI_ORGANIZATION, OPENAI_API_KEY } = configureEnv({
  safe: true,
});

const configuration = new Configuration({
  organization: OPENAI_ORGANIZATION,
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface User {
  login: string;
  name: string;
  avatar_url: string;
}

export const handler: Handlers<ListModelsResponse | null> = {
  async GET(_, ctx) {
    // const { username } = ctx.params;
    const response = await openai.listModels();

    // const resp = await fetch(`https://api.github.com/users/${username}`);
    // if (resp.status === 404) {
    //   return ctx.render(null);
    // }
    // const user: User = await resp.json();
    return ctx.render(response.data);
  },
};

export default function Page({ data }: PageProps<ListModelsResponse | null>) {
  if (!data) {
    return <h1>User not found</h1>;
  }

  return (
    <div>
      Success{" "}
      <ul>
        {data.data.map((model) => (
          <li key={model.id}>{model.id}</li>
        ))}
      </ul>
    </div>
  );
}
