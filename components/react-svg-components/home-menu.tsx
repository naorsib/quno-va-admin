import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const HomeMenuSvgComponent = ({
  className,
  desc = 'Home',
  desc_id = 'home',
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
      d="M19.995 8.982c0 .633-.521 1.129-1.111 1.129h-1.112l.025 5.632c0 .095-.007.19-.018.285v.566c0 .777-.621 1.406-1.389 1.406h-.555c-.039 0-.077 0-.115-.003-.049.003-.097.003-.146.003H13.612c-.767 0-1.389-.63-1.389-1.406V13.5c0-.622-.496-1.125-1.11-1.125H8.89c-.615 0-1.112.503-1.112 1.125v3.094C7.778 17.37 7.157 18 6.39 18H4.448c-.052 0-.104-.003-.156-.007a1.496 1.496 0 0 1-.125.007h-.556c-.767 0-1.389-.63-1.389-1.406v-3.938c0-.031 0-.067.004-.098V10.11H1.11A1.105 1.105 0 0 1 0 8.982c0-.316.104-.597.347-.843L9.251.28C9.494.035 9.77 0 10.015 0c.243 0 .52.07.729.246l8.869 7.893c.278.246.416.527.382.843Z"
      fill="currentColor"
    />
  </svg>
);
export default HomeMenuSvgComponent;
