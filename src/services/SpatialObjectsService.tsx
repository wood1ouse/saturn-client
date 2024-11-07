import React from 'react';

import { Feature } from 'geojson';
import { assertNever } from '../utils/common';

import LinearScaleIcon from '@mui/icons-material/LinearScale';
import PlaceIcon from '@mui/icons-material/Place';
import RectangleIcon from '@mui/icons-material/Rectangle';

export class SpatialObjectsService {
  static getSpatialObjectNameByType(feature: Feature): string {
    const type = feature.geometry.type;

    switch (type) {
      case 'Point':
      case 'MultiPoint':
        return 'Point';
      case 'LineString':
      case 'MultiLineString':
        return 'Line';
      case 'Polygon':
      case 'MultiPolygon':
        return 'Polygon';
      case 'GeometryCollection':
        return '';
      default:
        return assertNever(type);
    }
  }

  static getSpatialObjectIconByType(feature: Feature): React.JSX.Element | null {
    const type = feature.geometry.type;

    switch (type) {
      case 'Point':
      case 'MultiPoint':
        return <PlaceIcon />;
      case 'LineString':
      case 'MultiLineString':
        return <LinearScaleIcon />;
      case 'Polygon':
      case 'MultiPolygon':
        return <RectangleIcon />;
      case 'GeometryCollection':
        return null;
      default:
        return assertNever(type);
    }
  }
}
