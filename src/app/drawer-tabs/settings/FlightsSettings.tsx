import React from 'react';
import { Slider, Typography } from '@mui/material';
import { observer } from 'mobx-react';

import LayersStore from '../../../store/LayerStore';

function changeFlightsOpacity(value: number) {
  LayersStore.changeFlightsOpacity(value);
}

export const FlightsSettings: React.FC = observer(() => {
  const { flightsOpacity } = LayersStore;

  return (
    <>
      <Typography mt={2}>Opacity</Typography>
      <Slider
        min={0.01}
        max={1}
        step={0.01}
        value={flightsOpacity}
        onChange={(_, value) => changeFlightsOpacity(value as number)}
        valueLabelDisplay="auto"
        getAriaValueText={(value) => (value * 100).toString()}
      />
    </>
  );
});
