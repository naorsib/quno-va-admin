import { ComponentProps } from 'react';

import { SVGRProps } from '@/types';

type Props = ComponentProps<'div'> & SVGRProps;

const PrescriptionSvgComponent = ({
  className,
  desc = 'Prescription',
  desc_id = 'prescription',
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
      opacity="0.4"
      d="M0.25 5.125V8.25V9.5H1.5H7.75H9V8.25V5.125C9 2.70703 7.04297 0.75 4.625 0.75C2.20703 0.75 0.25 2.70703 0.25 5.125Z"
      fill="#C5C8D2"
    />
    <path
      d="M1.5 9.5H0.25V10.75V13.875C0.25 16.293 2.20703 18.25 4.625 18.25C7.04297 18.25 9 16.293 9 13.875V10.75V9.5H7.75H1.5Z"
      fill="#013F9C"
    />
    <path
      d="M16.5 18.25C13.0469 18.25 10.25 15.4531 10.25 12C10.25 10.8711 10.5508 9.8125 11.0742 8.89844C11.3516 8.41406 12.0039 8.38672 12.3945 8.77734L19.7227 16.1055C20.1133 16.5 20.082 17.1484 19.6016 17.4258C18.6875 17.9492 17.6289 18.25 16.5 18.25Z"
      fill="#C5C8D2"
    />
    <path
      d="M20.6055 15.2227L13.2773 7.89453C12.8867 7.5 12.918 6.85156 13.3984 6.57422C14.3125 6.05078 15.3711 5.75 16.5 5.75C19.9531 5.75 22.75 8.54688 22.75 12C22.75 13.1289 22.4492 14.1875 21.9258 15.1016C21.6484 15.5859 20.9961 15.6133 20.6055 15.2227Z"
      fill="#C5C8D2"
    />
  </svg>
);
export default PrescriptionSvgComponent;
