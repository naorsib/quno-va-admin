import * as React from 'react';
import { ComponentProps } from 'react';
interface SVGRProps {
  desc?: string;
  descId?: string;
}

type Props = ComponentProps<'div'> & SVGRProps;

const LogoSvgComponent = ({
  className,
  desc = 'Logo',
  descId = 'quno_logo',
}: Props) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width={221}
    height={35}
    fill="none"
    aria-describedby={descId}
  >
    {<desc id={descId}>{desc}</desc>}
    <g clipPath="url(#a)">
      <path
        fill="currentColor"
        d="M17.56.012C7.86.012 0 7.809 0 17.426S7.861 34.84 17.56 34.84c9.698 0 17.56-7.797 17.56-17.415 0-9.62-7.864-17.414-17.56-17.414Zm-.009 28.353c-5.989 0-10.846-4.816-10.846-10.757 0-5.942 4.855-10.757 10.846-10.757s10.846 4.815 10.846 10.757c0 5.941-4.855 10.757-10.846 10.757Zm22.651-6.721s.003.266.003 0V10.97c-.002-.047-.007-.092-.007-.139 0-.046.005-.091.007-.138l.024-.31a3.61 3.61 0 0 1 3.59-3.145 3.61 3.61 0 0 1 3.592 3.146l.013.115c.01.11.017.22.017.332 0 .112-.007.224-.017.333v10.374s.012.1 0 .21v2.159c0 .666.122 1.333.405 1.94.591 1.268 1.805 2.325 4.21 2.325 3.203 0 4.167-2.437 4.428-4.38V10.97a7.638 7.638 0 0 1 0-.279l.024-.31a3.61 3.61 0 0 1 3.59-3.145 3.613 3.613 0 0 1 3.593 3.146h.014v.115c.01.11.017.22.017.333 0 .112-.007.224-.017.332v12.05c-.042 1.33-.012 1.625-.067 2.114l-.043.696c-.48 5.09-4.622 8.864-11.675 8.864-7.052 0-11.25-3.11-11.484-8.864-.182-1.13-.22-4.379-.22-4.379l.003.002Zm51.591-1.691-.028-.669.007-2.447s.75-11.076-11.502-11.076c-9.388 0-11.882 5.805-11.882 9.196 0 0-.101 2.445-.08 2.535V29.82a3.324 3.324 0 0 0-.001.665l.014.115a3.61 3.61 0 0 0 3.59 3.146 3.61 3.61 0 0 0 3.592-3.146l.01-.105.013-.202c.002-.047.007-.092.007-.139 0-.047-.005-.092-.007-.139V17.32c0-2.011 1.403-4.491 4.743-4.491 3.55 0 4.364 2.625 4.384 4.678l.024 1.736a.348.348 0 0 0 0 .082l-.11 10.495a3.607 3.607 0 0 0 0 .665v.115h.014a3.61 3.61 0 0 0 3.591 3.146 3.61 3.61 0 0 0 3.591-3.146h.024v-.309c.001-.047.006-.092.006-.139 0-.046-.005-.091-.006-.138v-10.06h.006Zm41.911 6.145c.698 0 1.175.355 1.822 1.317 1.193 1.842 2.981 2.72 5.502 2.72 3.202 0 5.143-1.403 5.143-3.768 0-1.942-1.227-3.175-3.832-3.869l-3.918-1.048c-3.731-.996-5.603-3.023-5.603-6.082 0-3.97 3.218-6.638 7.987-6.638 2.419 0 4.582.71 6.047 1.993 1.141 1.013 1.771 2.197 1.771 3.311 0 .811-.511 1.353-1.294 1.353-.681 0-1.124-.305-1.414-.98-.767-1.875-2.674-3.04-5.042-3.04-3.015 0-4.956 1.486-4.956 3.784 0 1.723 1.157 2.957 3.338 3.53l3.866 1.048c4.172 1.115 6.03 3.057 6.03 6.318 0 4.138-3.202 6.723-8.312 6.723-2.742 0-5.126-.743-6.574-2.044-1.227-1.098-1.857-2.196-1.857-3.209 0-.844.528-1.419 1.294-1.419h.002Zm29.356 6.672c-5.57 0-8.807-3.446-8.807-8.547V10.675c0-.996.563-1.621 1.481-1.621.919 0 1.499.625 1.499 1.621v13.548c0 3.615 2.264 5.895 5.825 5.895 3.561 0 5.843-2.298 5.843-5.895V10.675c0-.996.563-1.621 1.481-1.621.918 0 1.498.625 1.498 1.621v13.617c0 5.067-3.542 8.48-8.823 8.48l.003-.002Zm15.254-1.942V10.675c0-.996.563-1.621 1.481-1.621.919 0 1.499.625 1.499 1.621v20.153c0 .996-.58 1.622-1.499 1.622-.918 0-1.481-.626-1.481-1.622Zm14.265 0V11.857h-5.706c-.937 0-1.533-.49-1.533-1.3 0-.811.596-1.334 1.533-1.334h14.41c.92 0 1.517.523 1.517 1.333 0 .81-.597 1.3-1.517 1.3h-5.723v18.972c0 .996-.579 1.622-1.498 1.622-.918 0-1.481-.626-1.481-1.622h-.002Zm14.284-19.107c0-1.79.784-2.5 2.742-2.5h9.878c.92 0 1.517.506 1.517 1.317 0 .81-.597 1.317-1.517 1.317h-9.657v7.366h9.061c.92 0 1.498.49 1.498 1.3s-.58 1.284-1.498 1.284h-9.061v7.838h9.657c.92 0 1.517.523 1.517 1.334 0 .81-.597 1.3-1.533 1.3h-9.862c-1.958 0-2.742-.71-2.742-2.5V11.721Zm-96.61-5.497c-7.969 0-14.428 6.406-14.428 14.31 0 7.904 6.459 14.31 14.428 14.31 7.969 0 14.429-6.406 14.429-14.31 0-7.903-6.46-14.31-14.429-14.31Zm-.163 21.942c-4.161 0-7.533-3.345-7.533-7.471 0-4.127 3.372-7.471 7.533-7.471 4.16 0 7.532 3.344 7.532 7.47 0 4.127-3.372 7.472-7.532 7.472Z"
      />
      <path
        fill="#24C5BC"
        d="M33.579 30.322h-4.173a14.02 14.02 0 0 0 1.758-1.782c2.786-3.366 4.206-8.143 3.975-11.597-.232-3.453-.696-7.31-5.483-12.173C24.873-.087 18.106 0 18.092 0c-1.92 0-3.475 1.543-3.475 3.445s1.441 3.324 3.26 3.434v.02s4.816-.056 8.065 3.885c3.092 3.75 2.618 8.748 1.653 10.848-1.524 3.321-3.792 4.86-4.87 5.44v-7.6a2.348 2.348 0 0 0-2.358-2.339 2.35 2.35 0 0 0-2.358 2.338v12.845a2.309 2.309 0 0 0-.028.344 2.348 2.348 0 0 0 2.357 2.338h13.24a2.348 2.348 0 0 0 2.358-2.338 2.35 2.35 0 0 0-2.357-2.338Zm30.143-19.298c.005-.08.011-.158.011-.239 0-1.99-1.626-3.603-3.633-3.603s-3.633 1.613-3.633 3.603c0 .024.003.045.003.069v12.179c0 .034-.005.067-.005.102 0 1.979 1.618 3.585 3.615 3.585a3.593 3.593 0 0 0 3.613-3.553h.029V11.024Zm60.852 7.766c-.039-.47-.381-3.728-2.637-6.663-1.935-2.517-3.408-3.598-5.762-4.678-3.593-1.648-7.138-1.193-7.138-1.193v.025c-1.756.207-3.12 1.69-3.12 3.488 0 1.942 1.588 3.517 3.546 3.517.207 0 .409-.022.607-.056.829-.04 2.743.08 4.76 1.677 2.58 2.04 2.722 4.857 2.722 4.857h.008a3.533 3.533 0 0 0 3.51 3.05c1.959 0 3.546-1.574 3.546-3.516 0-.174-.017-.343-.042-.51v.002ZM89.562 9.528c-3.046-3.523-6.034-3.603-7.932-3.73-1.119-.075-1.907-.049-2.437.007-1.868.107-3.35 1.64-3.35 3.52 0 1.88 1.594 3.53 3.56 3.53.057 0 .114-.007.17-.009v.012s1.183-.146 2.6.307c.881.281 1.953 1.386 2.21 2.5.331 1.425.297 3.58.297 3.58h.02a3.53 3.53 0 0 0 3.534 3.285c1.881 0 3.546-1.575 3.546-3.517 0 0 .63-6.192-2.216-9.483l-.002-.002Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h221v35H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default LogoSvgComponent;
