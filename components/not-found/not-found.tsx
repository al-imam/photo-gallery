import style from "$components/not-found/not-found.module.css";
import { cn } from "$shadcn/utils";
import Link from "next/link";

export function NotFound({ home = "/" }) {
  return (
    <div
      className={cn(
        style["not-found"],
        "stop-dragging [--last-color:rgb(var(--foreground))]]  select-none bg-background font-display text-foreground [--svg-background-color:rgb(var(--background))] [--svg-background-opacity:var(--background)]"
      )}
    >
      <main className="relative -top-16">
        <div>
          <div>
            <span>404 error</span>
            <span>page not found</span>
          </div>
          <svg viewBox="0 0 200 600">
            <polygon points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514 200 591.044514 200 8"></polygon>
          </svg>
        </div>
        <svg className={style.crack} viewBox="0 0 200 600">
          <polyline points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514"></polyline>
        </svg>
        <div>
          <svg viewBox="0 0 200 600">
            <polygon points="118.302698 8 59.5369448 66.7657528 186.487016 193.715824 14 366.202839 153.491505 505.694344 68.1413353 591.044514 0 591.044514 0 8"></polygon>
          </svg>
          <div>
            <span>sorry about that!</span>
            <span>
              <Link href={home}>
                <b>return home?</b>
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
