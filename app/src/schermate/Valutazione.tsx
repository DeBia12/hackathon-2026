import type { ReactElement } from "react";

export function Valutazione({
  momento,
}: {
  momento: "iniziale" | "finale";
}): ReactElement {
  const titolo =
    momento === "iniziale" ? "Cosa sai già" : "Cosa hai imparato";

  return (
    <div className="py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        {titolo}
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        La schermata di valutazione{" "}
        {momento === "iniziale" ? "iniziale" : "finale"} è in costruzione.
      </p>
    </div>
  );
}
