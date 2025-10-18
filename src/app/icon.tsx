import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "linear-gradient(135deg, #155dfc  0%, #59168b  100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bolder",
          borderRadius: "5px",
          color: "#fff",
        }}
      >
        BX
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
