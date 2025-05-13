'use client'

import { useState, useEffect } from 'react'
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
import { getServices } from '@/app/actions'


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
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete service')

      setServices(services.filter((s) => s.id !== service.id))
    } catch (error) {
      setError('Failed to delete service')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const data = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
      }

      const response = await fetch(
        editingService
          ? `/api/services/${editingService.id}`
          : '/api/services',
        {
          method: editingService ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) throw new Error('Failed to save service')

      const savedService = await response.json()
      
      if (editingService) {
        setServices(services.map((s) => 
          s.id === savedService.id ? savedService : s
        ))
      } else {
        setServices([...services, savedService])
      }

      handleClose()
    } catch (error) {
      setError('Failed to save service')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingService ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                name="title"
                required
                fullWidth
                value={formData.title}
                onChange={handleChange}
              />
              <TextField
                label="Description"
                name="description"
                required
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
              <TextField
                label="Price"
                name="price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: '$',
                }}
              />
              <TextField
                label="Image URL"
                name="imageUrl"
                fullWidth
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingService ? 'Save Changes' : 'Add Service'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
} 