import { IconButton, Stack } from '@mui/material'
import { Card, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { useQuestionsStore } from './store/question'
import { type Question as QuestionType } from './types'

import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { Footer } from './Footer'

// Ahora lo que nos queda es demostarle al usuario si la respuesta que eligió es correcta cambiando el color de fondo de esa respuesta (funcion que se ejecuta una vez) :
const getBackgroundColor = (info: QuestionType, index: number) => {
    const { userSelectedAnswer, correctAnswer } = info
    // usuario no ha seleccionado nada todavía
    if (userSelectedAnswer == null) return 'transparent'
    // si ya selecciono pero la solución es incorrecta
    if (index !== correctAnswer && index !== userSelectedAnswer) return 'transparent'
    // si esta es la solución correcta
    if (index === correctAnswer) return 'green'
    // si esta es la selección del usuario pero no es correcta
    if (index === userSelectedAnswer) return 'red'
    // si no es ninguna de las anteriores
    return 'transparent'
}

const Question = ({ info }: { info: QuestionType }) => {

    const selectAnswer = useQuestionsStore(state => state.selectAnswer)

    // Para que la funcion handleclick nos devuelva el selectAnswer con el indice de AnswerIndex, es decir, para lograr que al hacer click en una pregunta ese evento guarde la pregunta seleccionada con su indice, necesitamos crear una funcion que devuelva otra funcion. Esto se debe a que, si solo fuera una funcion que devuelve la pregunta seleccionada, no le podriamos pasar answerIndex por parametro ya que lo que recibe como parametro es el evento (cuando hacemos un click se recibe el evento click como parametro). Por eso hay que hacer que devuelva otra funcion:

    const createHandleClick = (answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex)
    }

    return (
        <Card variant='outlined' sx={{ bgcolor: '#222', p: 2, textAlign: 'left', marginTop: 4 }}>

            <Typography variant='h5'>
                {info.question}
            </Typography>

            <SyntaxHighlighter language='javascript' style={gradientDark}>
                {info.code}
            </SyntaxHighlighter>

            <List sx={{ bgcolor: '#333' }} disablePadding>
                {info.answers.map((answer, index) => (
                    <ListItem key={index} disablePadding divider>
                        <ListItemButton
                            disabled={info.userSelectedAnswer != null}
                            onClick={createHandleClick(index)}
                            sx={{
                                backgroundColor: getBackgroundColor(info, index)
                            }}
                        >
                            <ListItemText primary={answer} sx={{ textAlign: 'center' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Card>
    )
}

export const Game = () => {
    const questions = useQuestionsStore(state => state.questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
    const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion)

    const questionInfo = questions[currentQuestion]

    return (
        <>
            <Stack direction='row' gap={2} alignItems='center' justifyContent='center'>
                <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0}>
                    <ArrowBackIosNew />
                </IconButton>

                {currentQuestion + 1} / {questions.length}

                <IconButton onClick={goNextQuestion} disabled={currentQuestion >= questions.length - 1}>
                    <ArrowForwardIos />
                </IconButton>
            </Stack>
            <Question info={questionInfo} />
            <Footer />
        </>

    )
}