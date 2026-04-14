/**
 * URL detection for MR edit/new form pages
 */

const MR_EDIT_PATTERN = /^\/(.+)\/-\/merge_requests\/(\d+)\/edit/;
const MR_NEW_PATTERN = /^\/(.+)\/-\/merge_requests\/new/;

export function isMrFormPage(pathname?: string): boolean {
  const path = pathname ?? location.pathname;
  return MR_EDIT_PATTERN.test(path) || MR_NEW_PATTERN.test(path);
}
