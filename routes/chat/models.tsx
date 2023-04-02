// routes/chat/index.tsx
import { ListModelsResponse } from "openai";
import classNames from "classnames";

import { Handlers, PageProps } from "$fresh/server.ts";

import openai from "../../communication/openai.ts";

type FamModelsResponse = { query: string; results: ListModelsResponse["data"] };

export const handler: Handlers<FamModelsResponse | null> = {
  async GET(req, ctx) {
    // EXAMPLE: Get request params
    // const { username } = ctx.params;
    const response = await openai.listModels();

    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";

    // EXAMPLE: Handle non-200 responses
    if (response.status !== 200) {
      return ctx.render(null);
    }

    // EXAMPLE: If you're using fetch to get data
    // const user: User = await resp.json();

    const results = response.data.data.filter((model) =>
      model.id.toLowerCase().includes(query.toLowerCase())
    );

    return ctx.render({ results, query });
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
  if (!data) {
    return <h1>Models not found</h1>;
  }

  const { results, query } = data;

  return (
    <div className="max-w-md mx-auto mt-32 p-4 bg-white rounded-md shadow-md">
      <form>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="query"
        >
          Look for a model:
        </label>
        <div className="mb-4 flex">
          <input
            className={inputClasses}
            id="query"
            name="query"
            type="text"
            placeholder="Enter text here"
            value={query}
          />
          <button className={buttonClasses} type="submit">
            Search
          </button>
        </div>
      </form>
      <div className="mt-4 p-4 border border-gray-300 rounded-md">
        <ul>
          {results.map((model) => (
            <li key={model.id}>{model.id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
