import { Moment } from 'moment';

export const isDateAllowed = (allowed: Moment[], date: Moment | null): boolean => {
  if (!date) return false;
  return allowed.some((allowedDate) => allowedDate.isSame(date, 'day'));
};

export const isTimeAllowed = (
  allowed: Moment[],
  time: Moment | null,
  view: 'hours' | 'minutes' | 'seconds'
): boolean => {
  if (!time) return false;
  return allowed.some((allowedTime) => {
    if (view === 'hours') {
      return allowedTime.isSame(time, 'hour');
    } else if (view === 'minutes') {
      return allowedTime.isSame(time, 'hour') && allowedTime.isSame(time, 'minute');
    } else if (view === 'seconds') {
      return (
        allowedTime.isSame(time, 'hour') &&
        allowedTime.isSame(time, 'minute') &&
        allowedTime.isSame(time, 'second')
      );
    }
    return false;
  });
};
