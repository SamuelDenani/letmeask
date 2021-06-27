import copyImg from "../../assets/images/copy.svg";

import "../../styles/room-code.scss";

type RoomCodeProps = {
  code: string;
};

export function RoomCode({ code }: RoomCodeProps) {
  const handleCopyRoomCodeToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <button className="room-code" onClick={handleCopyRoomCodeToClipboard}>
      <div>
        <img
          src={copyImg}
          alt="Ícone simbolizando ação de copiar o código da sala"
        />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}
