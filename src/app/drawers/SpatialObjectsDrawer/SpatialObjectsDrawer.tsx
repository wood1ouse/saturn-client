import { Box, Card, Drawer, IconButton, Stack, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';

import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

import UIStore from '../../../store/UIStore';
import { px } from '../../../utils/ui';
import SpatialObjectStore from '../../../store/SpatialObjectStore';

import sharedStyled from '../_shared';
import { SpatialObjectsService } from '../../../services/SpatialObjectsService';
import { useMap } from 'react-map-gl';
import center from '@turf/center';

function handleDrawerToggle(value: boolean): void {
  UIStore.setIsSpatialObjectsDrawerOpened(value);
}

function changeSpatialObjectName(id: string, name: string) {
  SpatialObjectStore.changeSpatialObjectName(id, name);
}

function toggleSpatialObjectEditMode(id: string) {
  SpatialObjectStore.toggleSpatialObjectEditMode(id);
}

const { CollapseButton } = sharedStyled;

export const SpatialObjectsDrawer: React.FC = observer(() => {
  const { isSpatialObjectsDrawerOpened } = UIStore;
  const { objects } = SpatialObjectStore;

  const { current: map } = useMap();

  return (
    <Box>
      <Drawer
        anchor="right"
        variant="permanent"
        open={isSpatialObjectsDrawerOpened}
        PaperProps={{
          sx: {
            overflow: 'visible',
            transition: '0.3s width',
            width: isSpatialObjectsDrawerOpened ? px(320) : px(64)
          }
        }}>
        {isSpatialObjectsDrawerOpened && (
          <Stack justifyContent="center" alignItems="center" gap={1} pt={1.5}>
            {objects.map((obj) => (
              <Card key={obj.feature.id} sx={{ width: px(300) }}>
                <Stack
                  onDoubleClick={() => toggleSpatialObjectEditMode(obj.feature.id as string)}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={5}
                  p={1.5}>
                  {SpatialObjectsService.getSpatialObjectIconByType(obj.feature)}
                  {(!!obj.edit && (
                    <TextField
                      id="standard-basic"
                      defaultValue={obj.name}
                      variant="outlined"
                      size="small"
                      onBlur={(e) => {
                        changeSpatialObjectName(obj.feature.id as string, e.currentTarget.value);
                        toggleSpatialObjectEditMode(obj.feature.id as string);
                      }}
                    />
                  )) || (
                    <Stack direction="row" alignItems="center">
                      {obj.name}
                    </Stack>
                  )}

                  <IconButton
                    onClick={() => {
                      if (map) {
                        const featureCenter = center(obj.feature);
                        map.flyTo({
                          center: [
                            featureCenter.geometry.coordinates[0],
                            featureCenter.geometry.coordinates[1]
                          ],
                          zoom: 4,
                          speed: 1
                        });
                      }
                    }}>
                    <CenterFocusStrongIcon />
                  </IconButton>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}

        <CollapseButton
          onClick={() => {
            handleDrawerToggle(!isSpatialObjectsDrawerOpened);
          }}
          variant="outlined"
          color="primary">
          {isSpatialObjectsDrawerOpened ? <ExpandMoreRounded /> : <ExpandLessRoundedIcon />}
        </CollapseButton>
      </Drawer>
    </Box>
  );
});
