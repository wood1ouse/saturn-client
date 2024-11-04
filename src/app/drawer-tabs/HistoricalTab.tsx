import React, { useEffect } from 'react';

import { StaticDateTimePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';
import styled from './_shared.ts';
import { px } from '../../utils/ui.ts';
import { Card, Collapse, IconButton, Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { AppDataSources } from '../../models/api.ts';
import UIStore from '../../store/UIStore.ts';
import { ExpandLessRounded, ExpandMoreRounded } from '@mui/icons-material';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import HistoricalStore from '../../store/HistoricalStore.ts';
import { FlightsHistoricalAPI } from '../../api/FlightsHistroicalAPI.ts';
import { FeatureCollection } from 'geojson';

const { TabContainer } = styled;

function toggleExpandDataSource(source: AppDataSources) {
  UIStore.toggleExpandDataSource(source);
}

function toggleLive(source: AppDataSources) {
  HistoricalStore.toggleLive(source);
}

function setTime(source: AppDataSources, time: number) {
  HistoricalStore.setTime(source, time);
}

function setHistoricalGeoJSON(source: AppDataSources, value: FeatureCollection) {
  HistoricalStore.setHistoricalGeoJSON(source, value);
}

export const HistoricalTab: React.FC = observer(() => {
  const { isDataSourceExpanded } = UIStore;
  const { source } = HistoricalStore;

  const { live, time, timestamps } = source(AppDataSources.OPEN_SKY_NETWORK);

  const allowedMoments = timestamps.map((ts) => moment(ts));

  const isDateAllowed = (date: Moment | null): boolean => {
    if (!date) return false;
    return allowedMoments.some((allowedDate) => allowedDate.isSame(date, 'day'));
  };

  const isTimeAllowed = (time: Moment | null, view: 'hours' | 'minutes' | 'seconds'): boolean => {
    if (!time) return false;
    return allowedMoments.some((allowedTime) => {
      if (view === 'hours') {
        return allowedTime.isSame(time, 'hour');
      } else if (view === 'minutes') {
        return allowedTime.isSame(time, 'hour') && allowedTime.isSame(time, 'minute');
      } else if (view === 'seconds') {
        return (
          allowedTime.isSame(time, 'hour') &&
          allowedTime.isSame(time, 'minute') &&
          allowedTime.isSame(time, 'second')
        );
      }
      return false;
    });
  };

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        setTime(AppDataSources.OPEN_SKY_NETWORK, Date.now());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [live]);

  return (
    <TabContainer>
      <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
        <Card sx={{ width: px(300) }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" p={1.5}>
            <IconButton onClick={() => toggleLive(AppDataSources.OPEN_SKY_NETWORK)}>
              {live ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
            </IconButton>
            <Stack direction="row" alignItems="center" p={1.5}>
              OpenSky API Network
            </Stack>
            <IconButton onClick={() => toggleExpandDataSource(AppDataSources.OPEN_SKY_NETWORK)}>
              {isDataSourceExpanded(AppDataSources.OPEN_SKY_NETWORK) ? (
                <ExpandLessRounded />
              ) : (
                <ExpandMoreRounded />
              )}
            </IconButton>
          </Stack>
          <Collapse
            in={isDataSourceExpanded(AppDataSources.OPEN_SKY_NETWORK)}
            timeout="auto"
            unmountOnExit>
            <StaticDateTimePicker
              value={moment(time)}
              disabled={live}
              views={['day', 'hours', 'minutes', 'seconds']}
              shouldDisableDate={(date) => !isDateAllowed(date)}
              shouldDisableTime={(time, view) => !isTimeAllowed(time, view)}
              disableFuture
              onAccept={async (value) => {
                if (value) {
                  const timestamp = value.unix() * 1000;
                  const result = await FlightsHistoricalAPI.getFlightPositionsForTime(timestamp);
                  setTime(AppDataSources.OPEN_SKY_NETWORK, timestamp);
                  setHistoricalGeoJSON(AppDataSources.OPEN_SKY_NETWORK, result);
                }
              }}
              sx={{
                p: 0,
                minWidth: 0
              }}
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
                },
                actionBar: {
                  sx: {
                    mr: px(24)
                  }
                }
              }}
            />
          </Collapse>
        </Card>
      </Stack>
    </TabContainer>
  );
});
