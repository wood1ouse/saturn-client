import { Divider, Drawer, Stack, ToggleButtonGroup, Typography } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import InsightsIcon from '@mui/icons-material/Insights';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { LayersTab } from '../../drawer-tabs/LayersTab';
import { UIService } from '../../../services/UIService';
import { HistoricalTab } from '../../drawer-tabs/HistoricalTab';
import { AnalysisTab } from '../../drawer-tabs/AnalysisTab';

import { px } from '../../../utils/ui';
import UIStore from '../../../store/UIStore';
import { DrawerTabs } from '../../../models/ui';

import styled from './MapDrawer.styled';
import sharedStyled from '../_shared';

const { ToggleButton, ThemeButton } = styled;
const { CollapseButton } = sharedStyled;

function handleDrawerToggle(value: boolean): void {
  UIStore.setIsDrawerOpened(value);
}

function handleTabClick(tab: DrawerTabs): void {
  setTimeout(() => {
    UIStore.setIsDrawerOpened(true);
  }, 150);
  UIStore.setDrawerTab(tab);
}

function toggleTheme(): void {
  UIStore.toggleTheme();
}

export const MapDrawer: React.FC = observer(() => {
  const { theme, isDrawerOpened, drawerTab } = UIStore;

  return (
    <Drawer
      variant="permanent"
      open={isDrawerOpened}
      PaperProps={{
        sx: {
          overflow: 'visible',
          transition: '0.3s width',
          width: isDrawerOpened ? px(400) : px(64)
        }
      }}
    >
      <Stack direction="row">
        <ToggleButtonGroup value={drawerTab} orientation="vertical" sx={{ p: 1 }}>
          <ToggleButton value={DrawerTabs.LAYERS} onClick={() => handleTabClick(DrawerTabs.LAYERS)}>
            <MapRoundedIcon />
          </ToggleButton>
          <ToggleButton
            value={DrawerTabs.HISTORICAL}
            onClick={() => handleTabClick(DrawerTabs.HISTORICAL)}
          >
            <HistoryRoundedIcon />
          </ToggleButton>
          <ToggleButton
            value={DrawerTabs.ANALYSIS}
            onClick={() => handleTabClick(DrawerTabs.ANALYSIS)}
          >
            <InsightsIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        {isDrawerOpened && (
          <Stack width="100%" mr={1}>
            <Typography variant="h6" p={1.5}>
              {UIService.getTabLabel(drawerTab)}
              <Divider sx={{ py: 1, width: px(300) }} />
            </Typography>
            <>
              {drawerTab === DrawerTabs.LAYERS && <LayersTab />}
              {drawerTab === DrawerTabs.HISTORICAL && <HistoricalTab />}
              {drawerTab === DrawerTabs.ANALYSIS && <AnalysisTab />}
            </>
          </Stack>
        )}
      </Stack>

      <CollapseButton
        onClick={() => {
          handleDrawerToggle(!isDrawerOpened);
        }}
        variant="outlined"
        color="primary"
      >
        {isDrawerOpened ? <ExpandLessRoundedIcon /> : <ExpandMoreRounded />}
      </CollapseButton>
      <ThemeButton onClick={toggleTheme}>
        {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </ThemeButton>
    </Drawer>
  );
});
