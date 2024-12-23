import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const CalendarSvgComponent = ({
  className,
  desc = 'Calendar',
  descId = 'calendar',
}: Props) => (
  <svg
    className={className}
    aria-describedby={descId}
    width="25"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={descId}>{desc}</desc>}
    <path
      d="M1.25 7.5v10.625C1.25 19.16 2.09 20 3.125 20h11.047A6.874 6.874 0 0 1 17.5 7.527V7.5H1.25Z"
      fill="#C5C8D2"
    />
    <path
      d="M1.25 6.25V4.375c0-1.035.84-1.875 1.875-1.875H5V1.25C5 .559 5.559 0 6.25 0S7.5.559 7.5 1.25V2.5h5V1.25c0-.691.559-1.25 1.25-1.25S15 .559 15 1.25V2.5h1.875c1.035 0 1.875.84 1.875 1.875V6.25H1.25Z"
      fill="#013F9C"
    />
    <path
      d="M18.125 20a5.625 5.625 0 1 0 0-11.25 5.625 5.625 0 0 0 0 11.25Zm2.5-5h-5a.627.627 0 0 1-.625-.625c0-.344.281-.625.625-.625h5c.344 0 .625.281.625.625a.627.627 0 0 1-.625.625Z"
      fill="#E43131"
    />
  </svg>
);
export default CalendarSvgComponent;
