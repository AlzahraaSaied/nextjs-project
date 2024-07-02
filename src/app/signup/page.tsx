
"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { signupUser } from '../../lib/userSlice';
import { RootState } from '../../lib/store';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, user } = useSelector((state: RootState) => state.user);

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    dispatch(signupUser({ name, email, password, rePassword, dateOfBirth, gender }));
  };

  useEffect(() => {
    if (user) {
      router.push('/signin');
    }
  }, [user, router]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSignup}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type="text"
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              value={rePassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRePassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="date"
              label="Date of Birth"
              variant="outlined"
              fullWidth
              value={dateOfBirth}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="gender-select">Select Gender</InputLabel>
            <Select
              id="gender-select"
              fullWidth
              value={gender}
              onChange={(e: ChangeEvent<{ value: unknown }>) => setGender(e.target.value as string)}
              required
              variant="outlined"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error">{error}</Typography>
            </Grid>
          )}
        </Grid>
      </form>
    </Container>
  );
};

export default Signup;
