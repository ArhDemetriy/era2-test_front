// счётчики, фильтрация, сортировка, поиск

import { debounce } from "lodash-es";
import { create } from "zustand";

//** Filter */

export const filters = [
  { key: "all", title: "Все" },
  { key: "queued", title: "В очереди" },
  { key: "running", title: "Идёт" },
  { key: "done", title: "Готово" },
  { key: "failed", title: "Ошибка" },
] as const;

const sorts = [
  { key: "newest", title: "Сначала новые" },
  { key: "oldest", title: "Сначала старые" },
  { key: "status", title: "По статусу" },
  { key: "progress_up", title: "По прогрессу вверх" },
  { key: "progress_down", title: "По прогрессу вниз" },
] as const;

export const possibleFilters = { filters, sorts } as const;

export type FilterKey = (typeof filters)[number]["key"];
export type SortKey = (typeof sorts)[number]["key"];

export interface IFilter {
  filter: FilterKey[];
  query: string;
  sort: SortKey;
}

const initialValues: IFilter = {
  filter: ["all"],
  query: "",
  sort: "newest",
};

/** состояние фильтра для работы фронта. Не подписывать на него вызовы бэка, используй useDebouncedFilterStore */
export const useFilterStore = create<
  IFilter & {
    toggleFilter: (key: FilterKey) => void;
    setQuery: (query: string) => void;
    setSort: (sort: SortKey) => void;
    resetFilters: () => void;
  }
>((set) => ({
  ...initialValues,
  toggleFilter: (key) =>
    set((state) => {
      if (key === "all") {
        return { filter: ["all"] };
      }

      const newFilter = state.filter.includes(key)
        ? state.filter.filter((f) => f !== key)
        : [...state.filter.filter((f) => f !== "all"), key];

      return { filter: newFilter.length === 0 ? ["all"] : newFilter };
    }),
  setQuery: (query) => set({ query }),
  setSort: (sort) => set({ sort }),
  resetFilters: () => set(initialValues),
}));

/** состояние фильтра для вызова бэка */
export const useDebouncedFilterStore = create<
  IFilter & {
    setFilter: (key: IFilter) => void;
  }
>((set) => {
  const { filter, sort, query } = useFilterStore.getState();
  return {
    filter,
    sort,
    query,
    setFilter: (filter) => set(filter),
  };
});
const debouncedProxy = debounce(
  ({ filter, query, sort }: IFilter) =>
    useDebouncedFilterStore.setState({ filter, query, sort }),
  300,
);
useFilterStore.subscribe(debouncedProxy);

//** foo */
