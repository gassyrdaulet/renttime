import styled from "styled-components";
import ImagePlaceholder from "../img/placeholder.jpg";
import { finalIpAddress } from "../api/Axios";
import useAuth from "../hooks/useAuth";

const ImageContainerDiv = styled.div`
  position: relative;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;
const Image = styled.img`
  object-fit: fill;
  width: 100%;
  height: 100%;
  background-color: black;
  pointer-events: none;
`;

function ImageContainer({
  src,
  alt,
  size,
  goodId,
  width = "200px",
  height = "200px",
}) {
  const { organizationId } = useAuth();
  return (
    <ImageContainerDiv width={width} height={height}>
      <Image
        onError={(e) => (e.target.src = ImagePlaceholder)}
        src={
          src
            ? finalIpAddress +
              "/images/" +
              organizationId +
              `/${size}_` +
              src +
              goodId +
              ".jpeg"
            : ImagePlaceholder
        }
        alt={alt}
      />
    </ImageContainerDiv>
  );
}

export default ImageContainer;
