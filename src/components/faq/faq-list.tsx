import type { FaqItem } from "@/types/content";
import * as Accordion from "@radix-ui/react-accordion";
import clsx from "clsx";

interface FaqListProps {
  items: FaqItem[];
}

export function FaqList({ items }: FaqListProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className="flex flex-col gap-4"
    >
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          className="overflow-hidden rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark"
        >
          <Accordion.Header>
            <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-5 text-left text-lg font-semibold text-text dark:text-text-dark">
              {item.question}
              <span
                className={clsx(
                  "material-symbols-outlined text-2xl text-muted transition-transform duration-300",
                  "data-[state=open]:rotate-180",
                )}
              >
                expand_more
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="px-6 pb-6 text-base text-muted dark:text-muted-dark">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
