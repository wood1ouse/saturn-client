import { Box, Button, Container, Dialog, DialogTitle, Stack } from '@mui/material';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import UIStore from '../../store/UIStore';
import { AnalysisService } from '../../services/AnalysisService';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { px } from '../../utils/ui';
import { StaticDateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import AnalysisStore from '../../store/AnalysisStore';
import { AppDataSources } from '../../models/api';
import { isDateAllowed, isTimeAllowed } from '../../utils/time';
import HistoricalStore from '../../store/HistoricalStore';
import { FlightsAnalysisState } from '../../models/state';
import { FlightsHistoricalAPI } from '../../api/FlightsHistroicalAPI';

function closeAnalysisDialog() {
  UIStore.closeAnalysisDialog();
}

function addFlightsData(data: FlightsAnalysisState) {
  AnalysisStore.addFlightsData(data);
}

export const AnalysisDialog: React.FC = observer(() => {
  const [dateTime, setDateTime] = useState(moment(Date.now()));
  const { getSourceData } = AnalysisStore;

  const { source: getSourceHistoricalData } = HistoricalStore;

  const { timestamps } = getSourceHistoricalData(AppDataSources.OPEN_SKY_NETWORK);

  const allowedMoments = timestamps.map((ts) => moment(ts));

  const data = getSourceData(AppDataSources.OPEN_SKY_NETWORK);

  const {
    analysisDialogState: { open, source }
  } = UIStore;

  return (
    source === AppDataSources.OPEN_SKY_NETWORK && (
      <Dialog
        keepMounted={false}
        open={open}
        onClose={closeAnalysisDialog}
        PaperProps={{
          sx: {
            minHeight: '70vh',
            minWidth: '80vw'
          }
        }}>
        <DialogTitle>{AnalysisService.getDialogTitleBySource(source)}</DialogTitle>
        <Stack direction="row" height="70vh" pt={7}>
          <ResponsiveContainer height="85%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time_position"
                tickFormatter={(datetime) => new Date(datetime * 1000).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" name="Velocity" dataKey="velocity" stroke="#8884d8" />
              <Line type="monotone" name="True Track" dataKey="true_track" stroke="#82ca9d" />
              <Line
                type="monotone"
                name="Barometric Altitude"
                dataKey="baro_altitude"
                stroke="#f58442"
              />
            </LineChart>
          </ResponsiveContainer>
          <Box>
            <StaticDateTimePicker
              value={moment(dateTime)}
              onChange={(value) => {
                if (value) {
                  setDateTime(value);
                }
              }}
              views={['day', 'hours', 'minutes', 'seconds']}
              shouldDisableDate={(date) => !isDateAllowed(allowedMoments, date)}
              shouldDisableTime={(time, view) => !isTimeAllowed(allowedMoments, time, view)}
              disableFuture
              sx={{
                p: 0,
                minWidth: 0
              }}
              slotProps={{
                layout: {
                  sx: {
                    background: 'transparent',
                    maxWidth: px(320)
                  }
                },
                toolbar: {
                  sx: {
                    pt: 0,
                    maxWidth: px(320)
                  }
                },
                actionBar: {
                  actions: [],
                  sx: {
                    mr: px(24)
                  }
                }
              }}
            />
            <Container
              onClick={async () => {
                const timestamp = dateTime.unix() * 1000;

                const result = await FlightsHistoricalAPI.getFlightPositionsForTime(timestamp);

                const { velocity, true_track, time_position, baro_altitude, vertical_rate } =
                  result.features[0].properties;

                addFlightsData({
                  velocity,
                  true_track,
                  time_position,
                  baro_altitude,
                  vertical_rate
                });
              }}
              sx={{ p: 4.5 }}>
              <Button fullWidth variant="contained">
                Add Timestamp
              </Button>
            </Container>
          </Box>
        </Stack>
      </Dialog>
    )
  );
});
