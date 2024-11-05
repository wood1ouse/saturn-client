import {
  Button,
  styled,
  ToggleButton as MuiToggleButton,
  IconButton as MuiIconButton
} from '@mui/material';
import { px } from '../../utils/ui';

const CollapseButton = styled(Button)`
  position: absolute;
  top: 90%;
  transition: 0.21s all;
  right: 12px;
  min-width: 24px;
  min-height: 24px;
  padding: 8px;
  rotate: -90deg;
  border-radius: 50%;
`;

const ToggleButton = styled(MuiToggleButton)`
  padding: 24px;
  width: 48px;
  height: 48px;
`;

const ThemeButton = styled(MuiIconButton)`
  position: absolute;
  bottom: ${px(24)};
  width: ${px(42)};
  height: ${px(42)};
  right: ${px(12)};
`;

export default {
  CollapseButton,
  ToggleButton,
  ThemeButton
};
