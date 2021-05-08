import * as React from "react";
import colors from "../config/colours";
import {
  // BallIndicator,
  // BarIndicator,
  DotIndicator,
  // MaterialIndicator,
  // PacmanIndicator,
  // PulseIndicator,
  // SkypeIndicator,
  // UIActivityIndicator,
  // WaveIndicator,
} from "react-native-indicators";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
export const Indicator = ({ size, visible }) =>
  visible || visible == null ? (
    <DotIndicator
      count={5}
      color={colors.pink}
      size={size != null ? size : wp(3)}
    />
  ) : null;
