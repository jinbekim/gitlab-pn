/**
 * URL parsing utilities for GitLab MR pages
 */

export interface MrUrlInfo {
  projectPath: string;
  mrIid: string;
  currentTab: string;
}

const MR_URL_PATTERN = /^\/(.+)\/-\/merge_requests\/(\d+)(?:\/(\w+))?/;

export function parseMrUrl(href?: string): MrUrlInfo | null {
  const url = href ?? location.pathname;
  const match = url.match(MR_URL_PATTERN);
  if (!match) return null;

  return {
    projectPath: match[1],
    mrIid: match[2],
    currentTab: match[3] ?? '',
  };
}

export function isOnOverviewTab(info: MrUrlInfo): boolean {
  return info.currentTab === '';
}
