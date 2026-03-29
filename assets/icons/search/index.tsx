import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { SvgIconProps } from 'types';

export default function SearchIcon({ color, ...props }: SvgIconProps) {
  return (
    <Svg
      {...props}
      width={props.width || props.size || 20}
      height={props.height || props.size || 20}
      viewBox="0 0 20 20"
      fill="none">
      <G clipPath="url(#clip0_4168_671)">
        <Path
          d="M18.4262 17.3283L14.2223 12.8909C15.266 11.53 15.8944 9.80088 15.8944 7.91758C15.8944 3.55262 12.5297 0.000976562 8.39443 0.000976562C4.25921 0.000976562 0.894531 3.55258 0.894531 7.91754C0.894531 12.2825 4.25925 15.8341 8.39447 15.8341C10.1787 15.8341 11.8168 15.1708 13.106 14.0692L17.3099 18.5066C17.4638 18.6691 17.6659 18.7508 17.868 18.7508C18.0702 18.7508 18.2723 18.6691 18.4262 18.5066C18.7349 18.1808 18.7349 17.6541 18.4262 17.3283ZM8.39447 14.1675C5.12923 14.1675 2.47348 11.3642 2.47348 7.91754C2.47348 4.47089 5.12923 1.6676 8.39447 1.6676C11.6597 1.6676 14.3155 4.47089 14.3155 7.91754C14.3155 11.3642 11.6597 14.1675 8.39447 14.1675Z"
          fill={color || '#868889'}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_4168_671">
          <Rect
            width="18.9474"
            height={props.height || props.size || 20}
            fill={props.fill || 'white'}
            transform="translate(0.894531)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
