import styled from "styled-components";

const SliderContainer = styled.div`
  width: 100%;
`;
const StyledRangeInput = styled.input`
  width: 100%;
`;

const VolumeSlider = ({ volume, onChange }) => {
  return (
    <SliderContainer>
      <StyledRangeInput
        type="range"
        value={isNaN(volume) ? 0 : parseInt(volume)}
        onChange={onChange}
      />
    </SliderContainer>
  );
};

export default VolumeSlider;
