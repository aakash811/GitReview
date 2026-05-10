export function buildRetryPrompt(raw: string) {
  return `
        Your previous response FAILED schema validation.

        You MUST return ONLY valid JSON.

        Do not include:
        - markdown
        - prose
        - explanations
        - comments
        - extra keys

        Fix this invalid response:

        ${raw}
    `;
}
