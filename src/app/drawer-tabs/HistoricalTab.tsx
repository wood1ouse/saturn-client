import React from 'react';

import { StaticDateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import styled from './_shared.ts';
import { px } from '../../utils/ui.ts';

const { TabContainer } = styled;

export const HistoricalTab: React.FC = () => {
  return (
    <TabContainer>
      <StaticDateTimePicker
        defaultValue={moment(new Date())}
        views={['day', 'hours', 'seconds']}
        sx={{
          p: 0,
          minWidth: 0
        }}
        disableFuture
        slotProps={{
          layout: {
            sx: {
              maxWidth: px(320)
            }
          },
          toolbar: {
            sx: {
              pt: 0,
              maxWidth: px(320)
            }
          }
        }}
      />
    </TabContainer>
  );
};
