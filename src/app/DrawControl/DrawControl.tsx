import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { IControl } from 'mapbox-gl';
import { useControl } from 'react-map-gl';
import type { MapRef, ControlPosition } from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate?: (evt: { features: object[] }) => void;
  onUpdate?: (evt: { features: object[]; action: string }) => void;
  onDelete?: (evt: { features: object[] }) => void;
};

export default function DrawControl({
  position,
  onCreate = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  ...drawOptions
}: DrawControlProps) {
  const draw = new MapboxDraw(drawOptions) as unknown as IControl;

  useControl(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => draw,
    ({ map }: { map: MapRef }) => {
      map.on('draw.create', onCreate);
      map.on('draw.update', onUpdate);
      map.on('draw.delete', onDelete);
    },
    ({ map }: { map: MapRef }) => {
      map.off('draw.create', onCreate);
      map.off('draw.update', onUpdate);
      map.off('draw.delete', onDelete);
    },
    {
      position
    }
  );

  return null;
}