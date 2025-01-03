import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const ClinicMenuSvgComponent = ({
  className,
  desc = 'Clinic',
  desc_id = 'clinic',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="20"
    height="22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      d="M19.995 8.98c0 .633-.521 1.129-1.111 1.129h-1.112l.025 5.63c.007 1.249-.99 2.261-2.223 2.261H4.448c-1.226 0-2.222-1.009-2.222-2.25V10.11H1.11A1.105 1.105 0 0 1 0 8.981c0-.317.104-.598.347-.844L9.251.281C9.494.035 9.77 0 10.015 0c.243 0 .52.07.729.246l3.702 3.294V2.25c0-.623.496-1.125 1.11-1.125h1.112c.615 0 1.111.502 1.111 1.125v4.253l1.834 1.63c.278.247.416.528.382.844v.004ZM9.445 6.75a.56.56 0 0 0-.555.562v1.687H7.223a.56.56 0 0 0-.556.563v1.124c0 .31.25.563.556.563H8.89v1.687c0 .31.25.562.555.562h1.111a.56.56 0 0 0 .556-.562v-1.687h1.667a.56.56 0 0 0 .556-.563V9.561a.56.56 0 0 0-.556-.563h-1.667V7.311a.56.56 0 0 0-.556-.562h-1.11Z"
      fill="currentColor"
    />
  </svg>
);
export default ClinicMenuSvgComponent;
