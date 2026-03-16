/**
 * GitLab API fetch for MR description
 */

export interface MrDescription {
  title: string;
  descriptionHtml: string;
}

const cache = new Map<string, MrDescription>();

function cacheKey(projectPath: string, mrIid: string): string {
  return `${projectPath}!${mrIid}`;
}

export function clearCache(): void {
  cache.clear();
}

async function renderMarkdown(
  projectPath: string,
  text: string,
): Promise<string> {
  const url = `${location.origin}/api/v4/markdown`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      text,
      project: projectPath,
      gfm: true,
    }),
  });
  if (!res.ok) return text;
  const data = await res.json();
  return data.html ?? text;
}

export async function fetchMrDescription(
  projectPath: string,
  mrIid: string,
): Promise<MrDescription> {
  const key = cacheKey(projectPath, mrIid);
  const cached = cache.get(key);
  if (cached) return cached;

  const encodedPath = encodeURIComponent(projectPath);
  const url = `${location.origin}/api/v4/projects/${encodedPath}/merge_requests/${mrIid}?render_html=true`;
  const res = await fetch(url, { credentials: 'same-origin' });

  if (!res.ok) {
    throw new Error(`Failed to fetch MR description: ${res.status}`);
  }

  const data = await res.json();

  let descriptionHtml: string =
    data.description_html ?? '';

  // fallback: render markdown if description_html is absent
  if (!descriptionHtml && data.description) {
    descriptionHtml = await renderMarkdown(projectPath, data.description);
  }

  const result: MrDescription = {
    title: data.title,
    descriptionHtml,
  };

  cache.set(key, result);
  return result;
}
