import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  getPinStorageKey,
  isPinned,
  reorderWithPinnedFirst,
  restoreMissingPinned,
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
});
