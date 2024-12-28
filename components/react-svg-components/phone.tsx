import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const PhoneSvgComponent = ({
  className,
  desc = 'Phone',
  desc_id = 'phone',
}: Props) => (
  <svg
    className={className}
    aria-describedby={desc_id}
    width="40"
    height="40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {<desc id={desc_id}>{desc}</desc>}
    <rect width="40" height="40" rx="20" fill="#52D147" />
    <g clipPath="url(#a)">
      <path
        d="M16.441 10.96a1.558 1.558 0 0 0-1.851-.905l-3.438.937A1.567 1.567 0 0 0 10 12.5C10 22.164 17.836 30 27.5 30c.703 0 1.32-.473 1.508-1.152l.937-3.438a1.558 1.558 0 0 0-.906-1.851l-3.75-1.563a1.558 1.558 0 0 0-1.809.453l-1.578 1.926a13.202 13.202 0 0 1-6.277-6.277l1.926-1.575a1.56 1.56 0 0 0 .453-1.808l-1.563-3.75v-.004Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" transform="translate(7.5 10)" d="M0 0h25v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default PhoneSvgComponent;
