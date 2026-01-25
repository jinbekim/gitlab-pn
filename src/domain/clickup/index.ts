/**
 * ClickUp task ID pattern: {{clickup:TASK_ID}}
 */
const CLICKUP_PATTERN = /\{\{clickup:([a-zA-Z0-9]+)\}\}/g;

/**
 * ClickUp base URL for tasks
 */
const CLICKUP_BASE_URL = "https://app.clickup.com/t";

/**
 * Extracts all ClickUp task IDs from text
 * @param text - Text to search for ClickUp patterns
 * @returns Array of task IDs found
 */
export function findClickUpTaskIds(text: string): string[] {
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  // Reset regex lastIndex for fresh search
  CLICKUP_PATTERN.lastIndex = 0;

  while ((match = CLICKUP_PATTERN.exec(text)) !== null) {
    matches.push(match[1]);
  }

  return matches;
}

/**
 * Generates ClickUp task URL from task ID
 * @param taskId - ClickUp task ID
 * @returns Full ClickUp task URL
 */
export function getClickUpTaskUrl(taskId: string): string {
  return `${CLICKUP_BASE_URL}/${taskId}`;
}

/**
 * Creates a regex pattern for matching ClickUp patterns
 * @returns RegExp for matching {{clickup:ID}} patterns
 */
export function getClickUpPattern(): RegExp {
  return new RegExp(CLICKUP_PATTERN.source, "g");
}
