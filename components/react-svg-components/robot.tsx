import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const RobotSvgComponent = ({
  className,
  desc = 'Robot',
  desc_id = 'robot',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="18"
    height="14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      d="M9 0c.484 0 .875.391.875.875v1.75h3.281c1.088 0 1.969.88 1.969 1.969v7.437c0 1.088-.88 1.969-1.969 1.969H4.844a1.968 1.968 0 0 1-1.969-1.969V4.594c0-1.089.88-1.969 1.969-1.969h3.281V.875C8.125.391 8.516 0 9 0ZM5.937 10.5a.439.439 0 0 0-.437.438c0 .24.197.437.438.437h.875a.439.439 0 0 0 0-.875h-.875Zm2.625 0a.439.439 0 0 0-.437.438c0 .24.197.437.438.437h.874a.439.439 0 0 0 0-.875h-.874Zm2.626 0a.439.439 0 0 0-.438.438c0 .24.197.437.438.437h.874a.439.439 0 0 0 0-.875h-.874ZM7.467 7a1.094 1.094 0 1 0-2.187 0A1.094 1.094 0 0 0 7.47 7Zm4.157 1.094a1.094 1.094 0 1 0 0-2.188 1.094 1.094 0 0 0 0 2.188ZM1.562 6.125H2v5.25h-.438A1.313 1.313 0 0 1 .25 10.062V7.438c0-.725.588-1.313 1.313-1.313Zm14.876 0c.724 0 1.312.588 1.312 1.313v2.625c0 .724-.588 1.312-1.313 1.312H16v-5.25h.438Z"
      fill="#EEF9F7"
    />
  </svg>
);
export default RobotSvgComponent;
