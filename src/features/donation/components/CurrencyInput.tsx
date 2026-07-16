"use client";

import React, { forwardRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  readonly value?: number;
  readonly onChange?: (value: number) => void;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
      if (value === undefined || value === 0) {
        setDisplayValue("");
      } else {
        setDisplayValue(new Intl.NumberFormat("id-ID").format(value));
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "");
      if (rawValue === "") {
        setDisplayValue("");
        onChange?.(0);
        return;
      }

      const numericValue = parseInt(rawValue, 10);
      setDisplayValue(new Intl.NumberFormat("id-ID").format(numericValue));
      onChange?.(numericValue);
    };

    return (
      <div className="relative flex items-center w-full">
        <span className="absolute left-3 text-muted-foreground text-sm font-medium">Rp</span>
        <Input
          type="text"
          className={`pl-9 text-right font-medium ${className}`}
          value={displayValue}
          onChange={handleInputChange}
          ref={ref}
          placeholder="0"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
