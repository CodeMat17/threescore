/**
 * Inline validation message, linked to its control via `aria-describedby`
 * (see `fieldProps` in `lib/validation.ts`). Errors previously only appeared
 * as a toast, which is transient and not announced with the field.
 */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${id}-error`} className='mt-1.5 text-sm text-destructive'>
      {message}
    </p>
  );
}
