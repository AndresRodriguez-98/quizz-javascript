import { create } from "zustand";
import { type Question } from "../types";
import confetti from "canvas-confetti";
import { persist, devtools } from "zustand/middleware";

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

// el create tiene que recibir un callback, y en el callback tenes que devolver un objeto que va a ser el estado global. El set es para actualizar el estado y el get para leerlo

// ACLARACIONES: 

// el persist nos sirve para PERSISTIR los datos dentro de nuestro localStorage (por defecto, si no debajo del name podemos especificarle donde guardar los datos). Y como devuelve una funcion, debemos agregar los () luego del create<state> para que no se queje ts

// el devtools nos permite utilizar el redux devtools que instalamos como extension en el navegador y asi poder ver todos los pasos que fuimos haciendo cuando fuimos jugando con la app

export const useQuestionsStore = create<State>()(
  devtools(
    persist(
      (set, get) => {
        return {
          questions: [],
          currentQuestion: 0, // posicion del array de Questions

          fetchQuestions: async (limit: number) => {
            const res = await fetch("http://localhost:5173/data.json");
            const json = await res.json();

            const questions = json.sort(() => Math.random() - 0.5).slice(0, limit);

            set({ questions }, false, 'FETCH_QUESTIONS');
          },

          selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            // usar el structuredClone para clonar el objeto:
            const newQuestions = structuredClone(questions);
            // encontramos el índice de la pregunta:
            const questionIndex = newQuestions.findIndex((q) => q.id === questionId);
            // obtenemos la información de la pregunta:
            const questionInfo = newQuestions[questionIndex];
            // averiguamos si el usuario ha seleccionado la respuesta correcta:
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex;

            // si la pregunta es correcta mostramos con confetti una animacion:
            if (isCorrectUserAnswer) confetti();

            // cambiar esta información en la copia de la pregunta
            newQuestions[questionIndex] = {
              ...questionInfo,
              isCorrectUserAnswer,
              userSelectedAnswer: answerIndex,
            };

            // Actualizamos el estado:
            set({ questions: newQuestions });
          },

          goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nextQuestion = currentQuestion + 1;

            if (nextQuestion < questions.length) {
              set({ currentQuestion: nextQuestion }, false, "GO_NEXT_QUESTION");
            }
          },

          goPreviousQuestion: () => {
            const { currentQuestion } = get();
            const previousQuestion = currentQuestion - 1;

            if (previousQuestion >= 0) {
              set({ currentQuestion: previousQuestion }, false, "GO_PREVIOUS_QUESTION");
            }
          },

          reset: () => {
            set({ currentQuestion: 0, questions: [] }, false, "RESET");
          },
        };
      },
      {
        name: "questions",
      }
    )
  )
);


