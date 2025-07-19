import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import type { Recipe } from '../types/recipe';

interface RecipeDisplayProps {
  recipe: Recipe;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          {recipe.title}
        </Typography>

        {recipe.memo && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: 'info.light' }} elevation={0}>
            <Typography variant="body2" color="text.secondary">
              メモ: {recipe.memo}
            </Typography>
          </Paper>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.primary">
            材料
          </Typography>
          <List>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">{ingredient.name}</Typography>
                      <Chip label={ingredient.quantity} size="small" color="primary" variant="outlined" />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom color="text.primary">
            作り方
          </Typography>
          <Stepper orientation="vertical">
            {recipe.steps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="subtitle1">手順 {index + 1}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {step}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </CardContent>
    </Card>
  );
};