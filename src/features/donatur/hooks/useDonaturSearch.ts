"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { listDonaturAction } from "@/server/actions/donatur/list-donatur";
import { type DonaturListItemDto } from "../types";
import { toast } from "sonner";

export function useDonaturSearch(initialLimit = 10) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [items, setItems] = useState<readonly DonaturListItemDto[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<readonly string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the query state
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const fetchItems = useCallback(
    async (searchQuery: string, cursor?: string, isNavigatingBack = false) => {
      setIsLoading(true);
      const res = await listDonaturAction({
        query: searchQuery,
        cursor,
        limit: initialLimit,
      });
      setIsLoading(false);

      if (res.success) {
        setItems(res.data.items);
        setNextCursor(res.data.nextCursor);

        if (!isNavigatingBack) {
          if (cursor) {
            setCursorHistory((prev) => [...prev, cursor]);
          } else {
            setCursorHistory([]);
          }
        }
      } else {
        toast.error(res.error.message || "Gagal memuat data donatur");
      }
    },
    [initialLimit]
  );

  // Trigger search when debounced query changes
  useEffect(() => {
    startTransition(() => {
      fetchItems(debouncedQuery);
    });
  }, [debouncedQuery, fetchItems]);

  const handleNextPage = useCallback(() => {
    if (!nextCursor) return;
    fetchItems(debouncedQuery, nextCursor);
  }, [nextCursor, debouncedQuery, fetchItems]);

  const handlePreviousPage = useCallback(() => {
    if (cursorHistory.length === 0) return;

    const newHistory = [...cursorHistory];
    newHistory.pop(); // Remove current page's start cursor
    const previousCursor = newHistory[newHistory.length - 1]; // Can be undefined for first page

    setCursorHistory(newHistory);
    fetchItems(debouncedQuery, previousCursor, true);
  }, [cursorHistory, debouncedQuery, fetchItems]);

  return {
    query,
    setQuery,
    items,
    isLoading: isLoading || isPending,
    nextCursor,
    hasPrevious: cursorHistory.length > 0,
    handleNextPage,
    handlePreviousPage,
    refresh: () => fetchItems(debouncedQuery, cursorHistory[cursorHistory.length - 1]),
  };
}
