"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "book" | "pnr" | "schedule" | "between";

const tabs: { id: Tab; label: string }[] = [
  { id: "book", label: "Book Tickets" },
  { id: "pnr", label: "PNR Status" },
  { id: "schedule", label: "Train Schedule" },
  { id: "between", label: "Trains Between Stations" },
];

type PopularRoute = { from: string; to: string };

export default function BookingWidget({
  popularRoutes = [],
}: {
  popularRoutes?: ReadonlyArray<PopularRoute>;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("book");

  return (
    <div className="w-full">
      {/* Folder-style tabs — Law of Common Region */}
      <div className="flex gap-1 items-end">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-4 py-2.5 text-sm font-medium rounded-t-lg border-t border-x transition-all duration-150",
              activeTab === tab.id
                ? "bg-white dark:bg-gray-800 text-[#1a3c6e] dark:text-blue-300 border-gray-200 dark:border-gray-600 border-t-2 border-t-orange-500 relative z-10 -mb-px"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 hover:-translate-y-0.5",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Widget body */}
      <div className="bg-white dark:bg-gray-800 rounded-b-xl rounded-tr-xl border border-gray-200 dark:border-gray-600 shadow-2xl p-6 transition-colors duration-300">
        {activeTab === "book" && (
          <BookTicketsForm popularRoutes={popularRoutes} />
        )}
        {activeTab === "pnr" && <PNRForm />}
        {activeTab === "schedule" && <ScheduleForm />}
        {activeTab === "between" && <BetweenForm />}
      </div>
    </div>
  );
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
      {children}
    </label>
  );
}

const inputClass =
  "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition";

const selectClass =
  "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition";

function SearchButton({
  label = "Search Trains",
  href = "/search",
  disabled,
}: {
  label?: string;
  href?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      disabled={disabled}
      className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 px-6 rounded-md text-base tracking-wide shadow-md
        hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

function BookTicketsForm({
  popularRoutes,
}: {
  popularRoutes: ReadonlyArray<PopularRoute>;
}) {
  const router = useRouter();
  const [magicInput, setMagicInput] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [trainClass, setTrainClass] = useState("All Classes");
  const [quota, setQuota] = useState("General");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMagicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setMagicInput(text);

    // Magic regex parser
    const regex =
      /(?:.*(?:\bfrom\b\s+))?([a-z\s]+?)\s+to\s+([a-z\s]+?)\s+(?:on\s+)?((?:\d{1,2}(?:st|nd|rd|th)?\s*[a-z]+(?:\s*\d{4})?)|(?:\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)|(?:\d{4}-\d{2}-\d{2}))/i;
    const match = text.match(regex);
    if (match) {
      if (match[1]) setFrom(match[1].trim());
      if (match[2]) setTo(match[2].trim());
      const dateRaw = match[3]?.trim();
      if (dateRaw) {
        try {
          const currentYear = new Date().getFullYear();
          let parsedDate = "";
          // If already YYYY-MM-DD
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
            parsedDate = dateRaw;
          } else {
            // Very generous native parser fallback
            let strToParse = dateRaw.replace(/(st|nd|rd|th)/i, "");
            // Convert DD/MM or DD-MM into MM/DD for JS parser
            if (/^\d{1,2}[/-]\d{1,2}$/.test(strToParse)) {
              const [d, m] = strToParse.split(/[/-]/);
              strToParse = `${m}/${d}/${currentYear}`;
            }
            const dObj = new Date(
              strToParse + (strToParse.match(/\d{4}/) ? "" : ` ${currentYear}`),
            );
            if (!isNaN(dObj.getTime())) {
              const y = dObj.getFullYear();
              const m = String(dObj.getMonth() + 1).padStart(2, "0");
              const day = String(dObj.getDate()).padStart(2, "0");
              parsedDate = `${y}-${m}-${day}`;
            }
          }
          if (parsedDate) setDate(parsedDate);
        } catch (err) {}
      }
    }
  };

  const isReady = Boolean(from.trim() && to.trim() && date);

  const fallbackStations = [
    "Bengaluru (SBC)",
    "Chennai (MAS)",
    "Mumbai (CSMT)",
    "Pune (PUNE)",
    "Delhi (NDLS)",
    "Jaipur (JP)",
    "Hyderabad (SC)",
    "Kolkata (HWH)",
  ];

  const stationOptions = Array.from(
    new Set([
      ...popularRoutes.flatMap((route) => [route.from, route.to]),
      ...fallbackStations,
    ]),
  ).sort();

  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const filteredFrom = useMemo(() => {
    const query = from.trim().toLowerCase();
    if (!query) return stationOptions.slice(0, 6);
    return stationOptions
      .filter((s) => s.toLowerCase().includes(query))
      .slice(0, 6);
  }, [from, stationOptions]);

  const filteredTo = useMemo(() => {
    const query = to.trim().toLowerCase();
    if (!query) return stationOptions.slice(0, 6);
    return stationOptions
      .filter((s) => s.toLowerCase().includes(query))
      .slice(0, 6);
  }, [to, stationOptions]);

  const handleSearch = () => {
    if (!isReady) {
      setError("Please enter From, To, and Date to continue.");
      return;
    }
    setError("");
    setStatus("Checking availability...");
    setIsSubmitting(true);
    const params = new URLSearchParams();
    if (from.trim()) params.set("from", from.trim().toUpperCase());
    if (to.trim()) params.set("to", to.trim().toUpperCase());
    if (date) params.set("date", date);
    if (trainClass) params.set("class", trainClass);
    if (quota) params.set("quota", quota);
    setTimeout(() => {
      router.push(`/search?${params.toString()}`);
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div className="space-y-4">
      {/* Magic Input */}
      <div className="relative mb-6 group">
        <label
          htmlFor="magic-route"
          className="block text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-1 flex items-center gap-1.5"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#magicGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <defs>
              <linearGradient
                id="magicGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
            <path d="M4 17v2" />
            <path d="M5 18H3" />
          </svg>
          Smart Route Search
        </label>
        <div className="relative">
          <input
            id="magic-route"
            type="text"
            placeholder='e.g., "From Bangalore to Chennai on 12th may"'
            value={magicInput}
            onChange={handleMagicChange}
            className="w-full pl-10 pr-4 py-3.5 border-2 border-purple-200 dark:border-purple-800/50 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 text-sm text-gray-900 dark:text-gray-100 placeholder-purple-400/70 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M12 2v20" />
              <path d="m17 5-5-3-5 3" />
              <path d="m17 19-5 3-5-3" />
              <path d="M2 12h20" />
              <path d="m5 7-3 5 3 5" />
              <path d="m19 7 3 5-3 5" />
            </svg>
          </div>
        </div>
        <p className="mt-1.5 text-[11px] text-purple-600/70 dark:text-purple-400/70 font-medium">
          Type naturally to auto-fill the form fields below!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div className="relative">
          <InputLabel>From</InputLabel>
          <input
            type="text"
            placeholder="City or station name"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-invalid={Boolean(error)}
            onFocus={() => setFromOpen(true)}
            onBlur={() => setTimeout(() => setFromOpen(false), 120)}
            className={inputClass}
            role="combobox"
            aria-expanded={fromOpen}
            aria-controls="from-suggestions"
          />
          {fromOpen && filteredFrom.length > 0 && (
            <div
              id="from-suggestions"
              role="listbox"
              className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
            >
              {filteredFrom.map((station) => (
                <button
                  key={station}
                  type="button"
                  onMouseDown={() => setFrom(station)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                  role="option"
                >
                  {station}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Swap From and To"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M7 8h13" />
            <path d="M13 4l4 4-4 4" />
            <path d="M17 16H4" />
            <path d="M11 20l-4-4 4-4" />
          </svg>
        </button>
        <div className="relative">
          <InputLabel>To</InputLabel>
          <input
            type="text"
            placeholder="City or station name"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-invalid={Boolean(error)}
            onFocus={() => setToOpen(true)}
            onBlur={() => setTimeout(() => setToOpen(false), 120)}
            className={inputClass}
            role="combobox"
            aria-expanded={toOpen}
            aria-controls="to-suggestions"
          />
          {toOpen && filteredTo.length > 0 && (
            <div
              id="to-suggestions"
              role="listbox"
              className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
            >
              {filteredTo.map((station) => (
                <button
                  key={station}
                  type="button"
                  onMouseDown={() => setTo(station)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                  role="option"
                >
                  {station}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <InputLabel>Date of Journey</InputLabel>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Choose a date within the open booking window.
          </p>
        </div>
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="w-full h-12 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            aria-expanded={showAdvanced}
          >
            {showAdvanced ? "Hide advanced options" : "Show advanced options"}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <InputLabel>Class</InputLabel>
            <select
              value={trainClass}
              onChange={(e) => setTrainClass(e.target.value)}
              className={selectClass}
            >
              <option>All Classes</option>
              <option>Sleeper (SL)</option>
              <option>Third AC (3A)</option>
              <option>Second AC (2A)</option>
              <option>First AC (1A)</option>
              <option>Chair Car (CC)</option>
              <option>Executive Chair (EC)</option>
            </select>
          </div>
          <div>
            <InputLabel>Quota</InputLabel>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value)}
              className={selectClass}
            >
              <option>General</option>
              <option>Ladies</option>
              <option>Tatkal</option>
              <option>Premium Tatkal</option>
            </select>
          </div>
        </div>
      )}

      {popularRoutes.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
            Popular routes
          </p>
          <div className="flex flex-wrap gap-2">
            {popularRoutes.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                type="button"
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                  setError("");
                }}
                className="px-3 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                {route.from} to {route.to}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* High-contrast labels — Error Prevention */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-blue-700" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Person with Disability Concession
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-blue-700" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Flexible with Date
          </span>
        </label>
      </div>

      {error && (
        <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <button
          onClick={handleSearch}
          disabled={!isReady || isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 px-6 rounded-md text-base tracking-wide shadow-md
            hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Searching..." : "Search Trains"}
        </button>
        <p
          className="text-xs text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          {status || "Add From, To, and Date to enable search."}
        </p>
      </div>
    </div>
  );
}

function PNRForm() {
  return (
    <div className="space-y-4">
      <div>
        <InputLabel>PNR Number</InputLabel>
        <input
          type="text"
          placeholder="Enter your 10-digit PNR number"
          maxLength={10}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Your PNR number can be found on your booking confirmation.
        </p>
      </div>
      <SearchButton label="Get PNR Status" />
    </div>
  );
}

function ScheduleForm() {
  return (
    <div className="space-y-4">
      <div>
        <InputLabel>Train Number or Name</InputLabel>
        <input
          type="text"
          placeholder="e.g. 12301 or Rajdhani Express"
          className={inputClass}
        />
      </div>
      <SearchButton label="Get Schedule" />
    </div>
  );
}

function BetweenForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <InputLabel>From</InputLabel>
          <input
            type="text"
            placeholder="Source station"
            className={inputClass}
          />
        </div>
        <div>
          <InputLabel>To</InputLabel>
          <input
            type="text"
            placeholder="Destination station"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <InputLabel>Date</InputLabel>
        <input type="date" className={inputClass} />
      </div>
      <SearchButton />
    </div>
  );
}
