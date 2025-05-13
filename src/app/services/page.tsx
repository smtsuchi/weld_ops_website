'use client'

import { useState, useEffect } from 'react'
import { getServices } from '@/app/actions'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  CircularProgress,
} from '@mui/material'

interface Service {
  id: string
  title: string
  description: string
  price: number | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (!response.ok) throw new Error('Failed to fetch services')
        const data = await response.json()
        setServices(data)
      } catch (error) {
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    )
  }

  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              component="h1"
              variant="h3"
              color="text.primary"
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Our Services
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Explore our range of professional services designed to meet your needs.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={service.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  {service.imageUrl && (
                    <CardMedia
                      component="img"
                      height="240"
                      image={service.imageUrl}
                      alt={service.title}
                      sx={{
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      color="text.primary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                    {service.price && (
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        ${service.price.toFixed(2)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
} 