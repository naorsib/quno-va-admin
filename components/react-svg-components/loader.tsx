import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const LoaderSvgComponent = ({
  className,
  desc = 'Loader',
  desc_id = 'loader',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="20"
    height="21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <path
      d="M11.875 2.375a1.875 1.875 0 1 0-3.75 0 1.875 1.875 0 0 0 3.75 0Zm0 16.25a1.875 1.875 0 1 0-3.75 0 1.875 1.875 0 0 0 3.75 0Zm-10-6.25a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM20 10.5a1.875 1.875 0 1 0-3.75 0 1.875 1.875 0 0 0 3.75 0ZM5.582 17.57a1.875 1.875 0 1 0-2.652-2.652 1.875 1.875 0 0 0 2.652 2.652Zm0-11.492A1.875 1.875 0 1 0 2.93 3.43a1.875 1.875 0 1 0 2.652 2.652v-.004Zm8.836 11.492a1.875 1.875 0 1 0 2.652-2.652 1.875 1.875 0 0 0-2.652 2.652Z"
      fill="#0167FF"
    />
  </svg>
);
export default LoaderSvgComponent;
