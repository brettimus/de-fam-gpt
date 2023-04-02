// routes/chat/index.tsx
import { config as configureEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import {
  Configuration,
  OpenAIApi,
  CreateChatCompletionResponse,
  CreateChatCompletionResponseChoicesInner,
  Model,
} from "https://esm.sh/openai@3.2.1";
import classNames from "https://esm.sh/classnames@2.3.2";

import { Handlers, PageProps, Request } from "$fresh/server.ts";

let OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
let OPENAI_ORGANIZATION = Deno.env.get("OPENAI_ORGANIZATION");

if (typeof Deno.readFileSync === "function") {
  const env = configureEnv({
    safe: true,
  });
  OPENAI_API_KEY = env.OPENAI_API_KEY;
  OPENAI_ORGANIZATION = env.OPENAI_ORGANIZATION;
}

const configuration = new Configuration({
  organization: OPENAI_ORGANIZATION,
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type FamModelsResponse = {
  query: string;
  answer: string;
};

export const handler: Handlers<FamModelsResponse | null> = {
  async POST(req, ctx) {
    const requestFormData = await req.formData();
    const query = requestFormData.get("query") as string;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for the Beutell family.",
        },
        { role: "user", content: query },
      ],
    });

    if (response.status !== 200) {
      return ctx.render(null);
    }

    const answer =
      response.data.choices?.[0]?.message?.content ??
      "NO RESPONSE - Possible error";

    return ctx.render({ answer, query });
  },
};

const inputClasses = classNames(
  "rounded-md",
  "border-gray-300",
  "bg-gray-100",
  "focus:border-indigo-500",
  "focus:ring-1",
  "focus:ring-indigo-500",
  "focus:outline-none",
  "py-2",
  "px-4",
  "block",
  "w-full",
  "sm:text-sm",
  "placeholder-gray-500"
);

const buttonClasses = classNames(
  "px-4",
  "py-2",
  "text-base",
  "font-medium",
  "text-white",
  "bg-indigo-600",
  "rounded-md",
  "hover:bg-indigo-700",
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-offset-2",
  "focus:ring-indigo-500",
  "flex",
  "items-center",
  "justify-center"
);

export default function Page({ data }: PageProps<FamModelsResponse | null>) {
  return (
    <div className="max-w-md mx-auto mt-32 p-4 bg-white rounded-md shadow-md">
      <form method="POST">
        <div className="mb-4 flex">
          <input
            className={inputClasses}
            id="query"
            name="query"
            type="text"
            placeholder="Ask something here"
            value={data?.query ?? ""}
          />
          <button className={buttonClasses} type="submit">
            🔎
          </button>
        </div>
      </form>
      {data && data.answer && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          {data.answer}
        </div>
      )}
    </div>
  );
}
