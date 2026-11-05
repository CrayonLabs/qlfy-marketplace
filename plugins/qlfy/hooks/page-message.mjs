export const ALREADY_SHOWN =
  "The qlfy plugin has already shown the user every person on this page as a numbered list, " +
  "numbered by rank. Don't repeat or summarise the list; refer to people by those numbers. " +
  "Reply with at most one line on what stands out, then ask the next step.";

const HOOK_EVENT = "PostToolUse";
const SEPARATOR = " · ";

const oneLine = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const parsedJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const textOf = (block) => (block?.type === "text" ? block.text : null);

const pageOf = (response) => {
  if (typeof response === "string") return parsedJson(response);
  if (Array.isArray(response)) return parsedJson(response.map(textOf).find(Boolean) ?? "");
  return response;
};

const personLine = (person) => {
  const details = [person.current_title || person.headline, person.current_company, person.location]
    .map(oneLine)
    .filter(Boolean)
    .join(SEPARATOR);
  return `${person.rank}. ${oneLine(person.name)} — ${details}`;
};

const header = (page) => {
  const count = page.people.length;
  return `Page ${page.page}${SEPARATOR}${count} ${count === 1 ? "person" : "people"}`;
};

export const pageMessage = (hookInput) => {
  const page = pageOf(hookInput?.tool_response);
  if (!Array.isArray(page?.people) || page.people.length === 0) return null;
  return {
    systemMessage: [header(page), ...page.people.map(personLine)].join("\n"),
    hookSpecificOutput: { hookEventName: HOOK_EVENT, additionalContext: ALREADY_SHOWN },
  };
};
