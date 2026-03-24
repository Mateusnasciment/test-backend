import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, value, onValueChange, children }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);

    React.useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (open && !(event.target as HTMLElement).closest('[data-select-container]')) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleSelect = (newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
      setOpen(false);
    };

    const toggleOpen = () => setOpen(!open);

    return (
      <div ref={ref} className={cn("relative", className)} data-value={selectedValue} data-select-container>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onSelect: handleSelect,
              open,
              setOpen,
              toggleOpen,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface SelectTriggerProps {
  children?: React.ReactNode;
  className?: string;
  open?: boolean;
  toggleOpen?: () => void;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, open, toggleOpen }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={toggleOpen}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", open && "rotate-180")} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectContentProps {
  children?: React.ReactNode;
  className?: string;
  onSelect?: (value: string) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, onSelect, open = true }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 mt-1",
          className
        )}
      >
        <div className="p-1">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onSelect,
              });
            }
            return child;
          })}
        </div>
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps {
  value: string;
  children?: React.ReactNode;
  className?: string;
  onSelect?: (value: string) => void;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, onSelect }, ref) => {
    const handleClick = () => {
      onSelect?.(value);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        onClick={handleClick}
        role="option"
      >
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-current" />
        </span>
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

const SelectValue = React.forwardRef<
  HTMLDivElement,
  { placeholder?: string; className?: string }
>(({ placeholder, className }, ref) => (
  <div ref={ref} className={className}>
    {placeholder}
  </div>
));
SelectValue.displayName = "SelectValue";

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };
