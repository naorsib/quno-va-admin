import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const LogoutSvgComponent = ({
  className,
  desc = 'Logout',
  desc_id = 'logout',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="16"
    height="14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      d="M11 12h2c.553 0 1-.447 1-1V3c0-.553-.447-1-1-1h-2a.999.999 0 1 1 0-2h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-2a.999.999 0 1 1 0-2Zm-6.81-.31L.354 7.854A1.212 1.212 0 0 1 0 7c0-.319.128-.628.353-.853l3.838-3.838A1.06 1.06 0 0 1 6 3.06V5h3.999c.553 0 1 .447 1 1v2c0 .553-.447 1-1 1H6v1.94a1.06 1.06 0 0 1-1.81.75Z"
      fill="currentColor"
    />
  </svg>
);
export default LogoutSvgComponent;
