import styled from './LayersTab.styled';

const { Circle } = styled;

export const ConnectionStatus: React.FC = () => {
  return (
    <Circle
      sx={{
        backgroundColor: ({ palette }) => palette.error.main
      }}
    />
  );
};
