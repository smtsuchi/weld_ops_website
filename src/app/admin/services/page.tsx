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
  Paper,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { getServices, createService, updateService, deleteService } from '@/app/actions'
import { junit } from 'node:test/reporters'


interface Service {
  id: string
  title: string
  description: string
  price: number | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

const columns: GridColDef[] = [
  { field: 'title', headerName: 'Title', flex: 1 },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    valueFormatter: (params: { value: number | null }) => {
      if (params.value == null) return ''
      return `$${params.value.toFixed(2)}`
    },
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 180,
    valueFormatter: (params: { value: Date }) => {
      return new Date(params.value).toLocaleDateString()
    },
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 120,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <Box>
        <IconButton
          size="small"
          onClick={() => params.row.onEdit(params.row)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => params.row.onDelete(params.row)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [open, setOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        setServices(data)
      } catch (error) {
        setError('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleOpen = () => {
    setOpen(true)
    setEditingService(null)
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
    })
  }

  const handleClose = () => {
    setOpen(false)
    setEditingService(null)
    setError(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price?.toString() || '',
      imageUrl: service.imageUrl || '',
    })
    setOpen(true)
  }

  const handleDelete = async (service: Service) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      setLoading(true);
      await deleteService(service.id);
      setServices(services.filter((s) => s.id !== service.id));
    } catch (error) {
      setError('Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      if (editingService) {
        await updateService(editingService.id, formData);
      } else {
        await createService(formData);
      }

      // Refresh the services list
      const updatedServices = await getServices();
      setServices(updatedServices);
      handleClose();
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
          Manage Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Service
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%', position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={services.map((service) => ({
              ...service,
              onEdit: handleEdit,
              onDelete: handleDelete,
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                required
                defaultValue={editingService?.title}
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                required
                multiline
                rows={4}
                defaultValue={editingService?.description}
              />
              <TextField
                name="price"
                label="Price"
                type="number"
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0' }}
                defaultValue={editingService?.price}
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
                  required={!editingService}
                  onChange={handleFileChange}
                  style={{ display: 'block', marginTop: '8px' }}
                />
                {(previewUrl || editingService?.imageUrl) && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {editingService ? 'Current image:' : 'Preview:'}
                    </Typography>
                    <img
                      src={previewUrl || editingService?.imageUrl || undefined}
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
} 