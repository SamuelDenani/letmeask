import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { database } from "../services/firebase";

import { useHistory, useParams } from "react-router-dom";
import { useRoom } from "../hooks/useRoom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import "../styles/room.scss";

type RoomsParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const { id: roomId } = useParams<RoomsParams>();
  const { questions, title } = useRoom(roomId);

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: Date.now(),
    });

    history.push("/");
  };

  const handleCheckQuestionAnswered = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: false,
      isAnswered: true,
    });
  };

  const handleHighlightQuestion = async (
    questionId: string,
    currentState: boolean
  ) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !currentState,
    });
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Tem certeza que voc~e deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <div className="questions-list">
          {questions.map(
            ({ id, content, author, isAnswered, isHighlighted }) => (
              <Question
                key={id}
                content={content}
                author={author}
                isAnswered={isAnswered}
                isHighlighted={isHighlighted}
              >
                {!isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAnswered(id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar pergunta como respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(id, isHighlighted)}
                    >
                      <img
                        src={answerImg}
                        alt="Destacar pergunta para resposta"
                      />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => handleDeleteQuestion(id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          )}
        </div>
      </main>
    </div>
  );
}
