import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  getPinStorageKey,
  isPinned,
  reorderWithPinnedFirst,
  restoreMissingPinned,
  getPinnedList,
  setPinnedList,
  togglePin,
} from '../../../src/plugins/rm-mr-filter/pinStorage';

describe('pinStorage', () => {
  describe('getPinStorageKey', () => {
    beforeEach(() => {
      vi.stubGlobal('location', { href: 'https://gitlab.example.com/group/project/-/merge_requests' });
    });

    it('should generate key from project slug', () => {
      const key = getPinStorageKey();
      expect(key).toBe('pinned-filters:group/project');
    });
  });

  describe('isPinned', () => {
    it('should return true for pinned filter', () => {
      expect(isPinned('filter-a', ['filter-a', 'filter-b'])).toBe(true);
    });

    it('should return false for unpinned filter', () => {
      expect(isPinned('filter-c', ['filter-a', 'filter-b'])).toBe(false);
    });

    it('should return false for empty pinned list', () => {
      expect(isPinned('filter-a', [])).toBe(false);
    });
  });

  describe('reorderWithPinnedFirst', () => {
    it('should move pinned filters to front', () => {
      const filters = ['a', 'b', 'c', 'd'];
      const pinned = ['c', 'd'];
      expect(reorderWithPinnedFirst(filters, pinned)).toEqual(['c', 'd', 'a', 'b']);
    });

    it('should preserve relative order within pinned and unpinned', () => {
      const filters = ['x', 'a', 'y', 'b'];
      const pinned = ['a', 'b'];
      expect(reorderWithPinnedFirst(filters, pinned)).toEqual(['a', 'b', 'x', 'y']);
    });

    it('should handle no pinned filters', () => {
      const filters = ['a', 'b', 'c'];
      expect(reorderWithPinnedFirst(filters, [])).toEqual(['a', 'b', 'c']);
    });

    it('should handle all pinned filters', () => {
      const filters = ['a', 'b'];
      expect(reorderWithPinnedFirst(filters, ['a', 'b'])).toEqual(['a', 'b']);
    });
  });

  describe('restoreMissingPinned', () => {
    it('should append missing pinned filters', () => {
      const filters = ['a', 'b'];
      const pinned = ['b', 'c'];
      expect(restoreMissingPinned(filters, pinned)).toEqual(['a', 'b', 'c']);
    });

    it('should not duplicate existing filters', () => {
      const filters = ['a', 'b'];
      const pinned = ['a', 'b'];
      expect(restoreMissingPinned(filters, pinned)).toEqual(['a', 'b']);
    });

    it('should handle empty filters', () => {
      const filters: string[] = [];
      const pinned = ['a', 'b'];
      expect(restoreMissingPinned(filters, pinned)).toEqual(['a', 'b']);
    });

    it('should handle empty pinned list', () => {
      const filters = ['a', 'b'];
      expect(restoreMissingPinned(filters, [])).toEqual(['a', 'b']);
    });
  });

  describe('getPinnedList / setPinnedList', () => {
    let storage: Record<string, string>;

    beforeEach(() => {
      storage = {};
      vi.stubGlobal('location', { href: 'https://gitlab.example.com/group/project/-/merge_requests' });
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => { storage[key] = value; },
      });
    });

    it('should return empty array when nothing stored', () => {
      expect(getPinnedList()).toEqual([]);
    });

    it('should save and retrieve pinned list', () => {
      setPinnedList(['filter-a', 'filter-b']);
      expect(getPinnedList()).toEqual(['filter-a', 'filter-b']);
    });

    it('should return empty array on invalid JSON', () => {
      storage['pinned-filters:group/project'] = 'not-json';
      expect(getPinnedList()).toEqual([]);
    });
  });

  describe('togglePin', () => {
    let storage: Record<string, string>;

    beforeEach(() => {
      storage = {};
      vi.stubGlobal('location', { href: 'https://gitlab.example.com/group/project/-/merge_requests' });
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => { storage[key] = value; },
      });
    });

    it('should pin a filter and return true', () => {
      const result = togglePin('filter-a');
      expect(result).toBe(true);
      expect(getPinnedList()).toEqual(['filter-a']);
    });

    it('should unpin a filter and return false', () => {
      setPinnedList(['filter-a', 'filter-b']);
      const result = togglePin('filter-a');
      expect(result).toBe(false);
      expect(getPinnedList()).toEqual(['filter-b']);
    });

    it('should add to existing pinned list', () => {
      setPinnedList(['filter-a']);
      togglePin('filter-b');
      expect(getPinnedList()).toEqual(['filter-a', 'filter-b']);
    });
  });
});
