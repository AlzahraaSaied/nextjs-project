"use client";
import { useState, FormEvent, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signinUser } from '../../lib/userSlice';
import { RootState } from '../../lib/store';
import { useRouter } from 'next/navigation';

export default function Signin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const handleSignin = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await dispatch(signinUser({ email, password }));
      console.log("Sign in attempted");
      if (user) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Signin error:', error);
    }
  };
 

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center" gutterBottom>
            Sign In
          </Typography>
          <form onSubmit={handleSignin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Sign In
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
