import { redirect } from 'next/navigation';

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: 'error' | 'success',
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export const parsePhone = (phone: string) => {
  return phone.replace(/(\d{1,2})(\d{3,4})(\d{3})(\d{4})/, '$1 $2 $3 $4');
};

export const secondsFromDate = (date: Date) => {
  const now = new Date();
  const milliDiff: number = now.getTime() - date.getTime();

  return Math.abs(Math.floor(milliDiff / 1000));
};

export const secondsToTime = (seconds?: number) => {
  if (!seconds) return '00:00';
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}
      :${(seconds % 60).toString().padStart(2, '0')}`;
};

export function genRandomListItem<T extends any>(list?: T[]): T | undefined {
  if (!list || list.length == 0) {
    return;
  }
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
