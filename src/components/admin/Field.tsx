type Props = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  className?: string;
};

export function Field({ label, name, defaultValue, type = "text", textarea, rows = 4, hint, className, ...rest }: Props) {
  const common = { name, defaultValue: defaultValue ?? "", className: "field", "data-testid": `field-${name}`, ...rest };
  return (
    <label className={className}>
      <span className="field-label">{label}</span>
      {textarea ? <textarea rows={rows} {...common} /> : <input type={type} {...common} />}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[var(--color-magenta)]" data-testid={`field-${name}`} />
      {label}
    </label>
  );
}

export function Select({ label, name, defaultValue, options, className }: { label: string; name: string; defaultValue?: string; options: { value: string; label: string }[]; className?: string }) {
  return (
    <label className={className}>
      <span className="field-label">{label}</span>
      <select name={name} defaultValue={defaultValue} className="field" data-testid={`field-${name}`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}