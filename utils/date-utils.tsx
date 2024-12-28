import { format } from 'date-fns';

interface DateComponents {
  hour: string;
  day: string;
  month: string;
}

function getDateComponents(date: Date): DateComponents {
  return {
    hour: format(date, 'HH:mm'),
    day: format(date, 'do'),
    month: format(date, 'MMMM'),
  };
}

export function combineDates(initialDate: Date, overridingDate: Date) {
  const initial = getDateComponents(initialDate);
  const overriding = getDateComponents(overridingDate);

  let differences = 0;
  if (initial.hour !== overriding.hour) {
    differences++;
  }
  if (initial.day !== overriding.day) {
    differences++;
  }
  if (initial.month !== overriding.month) {
    differences++;
  }
  if (differences > 1) {
    return (
      <>
        <del>
          {initial.hour} {initial.day} {initial.month}
        </del>{' '}
        {overriding.hour} {overriding.day} {overriding.month}
      </>
    );
  }
  return (
    <>
      {initial.hour !== overriding.hour ? (
        <>
          {' '}
          <del>{initial.hour}</del> {overriding.hour}
        </>
      ) : (
        <>
          {' '}
          <>{initial.hour}</>
        </>
      )}
      {initial.day !== overriding.day ? (
        <>
          {' '}
          <del>{initial.day}</del> {overriding.day}
        </>
      ) : (
        <>
          {' '}
          <>{initial.day}</>
        </>
      )}
      {initial.month !== overriding.month ? (
        <>
          {' '}
          <del>{initial.month}</del> {overriding.month}
        </>
      ) : (
        <>
          {' '}
          <>{initial.month}</>
        </>
      )}
    </>
  );
}
