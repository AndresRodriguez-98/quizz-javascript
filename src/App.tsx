import { Container, Stack, Typography, Grid } from '@mui/material'
import './App.css'
import { JavaScriptLogo } from './JavaScriptLogo'
import { useQuestionsStore } from './store/question'
import { Start } from './Start'
import { Game } from './Game'

import BgImage from './assets/bgImage.jpg'


function App() {
  const questions = useQuestionsStore(state => state.questions)

  const styles = {
    heroContainer: {
      backgroundImage: `url(${BgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: -24,
      padding: 24,
    }
  };

  return (
    <Grid container direction='column' justifyContent='flex-end' alignItems='right' style={styles.heroContainer} >

      <Container maxWidth='sm'>

        <Stack direction='row' gap={2} alignItems="center" justifyContent='center'>
          <JavaScriptLogo />
          <Typography variant='h2' component='h1' sx={{ fontWeight: 'bold' }}>
            JavaScript Quizz
          </Typography>
        </Stack>

        {questions.length === 0 && <Start />}
        {questions.length > 0 && <Game />}

      </Container>

    </Grid>
  )
}

export default App
