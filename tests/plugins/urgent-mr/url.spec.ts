import { describe, it, expect } from 'vitest';
import { isMrFormPage } from '../../../src/plugins/urgent-mr/url';

describe('isMrFormPage', () => {
  it('should match MR edit page', () => {
    expect(isMrFormPage('/my-group/my-project/-/merge_requests/123/edit')).toBe(true);
  });

  it('should match MR edit page with nested group', () => {
    expect(isMrFormPage('/my-group/sub-group/my-project/-/merge_requests/456/edit')).toBe(true);
  });

  it('should match MR new page', () => {
    expect(isMrFormPage('/my-group/my-project/-/merge_requests/new')).toBe(true);
  });

  it('should match MR new page with nested group', () => {
    expect(isMrFormPage('/my-group/sub-group/my-project/-/merge_requests/new')).toBe(true);
  });

  it('should not match MR overview page', () => {
    expect(isMrFormPage('/my-group/my-project/-/merge_requests/123')).toBe(false);
  });

  it('should not match MR changes tab', () => {
    expect(isMrFormPage('/my-group/my-project/-/merge_requests/123/diffs')).toBe(false);
  });

  it('should not match MR commits tab', () => {
    expect(isMrFormPage('/my-group/my-project/-/merge_requests/123/commits')).toBe(false);
  });

  it('should not match MR list page', () => {
    expect(isMrFormPage('/my-group/my-project/-/merge_requests')).toBe(false);
  });

  it('should not match unrelated page', () => {
    expect(isMrFormPage('/my-group/my-project/-/issues/1')).toBe(false);
  });
});
