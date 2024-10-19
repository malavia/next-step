import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { keyframes } from '@mui/system';

// Animation pour les boutons
const buttonHoverAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: none;
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: scale(1);
    box-shadow: none;
  }
`;

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        mb: 2, 
        backgroundColor: '#4a90e2',  // Bleu doux
        transition: 'background-color 0.3s ease-in-out',
        '&:hover': {
          backgroundColor: '#3b78c3',  // Légèrement plus foncé au survol
        }
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: '#fff', 
            fontWeight: 'bold',
            '&:hover': {
              color: '#b3e5fc',  // Bleu très clair au survol
            }
          }}
        >
          Well being
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            component={RouterLink} 
            to="/" 
            color="inherit"
            sx={{
              '&:hover': {
                animation: `${buttonHoverAnimation} 0.5s ease-in-out`,
                backgroundColor: '#b3e5fc',  // Bleu clair au survol
                color: '#003c8f',  // Texte bleu foncé
              },
            }}
          >
            Accueil
          </Button>
          <Button 
            component={RouterLink} 
            to="/about" 
            color="inherit"
            sx={{
              '&:hover': {
                animation: `${buttonHoverAnimation} 0.5s ease-in-out`,
                backgroundColor: '#b3e5fc',
                color: '#003c8f',
              },
            }}
          >
            Vide
          </Button>
          <Button 
            component={RouterLink} 
            to="/contact" 
            color="inherit"
            sx={{
              '&:hover': {
                animation: `${buttonHoverAnimation} 0.5s ease-in-out`,
                backgroundColor: '#b3e5fc',
                color: '#003c8f',
              },
            }}
          >
            Vide
          </Button>
          {isAuthenticated && (
            <Button 
              component={RouterLink} 
              to="/dashboard" 
              color="inherit"
              sx={{
                '&:hover': {
                  animation: `${buttonHoverAnimation} 0.5s ease-in-out`,
                  backgroundColor: '#b3e5fc',
                  color: '#003c8f',
                },
              }}
            >
              Tableau de bord
            </Button>
          )}
          {isAuthenticated ? (
            <Button 
              color="inherit" 
              onClick={logout}
              sx={{
                '&:hover': {
                  animation: `${buttonHoverAnimation} 0.5s ease-in-out`,
                  backgroundColor: '#aed581',  // Vert doux pour la déconnexion
                  color: '#2e7d32',
                },
              }}
            >
              Se déconnecter
            </Button>
          ) : (
            <Button 
              component={RouterLink} 
              to="/login" 
              color="inherit"
              sx={{
                '&:hover': {
                  animation: `${buttonHoverAnimation} 0.5s ease-in-out`,
                  backgroundColor: '#aed581',  // Vert doux pour la connexion
                  color: '#2e7d32',
                },
              }}
            >
              Se connecter
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

/* version simple
import { useAuth } from '../context/AuthProvider'; 
import { Link } from 'react-router-dom';

const Header = () => {
  
  const { isAuthenticated, logout } = useAuth();

  return (
    <header>
      <h1>Well being</h1>
      <nav style={{ textAlign:'center'}} >
        <Link to="/">Accueil</Link> - 
        <Link to="/about">vide</Link> - 
        <Link to="/contact">vide</Link> - 
        {isAuthenticated && <Link to="/dashboard">Tableau de bord</Link>}
        {isAuthenticated ? (
          <button onClick={logout}>Se déconnecter</button>
        ) : (
          <Link to="/login">Se connecter</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
*/