/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { forwardRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, onValueChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    // Format number ke Rupiah display
    const formatCurrency = (num: number): string => {
      if (isNaN(num) || num === 0) return "";
      return new Intl.NumberFormat("id-ID").format(num);
    };

    // Parse display value ke number
    const parseValue = (str: string): number => {
      const cleaned = str.replace(/\D/g, "");
      return cleaned ? parseInt(cleaned, 10) : 0;
    };

    // Update display saat value prop berubah
    useEffect(() => {
      if (value !== undefined) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDisplayValue(formatCurrency(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const numericValue = parseValue(input);

      // Update display dengan format
      setDisplayValue(formatCurrency(numericValue));

      // Trigger callbacks
      onChange?.(numericValue as any);
      onValueChange?.(numericValue);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Re-format on blur untuk ensure consistency
      const numericValue = parseValue(e.target.value);
      setDisplayValue(formatCurrency(numericValue));
      props.onBlur?.(e);
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
          Rp
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn("pl-10", className)}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
