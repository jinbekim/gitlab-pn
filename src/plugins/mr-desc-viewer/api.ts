/**
 * GitLab API fetch for MR description
 */

export interface MrDescription {
  title: string;
  description_html: string;
}

const cache = new Map<string, MrDescription>();

function cacheKey(projectPath: string, mrIid: string): string {
  return `${projectPath}!${mrIid}`;
}

export function clearCache(): void {
  cache.clear();
}

export async function fetchMrDescription(
  projectPath: string,
  mrIid: string,
): Promise<MrDescription> {
  const key = cacheKey(projectPath, mrIid);
  const cached = cache.get(key);
  if (cached) return cached;

  const url = `${location.origin}/api/v4/projects/${encodeURIComponent(projectPath)}/merge_requests/${mrIid}`;
  const res = await fetch(url, { credentials: 'same-origin' });

  if (!res.ok) {
    throw new Error(`Failed to fetch MR description: ${res.status}`);
  }

  const data = await res.json();
  const result: MrDescription = {
    title: data.title,
    description_html: data.description_html,
  };

  cache.set(key, result);
  return result;
}
