type DividerProps = {
  className?: string;
};

export function Divider({ className = "" }: DividerProps) {
  return <div aria-hidden="true" className={`gradient-divider h-px w-full ${className}`} />;
}
