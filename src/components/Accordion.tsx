"use client";
import React, { useState, useRef, useEffect } from "react";

type AccordionItem = {
  id: string | number;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  multiple?: boolean;
  className?: string;
};

export default function Accordion({
  items,
  multiple = false,
  className = "",
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<(string | number)[]>([]);
  const headersRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    headersRef.current = headersRef.current.slice(0, items.length);
  }, [items.length]);

  const isOpen = (id: string | number): boolean => openIds.includes(id);

  const toggle = (id: string | number) => {
    setOpenIds((prev) =>
      multiple
        ? prev.includes(id)
          ? prev.filter((p) => p !== id)
          : [...prev, id]
        : prev[0] === id
          ? []
          : [id]
    );
  };

  const onHeaderKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    id: string | number
  ) => {
    const key = e.key;
    const lastIndex = items.length - 1;

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      e.preventDefault();
    }

    switch (key) {
      case "ArrowDown":
        headersRef.current[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        headersRef.current[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        headersRef.current[0]?.focus();
        break;
      case "End":
        headersRef.current[lastIndex]?.focus();
        break;
      case "Enter":
      case " ":
        toggle(id);
        break;
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      <div className="divide-y divide-gray-700 rounded-2xl overflow-hidden bg-[#121528] shadow-lg">
        {items.map((item, idx) => {
          const safeId = String(item.id);
          const expanded = isOpen(item.id);

          return (
            <div key={safeId}>
              <h3>
                <button
                  type="button"
                  ref={(el: HTMLButtonElement | null) => {
                    headersRef.current[idx] = el;
                  }}
                  id={`head-${safeId}`}
                  onKeyDown={(e) => onHeaderKeyDown(e, idx, item.id)}
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left px-6 py-8 sm:py-10 flex items-center justify-between transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg ${
                    expanded ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span className="font-semibold text-2xl sm:text-3xl text-white">
                    {item.title}
                  </span>
                  <svg
                    className={`w-6 h-6 text-white transform transition-transform duration-300 ${
                      expanded ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </h3>

              <div
                id={`sect-${safeId}`}
                role="region"
                aria-labelledby={`head-${safeId}`}
                hidden={!expanded}
                className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${
                  expanded
                    ? "max-h-[1000px] opacity-100 py-4"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <div className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
