import type { ReactElement } from "react";
import type { ModuloId } from "@/dominio/tipi";

export function Modulo({ modulo }: { modulo: ModuloId }): ReactElement {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        <span aria-hidden="true" className="text-accent">
          &gt;
        </span>{" "}
        Modulo {modulo.toUpperCase()}
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Il contenuto del modulo è in costruzione.
      </p>
    </div>
  );
}
