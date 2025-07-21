import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { getAllRecipes, deleteRecipe } from '../api/recipe';
import type { Recipe } from '../types/recipe';

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    const response = await getAllRecipes();
    
    if (response.success && response.recipes) {
      setRecipes(response.recipes);
    } else {
      setError(response.error || 'レシピの取得に失敗しました');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async () => {
    if (!recipeToDelete) return;

    const response = await deleteRecipe(recipeToDelete.id);
    
    if (response.success) {
      setRecipes(recipes.filter(recipe => recipe.id !== recipeToDelete.id));
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    } else {
      setError(response.error || 'レシピの削除に失敗しました');
      setDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (recipe: Recipe) => {
    setRecipeToDelete(recipe);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRecipeToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        レシピ一覧
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {recipes.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            レシピがまだありません
          </Typography>
          <Button
            variant="contained"
            startIcon={<PhotoCameraIcon />}
            onClick={() => navigate('/extract')}
            sx={{ mt: 2 }}
          >
            画像からレシピを追加
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {recipe.title}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={`材料 ${recipe.ingredients.length}品`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`手順 ${recipe.steps.length}ステップ`}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    作成日: {formatDate(recipe.createdAt)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/recipes/${recipe.id}/edit`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(recipe);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/extract')}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>レシピの削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            「{recipeToDelete?.title}」を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>キャンセル</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecipeList;