// routes/chat/index.tsx
import classNames from "classnames";
import { useState } from "preact/hooks";
import { Handlers, PageProps } from "$fresh/server.ts";

import openai from "../../communication/openai.ts";

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
  const [isLoading, setIsLoading] = useState(false);
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
          <button
            className={buttonClasses}
            type="submit"
            disabled={isLoading}
            onClick={() => setIsLoading(true)}
          >
            🔎
          </button>
        </div>
      </form>
      {data && data.answer && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md whitespace-pre-line">
          {data.answer}
        </div>
      )}
    </div>
  );
}
