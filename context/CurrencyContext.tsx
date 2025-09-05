import React, { createContext, useContext, useState } from 'react';

const rates = { USD: 1, EUR: 0.92, GBP: 0.79 } as const;
export type Currency = keyof typeof rates;

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: 'USD',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrency: () => {},
  format: (v: number) => `$${v.toFixed(2)}`,
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  const format = (value: number) => {
    const rate = rates[currency] ?? 1;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value * rate);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

