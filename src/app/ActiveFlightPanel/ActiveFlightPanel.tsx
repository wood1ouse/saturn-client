import {
  Box,
  Card,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react';
import React from 'react';
import FlightsStore from '../../store/FlightsStore';
import { px } from '../../utils/ui';
import { FlightsService } from '../../services/FlightsService';
import { FlightStateProperties } from '../../models/api';
import { UIService } from '../../services/UIService';
import UIStore from '../../store/UIStore';

function resetActiveFlight() {
  FlightsStore.resetActiveFlight();
}

export const ActiveFlightPanel: React.FC = observer(() => {
  const { activeFlight } = FlightsStore;
  const { theme } = UIStore;

  return (
    <Collapse
      in={!!activeFlight}
      timeout="auto"
      unmountOnExit
      sx={{ position: 'absolute', bottom: 0, right: 0 }}>
      <Card sx={{ p: 1.5, width: px(280) }}>
        <Stack alignItems="center" justifyContent="space-between">
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap={1.5}
              width="100%"
              ml={5}>
              {activeFlight?.properties.icao.toUpperCase() || 'Unknown'}
              <Box
                component="img"
                src={theme === 'dark' ? '/aircraft.png' : '/aircraft_light.png'}
                height={px(24)}
                width={px(24)}
                sx={{ rotate: '90deg' }}
              />
            </Stack>
            <IconButton onClick={resetActiveFlight}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ width: '100%', p: 1 }} />
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table size="small" aria-label="flight properties">
              <TableBody>
                {activeFlight &&
                  Object.entries(activeFlight.properties)
                    .filter(([key]) => key !== 'icao')
                    .map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {FlightsService.getFlightsPropertiesTableLabel(
                            key as keyof FlightStateProperties
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {key === 'last_contact' || key === 'time_position'
                            ? new Date(value * 1000).toLocaleTimeString()
                            : UIService.formatTableValue(value)}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Card>
    </Collapse>
  );
});
