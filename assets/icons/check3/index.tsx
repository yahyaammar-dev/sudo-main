import Svg, { Path } from 'react-native-svg';
import { SvgIconProps } from 'types';

export default function Check3Icon({
  color = '#108910',
  size,
  height,
  width,
  ...props
}: SvgIconProps) {
  return (
    <Svg
      width={width || size || 20}
      height={height || size || 24}
      viewBox="0 0 20 24"
      fill="none"
      {...props}>
      <Path
        d="M15.25 3.25H19.625V23.375H0.375V3.25H4.75175V5H15.25V3.25ZM4.52075 12.6913L3.28175 13.9285L8.2325 18.8775L16.895 10.215L15.656 8.9795L8.2325 16.403L4.52075 12.6913ZM6.5 3.25V0.625H13.5V3.25H6.5Z"
        fill={color}
      />
    </Svg>
  );
}
