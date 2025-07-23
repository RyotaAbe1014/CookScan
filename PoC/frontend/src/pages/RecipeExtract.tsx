import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
  Button,
  IconButton,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { extractRecipe } from '../api/recipe';
import ImageUpload from '../components/ImageUpload';
import RecipeDisplay from '../components/RecipeDisplay';
import type { Recipe } from '../types/recipe';

const RecipeExtract: React.FC = () => {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [saveOption, setSaveOption] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [pendingRecipe, setPendingRecipe] = useState<Recipe | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setRecipe(null);
    setUploadedFile(file);

    const response = await extractRecipe(file, saveOption);

    if (response.success && response.recipe) {
      if (saveOption) {
        setRecipe(response.recipe);
        setSuccess(true);
      } else {
        setPendingRecipe(response.recipe);
        setSaveDialogOpen(true);
      }
    } else {
      setError(response.error || 'レシピの抽出に失敗しました');
    }

    setLoading(false);
  };

  const handleSaveRecipe = async () => {
    if (!pendingRecipe || !uploadedFile) return;
    
    setSaveDialogOpen(false);
    setLoading(true);
    
    const response = await extractRecipe(uploadedFile, true);
    
    if (response.success && response.recipe) {
      setRecipe(response.recipe);
      setSuccess(true);
    } else {
      setError(response.error || 'レシピの保存に失敗しました');
    }
    
    setLoading(false);
  };

  const handleDontSave = () => {
    if (pendingRecipe) {
      setRecipe(pendingRecipe);
    }
    setSaveDialogOpen(false);
  };

  const handleReset = () => {
    setRecipe(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          画像からレシピを抽出
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={saveOption}
                  onChange={(e) => setSaveOption(e.target.checked)}
                  disabled={loading}
                />
              }
              label="抽出後すぐに保存する"
            />
          </Box>
          <ImageUpload 
            onImageSelect={handleImageUpload} 
            loading={loading}
            onReset={handleReset}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          {recipe && (
            <Box>
              <RecipeDisplay recipe={recipe} />
              {recipe.id && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/recipes/${recipe.id}`)}
                  >
                    レシピを見る
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                  >
                    編集する
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={saveDialogOpen}
        onClose={handleDontSave}
      >
        <DialogTitle>レシピを保存しますか？</DialogTitle>
        <DialogContent>
          抽出したレシピを保存して、後で見返すことができます。
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDontSave}>保存しない</Button>
          <Button 
            onClick={handleSaveRecipe} 
            variant="contained"
            startIcon={<SaveIcon />}
          >
            保存する
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          レシピを保存しました！
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeExtract;