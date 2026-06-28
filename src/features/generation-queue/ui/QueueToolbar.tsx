import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ChevronDown, Search, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { possibleFilters, useFilterStore } from "../model/selectors";

export function QueueToolbar() {
  const { filters, sorts } = possibleFilters;
  const { filter, query, sort, toggleFilter, setQuery, setSort } =
    useFilterStore();

  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col xl:flex-row justify-start gap-4 xl:gap-17">
      <div className="flex flex-col md:flex-row justify-start gap-4 md:gap-17">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 shrink-1">
          {filters.map(({ key, title }) => (
            <Button
              key={key}
              onClick={() => toggleFilter(key)}
              variant={filter.includes(key) ? "default" : "secondary"}
              size="default"
            >
              {title}
            </Button>
          ))}
        </div>

        {/* Agent dropdown */}
        <div className="relative inline-block  shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm cursor-pointer hover:border-primary/30 transition-colors"
          >
            <span>Выберите агента из списка</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform",
                agentDropdownOpen && "rotate-180",
              )}
            />
          </button>
          {agentDropdownOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-[360px] max-h-[400px] overflow-y-auto rounded-[14px] border p-1.5 shadow-2xl z-50"
              style={{
                background: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
              }}
            >
              {sorts.map(({ key, title }) => (
                <div key={key}>{title}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative grow">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Искать агента..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-shadow placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
