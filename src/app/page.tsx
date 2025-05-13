'use client'

import { Box, Container, Typography, Button, Grid, Paper, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'

const features = [
  {
    title: 'Professional Service',
    description: 'Our team of experts provides top-quality service tailored to your needs.',
    icon: <CheckCircleIcon />,
  },
  {
    title: 'Quality Guaranteed',
    description: 'We stand behind our work with a satisfaction guarantee.',
    icon: <CheckCircleIcon />,
  },
  {
    title: 'Fast Response',
    description: 'Quick response times and efficient service delivery.',
    icon: <CheckCircleIcon />,
  },
  {
    title: 'Customer Support',
    description: '24/7 customer support to address your concerns.',
    icon: <CheckCircleIcon />,
  },
]

export default function Home() {

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Typography
                  component="h1"
                  variant="h2"
                  color="text.primary"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                  }}
                >
                  Welcome to{' '}
                  <Typography
                    component="span"
                    variant="h2"
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Weld-Ops
                  </Typography>
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ maxWidth: '600px' }}
                >
                  We provide professional welding services and solutions to help your business grow. 
                  Explore our services, view our gallery, and get in touch with us today.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    href="/services"
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                    }}
                  >
                    Our Services
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/contact"
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                    }}
                  >
                    Contact Us
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/hero-image.jpg"
                alt="Welding Services"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                  display: { xs: 'none', md: 'block' },
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              color="primary"
              sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              Features
            </Typography>
            <Typography
              component="h2"
              variant="h3"
              color="text.primary"
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Why Choose Us
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, md: 6 }} key={feature.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'primary.light',
                        '& svg': {
                          fontSize: 24,
                        },
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        color="text.primary"
                        sx={{ fontWeight: 'bold', mb: 1 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
