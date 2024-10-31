import { Button, styled, ToggleButton as MuiToggleButton } from '@mui/material';

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

export default {
  CollapseButton,
  ToggleButton
};
