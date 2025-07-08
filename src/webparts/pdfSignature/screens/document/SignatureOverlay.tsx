import dayjs from "dayjs";
import React from "react";
import { Rnd } from "react-rnd";

interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SignatureOverlayProps {
  signedUserIds: string[];
  signaturePositions: Record<string, SignaturePosition>;
  setSignaturePositions: React.Dispatch<
    React.SetStateAction<Record<string, SignaturePosition>>
  >;
  getUserNameById: (id: string) => string;
}

const SignatureOverlay: React.FC<SignatureOverlayProps> = ({
  signedUserIds,
  signaturePositions,
  setSignaturePositions,
  getUserNameById,
}) => {
  return (
    <>
      {signedUserIds.map((userId) => {
        const position = signaturePositions[userId] || {
          x: 100,
          y: 100,
          width: 250,
          height: 100,
        };

        return (
          <Rnd
            key={userId}
            size={{ width: position.width, height: position.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={(e, d) => {
              setSignaturePositions((prev) => ({
                ...prev,
                [userId]: {
                  ...prev[userId],
                  x: d.x,
                  y: d.y,
                  width: prev[userId]?.width ?? 250,
                  height: prev[userId]?.height ?? 100,
                },
              }));
            }}
            onResizeStop={(e, direction, ref, delta, pos) => {
              setSignaturePositions((prev) => ({
                ...prev,
                [userId]: {
                  x: pos.x,
                  y: pos.y,
                  width: parseInt(ref.style.width, 10),
                  height: parseInt(ref.style.height, 10),
                },
              }));
            }}
            bounds="parent"
            style={{
              border: "2px dashed #0078D4",
              background: "rgba(0, 120, 212, 0.1)",
              color: "#0078D4",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              cursor: "move",
              borderRadius: "4px",
            }}
          >
            Ditandatangani oleh {getUserNameById(userId)}, Pada{" "}
            {dayjs().format("DD MMM YYYY HH:mm")}
          </Rnd>
        );
      })}
    </>
  );
};

export default SignatureOverlay;
