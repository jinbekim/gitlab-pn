import { describe, it, expect, beforeEach } from 'vitest';
import { getKey, getFilterList, setFilterList } from '../../../src/plugins/rm-mr-filter/utils';

describe('getKey', () => {
  function setPath(path: string) {
    Object.defineProperty(window, 'location', {
      value: { href: `http://gitlab.example.com${path}`, pathname: path },
      writable: true,
    });
  }

  it('should generate key for standard group/project path', () => {
    setPath('/my-group/my-project/-/merge_requests');
    expect(getKey()).toBe('my-group/my-project-merge-request-recent-searches');
  });

  it('should generate key for subgroup path', () => {
    setPath('/my-group/sub-group/my-project/-/merge_requests');
    expect(getKey()).toBe('my-group/sub-group/my-project-merge-request-recent-searches');
  });

  it('should generate key for deeply nested subgroup path', () => {
    setPath('/a/b/c/d/-/merge_requests');
    expect(getKey()).toBe('a/b/c/d-merge-request-recent-searches');
  });

  it('should handle query parameters in URL', () => {
    setPath('/my-group/my-project/-/merge_requests?scope=all');
    expect(getKey()).toBe('my-group/my-project-merge-request-recent-searches');
  });
});

describe('getFilterList / setFilterList', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'location', {
      value: { href: 'http://gitlab.example.com/g/p/-/merge_requests', pathname: '/g/p/-/merge_requests' },
      writable: true,
    });
  });

  it('should return empty array when no data exists', () => {
    expect(getFilterList()).toEqual([]);
  });

  it('should round-trip string items', () => {
    const items = ['draft:=No', 'author:=@jinbeom'];
    setFilterList(items);
    expect(getFilterList()).toEqual(items);
  });

  it('should round-trip array items', () => {
    const items = [['draft', ':=', 'No'], ['author', ':=', '@jinbeom']];
    setFilterList(items);
    expect(getFilterList()).toEqual(items);
  });
});
