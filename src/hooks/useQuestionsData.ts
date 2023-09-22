import { useQuestionsStore } from "../store/question";

export const useQuestionsData = () => {
  // asi logramos que cada vez que cambie questions se va a volver a renderizar:
  const questions = useQuestionsStore((state) => state.questions);

  // Podriamos hacerlo de esta otra forma:
  // const {questions} = useQuestionsStore(state => state)
  // pero en ese caso estariamos observando los cambios de TODO el estado. Cada vez que se modifique algo del estado se re-renderizaria todo el estado completo y no es lo que queremos ni lo que nos conviene

  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((question) => {
    const { userSelectedAnswer, correctAnswer } = question;
    if (userSelectedAnswer == null) unanswered++;
    else if (userSelectedAnswer === correctAnswer) correct++;
    else incorrect++;
  });

  return { correct, incorrect, unanswered };
};
