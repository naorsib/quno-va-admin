import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const SickLeaveSvgComponent = ({
  className,
  desc = 'Sick Leave',
  desc_id = 'sick_leave',
  height,
  width,
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      opacity=".4"
      d="M.75 2.75c0-1.379 1.121-2.5 2.5-2.5h12.5c1.379 0 2.5 1.121 2.5 2.5v8.75h-5c-.691 0-1.25.559-1.25 1.25v5H3.25a2.502 2.502 0 0 1-2.5-2.5V2.75Zm5 4.375v1.25c0 .344.281.625.625.625H8.25v1.875c0 .344.281.625.625.625h1.25a.627.627 0 0 0 .625-.625V9h1.875a.627.627 0 0 0 .625-.625v-1.25a.627.627 0 0 0-.625-.625H10.75V4.625A.627.627 0 0 0 10.125 4h-1.25a.627.627 0 0 0-.625.625V6.5H6.375a.627.627 0 0 0-.625.625Z"
      fill="#C5C8D2"
    />
    <path
      d="M8.25 4.625c0-.344.281-.625.625-.625h1.25c.344 0 .625.281.625.625V6.5h1.875c.344 0 .625.281.625.625v1.25a.627.627 0 0 1-.625.625H10.75v1.875a.627.627 0 0 1-.625.625h-1.25a.627.627 0 0 1-.625-.625V9H6.375a.627.627 0 0 1-.625-.625v-1.25c0-.344.281-.625.625-.625H8.25V4.625Z"
      fill="#E43131"
    />
    <path
      d="M12 12.75v5h.215a2.5 2.5 0 0 0 1.77-.73l3.535-3.536a2.5 2.5 0 0 0 .73-1.77V11.5h-5c-.691 0-1.25.559-1.25 1.25Z"
      fill="#F2F5F9"
    />
  </svg>
);
export default SickLeaveSvgComponent;
