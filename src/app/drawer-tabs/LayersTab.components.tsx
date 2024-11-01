import styled from './LayersTab.styled';

const { Circle } = styled;

interface Props {
  color: 'success' | 'warning' | 'error';
}

export const ConnectionStatus: React.FC<Props> = ({ color }) => {
  return (
    <Circle
      sx={{
        backgroundColor: ({ palette }) => palette[color].main
      }}
    />
  );
};
