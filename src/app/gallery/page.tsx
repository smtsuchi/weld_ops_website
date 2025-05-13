'use client'

import { useState, useEffect } from 'react'
import { getGalleryImages } from '@/app/actions'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  imageUrl: string
  order: number
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery')
        if (!response.ok) throw new Error('Failed to fetch gallery images')
        const data = await response.json()
        setImages(data)
      } catch (error) {
        setError('Failed to load gallery images')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

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
              Our Gallery
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Take a look at our recent work and projects.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {images.map((image) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={image.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleImageClick(image.imageUrl)}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={image.imageUrl}
                    alt={image.title}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      color="text.primary"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {image.title}
                    </Typography>
                    {image.description && (
                      <Typography variant="body2" color="text.secondary">
                        {image.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>

      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullScreen={isMobile}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <Box
              component="img"
              src={selectedImage}
              alt="Gallery Image"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
} 