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
  setSignaturePosition: (userId: string, position: SignaturePosition) => void;
  getUserText: (userId: string) => { label: string; name: string };
}

const SignatureOverlay: React.FC<SignatureOverlayProps> = ({
  signedUserIds,
  signaturePositions,
  setSignaturePosition,
  getUserText,
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

        const { label, name } = getUserText(userId);

        return (
          <Rnd
            key={userId}
            size={{ width: position.width, height: position.height }}
            position={{ x: position.x, y: position.y }}
            onDragStop={(e, d) => {
              setSignaturePosition(userId, {
                ...position,
                x: d.x,
                y: d.y,
              });
            }}
            onResizeStop={(e, direction, ref, delta, pos) => {
              setSignaturePosition(userId, {
                x: pos.x,
                y: pos.y,
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
              });
            }}
            bounds="parent"
            style={{
              border: "2px dashed #999",
              background: "rgba(200, 200, 200, 0.1)",
              color: "#AAAAAA",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              cursor: "move",
              borderRadius: "8px",
              padding: "10px",
              textAlign: "center",
              whiteSpace: "pre-line",
              gap: "14px",
            }}
          >
            <div
              style={{ fontSize: "12px", color: "#AAAAAA", fontWeight: "400" }}
            >
              {label}
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "600", color: "#000000" }}
            >
              {name}
            </div>
          </Rnd>
        );
      })}
    </>
  );
};

export default SignatureOverlay;
