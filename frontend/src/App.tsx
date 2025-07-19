import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import { ImageUpload } from './components/ImageUpload';
import { RecipeDisplay } from './components/RecipeDisplay';
import { extractRecipe } from './api/recipe';
import type { Recipe } from './types/recipe';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    const result = await extractRecipe(file);

    if (result.success && result.recipe) {
      setRecipe(result.recipe);
      setSuccessMessage('レシピの抽出に成功しました！');
    } else {
      setError(result.error || 'レシピの抽出に失敗しました');
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            CookScan
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 4 }}
          >
            レシピ画像を簡単にデータ化
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ flex: recipe ? { xs: '1', md: '0 0 50%' } : { xs: 1, md: '0 0 60%' }, maxWidth: { md: '600px' } }}>
              <ImageUpload onUpload={handleImageUpload} loading={loading} />
            </Box>

            {recipe && (
              <Box sx={{ flex: { xs: '1', md: '0 0 50%' } }}>
                <RecipeDisplay recipe={recipe} />
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
        >
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  )
}

export default App
