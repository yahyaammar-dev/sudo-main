import Svg, { Path } from 'react-native-svg';
import { SvgIconProps } from 'types';

export default function Shipping({
  color = '#108910',
  size,
  height,
  width,
  ...props
}: SvgIconProps) {
  return (
    <Svg
      width={width || size || 28}
      height={height || size || 28}
      viewBox="0 0 28 28"
      fill="none"
      {...props}>
      <Path d="M19.25 1.75H8.75V6.81067L14 5.06069L19.25 6.81069V1.75Z" fill={color} />
      <Path
        d="M14 8.75L3.5 12.25L5.25 22.75H1.75V26.25H5.58701L9.625 24.6347L14 26.3847L18.375 24.6347L22.4129 26.25H26.25V22.75H22.75L24.5 12.25L14 8.75Z"
        fill={color}
      />
    </Svg>
  );
}
