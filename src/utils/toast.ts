import { type ToastOptions, toast } from "react-toastify";

type NotifyOptions = ToastOptions;

export const notifySuccess = (message: string, options?: NotifyOptions) =>
  toast.success(message, options);

export const notifyError = (message: string, options?: NotifyOptions) =>
  toast.error(message, options);

export const notifyInfo = (message: string, options?: NotifyOptions) =>
  toast.info(message, options);
