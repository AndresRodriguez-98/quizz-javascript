import { Button } from '@mui/material'
import { useQuestionsStore } from './store/question'

const LIMIT_QUESTIONS = 10

export const Start = () => {
    const fetchQuestions = useQuestionsStore(state => state.fetchQuestions)

    const handleClick = () => {
        fetchQuestions(LIMIT_QUESTIONS)
    }
    return (
        <Button onClick={handleClick} variant='contained' sx={{ marginTop: 4, backgroundColor: 'yellow', fontSize: 18 }}>
            Empezar
        </Button>
    )
}
