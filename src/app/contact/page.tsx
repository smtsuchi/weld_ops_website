'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="sm">
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="h1"
              variant="h3"
              color="text.primary"
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Contact Us
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Get in touch with us for any questions or inquiries.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 4 },
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <form onSubmit={(e) => handleSubmit(e)}>
              <Stack spacing={3}>
                <TextField
                  label="Name"
                  name="name"
                  required
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                />

                <TextField
                  label="Message"
                  name="message"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={status === 'loading'}
                  sx={{
                    py: 1.5,
                    position: 'relative',
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      Sending...
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-12px',
                          marginLeft: '-12px',
                        }}
                      />
                    </>
                  ) : (
                    'Send Message'
                  )}
                </Button>

                {status === 'success' && (
                  <Alert
                    severity="success"
                    icon={<CheckCircleIcon />}
                    sx={{ mt: 2 }}
                  >
                    Message sent successfully!
                  </Alert>
                )}

                {status === 'error' && (
                  <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    sx={{ mt: 2 }}
                  >
                    Failed to send message. Please try again.
                  </Alert>
                )}
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
} 