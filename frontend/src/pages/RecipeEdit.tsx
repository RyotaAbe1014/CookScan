import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRecipeById, updateRecipe } from '../api/recipe';
import type { Recipe, Ingredient } from '../types/recipe';

const RecipeEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('レシピIDが指定されていません');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await getRecipeById(id);

      if (response.success && response.recipe) {
        const recipe = response.recipe;
        setTitle(recipe.title);
        setIngredients(recipe.ingredients);
        setSteps(recipe.steps);
        setMemo(recipe.memo || '');
      } else {
        setError(response.error || 'レシピの取得に失敗しました');
      }

      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;

    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    if (ingredients.length === 0) {
      setError('材料を少なくとも1つ追加してください');
      return;
    }

    if (steps.length === 0) {
      setError('手順を少なくとも1つ追加してください');
      return;
    }

    setSaving(true);
    setError(null);

    const response = await updateRecipe(id, {
      title: title.trim(),
      ingredients: ingredients.filter(ing => ing.name.trim()),
      steps: steps.filter(step => step.trim()),
      memo: memo.trim() || undefined,
    });

    if (response.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate(`/recipes/${id}`);
      }, 1000);
    } else {
      setError(response.error || 'レシピの更新に失敗しました');
    }

    setSaving(false);
  };

  const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !saving) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          レシピ一覧に戻る
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(`/recipes/${id}`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          レシピを編集
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="レシピタイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              材料
            </Typography>
            {ingredients.map((ingredient, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="材料名"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="分量"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    onClick={() => removeIngredient(index)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addIngredient}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              材料を追加
            </Button>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              手順
            </Typography>
            {steps.map((step, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ mr: 2, minWidth: 30 }}>
                  {index + 1}.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  size="small"
                />
                <IconButton
                  onClick={() => removeStep(index)}
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addStep}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              手順を追加
            </Button>
          </Box>

          <TextField
            fullWidth
            label="メモ（任意）"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/recipes/${id}`)}
          disabled={saving}
        >
          キャンセル
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '保存中...' : '保存'}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          レシピを更新しました
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeEdit;