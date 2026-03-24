import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getProfessionalMonthlyAgenda } from "../services/professional.service";
import type { ProfessionalMonthlyAgendaData } from "../types/dashboard";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";

type ProfessionalAgendaContextValue = {
  data: ProfessionalMonthlyAgendaData | null;
  currentMonth: Date;
  selectedDate: string;
  loading: boolean;
  errorMessage: string | null;
  canGoPreviousMonth: boolean;
  canGoNextMonth: boolean;
  minAllowedDate: string;
  maxAllowedDate: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
  refreshMonth: () => Promise<void>;
  selectDate: (date: string) => void;
};

const ProfessionalAgendaContext = createContext<ProfessionalAgendaContextValue | undefined>(
  undefined,
);

const toMonthKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

const getMonthEnd = (date: Date): Date => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const addMonths = (date: Date, amount: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

const parseLocalDate = (value: string): Date => new Date(`${value}T12:00:00`);

const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const getTodayIso = (): string => {
  const today = new Date();
  return toIsoDate(today);
};

const isDateInMonth = (date: string, month: string): boolean => date.startsWith(`${month}-`);
const NAVIGATION_MONTH_LIMIT = 6;

const getDefaultSelectedDate = (data: ProfessionalMonthlyAgendaData): string => {
  const today = getTodayIso();
  if (isDateInMonth(today, data.referenceMonth)) {
    return today;
  }

  const firstBusyDay = data.days.find((day) => day.hasAppointments);
  return firstBusyDay?.date ?? data.startDate;
};

export const ProfessionalAgendaProvider = ({ children }: { children: React.ReactNode }) => {
  const currentMonthBase = getMonthStart(new Date());
  const minAllowedMonth = addMonths(currentMonthBase, -NAVIGATION_MONTH_LIMIT);
  const maxAllowedMonth = addMonths(currentMonthBase, NAVIGATION_MONTH_LIMIT);
  const minAllowedDate = toIsoDate(minAllowedMonth);
  const maxAllowedDate = toIsoDate(getMonthEnd(maxAllowedMonth));
  const [currentMonth, setCurrentMonth] = useState(() => getMonthStart(new Date()));
  const [data, setData] = useState<ProfessionalMonthlyAgendaData | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cacheRef = useRef(new Map<string, ProfessionalMonthlyAgendaData>());
  const requestIdRef = useRef(0);
  const canGoPreviousMonth = currentMonth.getTime() > minAllowedMonth.getTime();
  const canGoNextMonth = currentMonth.getTime() < maxAllowedMonth.getTime();

  const loadMonth = async (referenceDate: Date, forceRefresh = false) => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const monthKey = toMonthKey(referenceDate);
    const cachedData = cacheRef.current.get(monthKey);

    if (!forceRefresh && cachedData) {
      if (requestId !== requestIdRef.current) return;
      setData(cachedData);
      setSelectedDate((current) =>
        current && isDateInMonth(current, cachedData.referenceMonth)
          ? current
          : getDefaultSelectedDate(cachedData),
      );
      setErrorMessage(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const nextData = await getProfessionalMonthlyAgenda(monthKey);
      if (requestId !== requestIdRef.current) return;
      cacheRef.current.set(monthKey, nextData);
      setData(nextData);
      setSelectedDate((current) =>
        current && isDateInMonth(current, nextData.referenceMonth)
          ? current
          : getDefaultSelectedDate(nextData),
      );
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return;
      setData(null);
      setErrorMessage(
        getApiErrorMessage(error, "N\u00e3o foi poss\u00edvel carregar a agenda do m\u00eas."),
      );
    } finally {
      if (requestId !== requestIdRef.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMonth(currentMonth);
  }, [currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth((current) => {
      if (current.getTime() <= minAllowedMonth.getTime()) {
        return current;
      }

      return new Date(current.getFullYear(), current.getMonth() - 1, 1);
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((current) => {
      if (current.getTime() >= maxAllowedMonth.getTime()) {
        return current;
      }

      return new Date(current.getFullYear(), current.getMonth() + 1, 1);
    });
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(getMonthStart(new Date()));
  };

  const refreshMonth = async () => {
    cacheRef.current.delete(toMonthKey(currentMonth));
    await loadMonth(currentMonth, true);
  };

  const selectDate = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    if (date < minAllowedDate || date > maxAllowedDate) return;

    const targetMonth = getMonthStart(parseLocalDate(date));
    setSelectedDate(date);
    setCurrentMonth((current) => {
      if (targetMonth.getTime() < minAllowedMonth.getTime()) {
        return current;
      }

      if (targetMonth.getTime() > maxAllowedMonth.getTime()) {
        return current;
      }

      if (current.getTime() === targetMonth.getTime()) {
        return current;
      }

      return targetMonth;
    });
  };

  return (
    <ProfessionalAgendaContext.Provider
      value={{
        data,
        currentMonth,
        selectedDate,
        loading,
        errorMessage,
        canGoPreviousMonth,
        canGoNextMonth,
        minAllowedDate,
        maxAllowedDate,
        goToPreviousMonth,
        goToNextMonth,
        goToCurrentMonth,
        refreshMonth,
        selectDate,
      }}
    >
      {children}
    </ProfessionalAgendaContext.Provider>
  );
};

export const useProfessionalAgenda = () => {
  const context = useContext(ProfessionalAgendaContext);

  if (!context) {
    throw new Error("useProfessionalAgenda must be used within ProfessionalAgendaProvider.");
  }

  return context;
};
