import {
  styled,
  ToggleButton as MuiToggleButton,
  IconButton as MuiIconButton
} from '@mui/material';
import { px } from '../../../utils/ui';

const ToggleButton = styled(MuiToggleButton)`
  padding: ${px(24)};
  width: ${px(48)};
  height: ${px(48)};
`;

const ThemeButton = styled(MuiIconButton)`
  position: absolute;
  bottom: ${px(24)};
  width: ${px(42)};
  height: ${px(42)};
  right: ${px(12)};
`;

export default {
  ToggleButton,
  ThemeButton
};
