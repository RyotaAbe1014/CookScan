import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRecipeById, deleteRecipe } from '../api/recipe';
import RecipeDisplay from '../components/RecipeDisplay';
import type { Recipe } from '../types/recipe';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        setRecipe(response.recipe);
      } else {
        setError(response.error || 'レシピの取得に失敗しました');
      }

      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const response = await deleteRecipe(id);

    if (response.success) {
      navigate('/');
    } else {
      setError(response.error || 'レシピの削除に失敗しました');
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
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

  if (!recipe) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">レシピが見つかりません</Alert>
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={() => navigate(`/recipes/${id}/edit`)} sx={{ mr: 1 }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      <RecipeDisplay recipe={recipe} />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>レシピの削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            「{recipe.title}」を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipeDetail;