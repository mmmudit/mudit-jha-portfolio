type DividerProps = {
  className?: string;
};

export function Divider({ className = "" }: DividerProps) {
  return <div className={`gradient-divider h-px w-full ${className}`} />;
}
