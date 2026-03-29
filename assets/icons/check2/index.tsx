import Svg, { Path } from 'react-native-svg';
import { SvgIconProps } from 'types';

export default function Check2Icon({
  color = '#108910',
  size,
  height,
  width,
  ...props
}: SvgIconProps) {
  return (
    <Svg
      width={width || size || 28}
      height={height || size || 25}
      viewBox="0 0 28 25"
      fill="none"
      {...props}>
      <Path
        d="M10.9466 24.1614L0 11.2203L5.95081 6.1855L11.2845 12.4871L22.348 0.838867L28 6.21149L10.9466 24.1614Z"
        fill={color}
      />
    </Svg>
  );
}
