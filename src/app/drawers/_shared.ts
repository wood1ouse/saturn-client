import styled from '@emotion/styled';
import { Button } from '@mui/material';

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

export default {
  CollapseButton
};
