const CircularSVGAnimation = () => {
  return (
    <div className="absolute top-0 flex h-full w-full items-center justify-center blur-3xl">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <style>
          {`
             
              .animate-circular {
                transform-origin: center;
                transform-box: fill-box;
              }
            `}
        </style>
        <path
          className="animate-circular animate-circular-motion-fastest"
          opacity="0.7"
          d="M115.895 544.438C138.793 452.044 256.074 412.406 311.643 426.921C342.36 434.945 379.331 481.409 364.141 515.129C345.152 557.278 324.209 569.84 275.9 580.168C227.592 590.496 246.301 636.833 237.924 670.608C229.546 704.384 177.049 716.945 149.683 691.544C122.318 666.142 92.9972 636.833 115.895 544.438Z"
          fill="#00AEFF"
        />
        <path
          className="animate-circular animate-circular-motion-fast"
          opacity="0.7"
          d="M1201.95 106.294C1222.2 24.7503 1325.95 -10.2322 1375.11 2.57827C1402.28 9.65943 1434.99 50.667 1421.55 80.4268C1404.75 117.627 1386.22 128.713 1343.49 137.828C1300.75 146.943 1317.3 187.838 1309.89 217.647C1302.48 247.456 1256.04 258.542 1231.84 236.124C1207.63 213.705 1181.69 187.838 1201.95 106.294Z"
          fill="#608AAB"
        />
        <path
          className="animate-circular animate-circular-motion-faster"
          opacity="0.7"
          d="M1063.36 137.149C1079.22 73.3611 1160.41 45.9958 1198.88 56.0169C1220.15 61.5562 1245.74 93.6347 1235.23 116.915C1222.08 146.014 1207.58 154.686 1174.14 161.817C1140.69 168.947 1153.64 200.938 1147.84 224.256C1142.04 247.575 1105.7 256.247 1086.75 238.71C1067.81 221.173 1047.51 200.938 1063.36 137.149Z"
          fill="#00BDC0"
        />
        <path
          className="animate-circular animate-circular-motion-normal"
          opacity="0.7"
          d="M1386.36 776.085C1567.92 677.047 1556.64 566.156 1541.38 395.394C1468.43 307.561 1378.94 352.205 1283.43 403.371C1187.92 454.536 1213.12 518.85 1145.67 603.797C1078.22 688.745 1204.8 875.123 1386.36 776.085Z"
          fill="#E5B169"
        />
        <path
          className="animate-circular animate-circular-motion-slow"
          opacity="0.4"
          d="M306.918 926.428C569.077 908.642 614.901 774.473 687.904 568.99C650.296 428.633 523.29 432.577 385.874 440.853C248.457 449.13 243.426 536.881 120.475 599.142C-2.47693 661.402 44.7584 944.214 306.918 926.428Z"
          fill="#4D48E7"
        />
      </svg>
    </div>
  );
};

export default CircularSVGAnimation;
