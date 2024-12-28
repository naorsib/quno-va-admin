import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const DialSvgComponent = ({
  className,
  desc = 'Dial',
  desc_id = 'dial',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="16"
    height="16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      d="M5.153.77A1.246 1.246 0 0 0 3.672.043l-2.75.75C.378.944 0 1.438 0 2c0 7.732 6.269 14 14 14 .563 0 1.056-.378 1.206-.921l.75-2.75a1.246 1.246 0 0 0-.725-1.482l-3-1.25a1.246 1.246 0 0 0-1.447.363L9.522 11.5A10.561 10.561 0 0 1 4.5 6.478L6.04 5.22c.429-.35.576-.937.363-1.447l-1.25-3V.77Z"
      fill="currentColor"
    />
  </svg>
);
export default DialSvgComponent;
