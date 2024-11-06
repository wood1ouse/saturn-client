import React, { useEffect } from 'react';
import moment, { Moment } from 'moment';

import { Card, Collapse, IconButton, Stack } from '@mui/material';
import { StaticDateTimePicker } from '@mui/x-date-pickers';

import { FeatureCollection } from 'geojson';

import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRounded from '@mui/icons-material/ExpandLessRounded';

import { px } from '../../utils/ui';
import { AppDataSources } from '../../models/api';
import UIStore from '../../store/UIStore';
import HistoricalStore from '../../store/HistoricalStore';
import { observer } from 'mobx-react';

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

interface Props {
  name: string;
  dataSource: AppDataSources;
  getTimePositions: (timestamp: number) => Promise<FeatureCollection>;
}

export const HistoricalTabItem: React.FC<Props> = observer(
  ({ name, dataSource, getTimePositions }) => {
    const { isDataSourceExpanded } = UIStore;
    const { source } = HistoricalStore;

    const { live, time, timestamps } = source(dataSource);

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
          setTime(dataSource, Date.now());
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [dataSource, live]);

    return (
      <Card sx={{ width: px(300) }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" p={1.5}>
          <IconButton onClick={() => toggleLive(dataSource)}>
            {live ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
          </IconButton>
          <Stack direction="row" alignItems="center" p={1.5}>
            {name}
          </Stack>
          <IconButton onClick={() => toggleExpandDataSource(dataSource)}>
            {isDataSourceExpanded(dataSource) ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          </IconButton>
        </Stack>
        <Collapse in={isDataSourceExpanded(dataSource)} timeout="auto" unmountOnExit>
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
                const result = await getTimePositions(timestamp);
                setTime(dataSource, timestamp);
                setHistoricalGeoJSON(dataSource, result);
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
    );
  }
);
