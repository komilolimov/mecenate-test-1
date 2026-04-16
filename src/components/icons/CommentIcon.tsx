import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={15}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      fill="#57626F"
      d="M15 6.094c0 3.366-3.357 6.093-7.5 6.093a8.97 8.97 0 0 1-3.05-.524 8.678 8.678 0 0 1-1.59.897c-.704.304-1.55.565-2.391.565a.47.47 0 0 1-.334-.8l.009-.009.038-.04a5.649 5.649 0 0 0 .589-.8c.292-.487.57-1.125.626-1.843C.52 8.637 0 7.415 0 6.093 0 2.729 3.357 0 7.5 0S15 2.728 15 6.094Z"
    />
  </Svg>
)
export default SvgComponent
