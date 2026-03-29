import Svg, { Path } from 'react-native-svg';
import { SvgIconProps } from 'types';

function BagIcon({ color = '#108910', size, height, width, ...props }: SvgIconProps) {
  return (
    <Svg
      width={width || size || 20}
      height={height || size || 22}
      viewBox="0 0 20 22"
      fill="none"
      {...props}>
      <Path
        d="M1.75019 19.555C2.95019 21 5.18219 21 9.64819 21H10.3682C14.8342 21 17.0672 21 18.2672 19.555M1.75019 19.555C0.550192 18.109 0.962191 15.915 1.78519 11.525C2.37019 8.405 2.66219 6.844 3.77319 5.922M18.2672 19.555C19.4672 18.109 19.0552 15.915 18.2322 11.525C17.6472 8.405 17.3542 6.844 16.2432 5.922M16.2432 5.922C15.1332 5 13.5442 5 10.3692 5H9.64719C6.47219 5 4.88419 5 3.77319 5.922"
        stroke={color}
        strokeWidth={1.5}
      />
      <Path
        d="M7.00781 5V4C7.00781 3.20435 7.32388 2.44129 7.88649 1.87868C8.4491 1.31607 9.21216 1 10.0078 1C10.8035 1 11.5665 1.31607 12.1291 1.87868C12.6917 2.44129 13.0078 3.20435 13.0078 4V5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default BagIcon;
