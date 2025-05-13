'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Stack,
  Alert,
  Tooltip,
  CircularProgress,
  Grid,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/app/actions'

interface GalleryImage {
  id: string
  title: string
  description: string | null
  imageUrl: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [open, setOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImages()
        setImages(data)
      } catch (error) {
        setError('Failed to load gallery images')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setEditingImage(null)
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
    })
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEditingImage(null)
    setFormData({ title: '', description: '', imageUrl: '' })
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    setFormData({
      title: image.title,
      description: image.description || '',
      imageUrl: image.imageUrl,
    })
    setOpen(true)
  }

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);
      await deleteGalleryImage(image.id);
      setImages(images.filter((i) => i.id !== image.id));
    } catch (error) {
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (image: GalleryImage, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex((i) => i.id === image.id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === images.length - 1)
    )
      return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newImages = [...images]
    const [movedImage] = newImages.splice(currentIndex, 1)
    newImages.splice(newIndex, 0, movedImage)

    try {
      const response = await fetch(`/api/gallery/${image.id}/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newOrder: newIndex,
        }),
      })

      if (!response.ok) throw new Error('Failed to reorder image')

      setImages(newImages)
    } catch (error) {
      setError('Failed to reorder image')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (editingImage) {
        await updateGalleryImage(editingImage.id, formData);
      } else {
        await createGalleryImage(formData);
      }

      // Refresh the gallery images
      const updatedImages = await getGalleryImages();
      setImages(updatedImages);
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Manage Gallery
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Image
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
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
      ) : (
        <Grid container spacing={3}>
          {images.map((image, index) => (
            <Grid key={image.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={image.imageUrl}
                  alt={image.title}
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
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
                <CardActions>
                  <Tooltip title="Move Up">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleMove(image, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move Down">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleMove(image, 'down')}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(image)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(image)}
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

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingImage ? 'Edit Image' : 'Add New Image'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                required
                defaultValue={editingImage?.title}
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                required
                multiline
                rows={4}
                defaultValue={editingImage?.description}
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Image
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  required={!editingImage}
                  onChange={handleFileChange}
                  style={{ display: 'block', marginTop: '8px' }}
                />
                {(previewUrl || editingImage?.imageUrl) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {editingImage ? 'Current image:' : 'Preview:'}
                    </Typography>
                    <img
                      src={previewUrl || editingImage?.imageUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
} 