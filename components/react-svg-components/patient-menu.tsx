import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const PatientMenuSvgComponent = ({
  className,
  desc = 'Patient',
  desc_id = 'patient',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="20"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      d="M9 10A4.8 4.8 0 1 0 9 .4 4.8 4.8 0 0 0 9 10Zm-1.714 1.8A6.685 6.685 0 0 0 .6 18.486c0 .615.499 1.114 1.114 1.114h14.572c.615 0 1.114-.499 1.114-1.114a6.685 6.685 0 0 0-6.686-6.686H7.286Z"
      fill="currentColor"
    />
  </svg>
);
export default PatientMenuSvgComponent;
