import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  etichetta: string;
  /** Testo di aiuto sempre visibile. Sostituisce il placeholder, che sparisce mentre si scrive. */
  aiuto?: string;
  errore?: string;
}

export function Field({ etichetta, aiuto, errore, className, required, ...props }: FieldProps) {
  const id = useId();
  const idAiuto = `${id}-aiuto`;
  const idErrore = `${id}-errore`;

  // Collega input, aiuto ed errore: lo screen reader li legge insieme al campo
  const descrizioni = [aiuto && idAiuto, errore && idErrore].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-semibold text-ink">
        {etichetta}
        {required && (
          <span className="ml-1 text-accent-text">
            (obbligatorio)
          </span>
        )}
      </label>

      {aiuto && (
        <p id={idAiuto} className="text-sm text-muted">
          {aiuto}
        </p>
      )}

      <input
        id={id}
        required={required}
        aria-describedby={descrizioni || undefined}
        aria-invalid={errore ? true : undefined}
        className={cn(
          "min-h-11 rounded-brand border-2 bg-paper px-3 py-2 text-base text-ink",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-text",
          errore ? "border-[#B3261E]" : "border-muted",
          className,
        )}
        {...props}
      />

      {errore && (
        // role="alert" annuncia l'errore appena compare, senza spostare il focus
        <p id={idErrore} role="alert" className="text-sm font-medium text-[#B3261E]">
          {errore}
        </p>
      )}
    </div>
  );
}
