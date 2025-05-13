'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Stack,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'

interface Message {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
  },
  {
    field: 'message',
    headerName: 'Message',
    flex: 2,
    renderCell: (params: GridRenderCellParams) => (
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'read',
    headerName: 'Status',
    width: 120,
    renderCell: (params: GridRenderCellParams) => (
      <Chip
        label={params.value ? 'Read' : 'Unread'}
        color={params.value ? 'default' : 'primary'}
        size="small"
      />
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Received',
    width: 180,
    valueFormatter: (params: { value: Date }) => {
      return new Date(params.value).toLocaleString()
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
          onClick={() => params.row.onView(params.row)}
          color="primary"
        >
          <EmailIcon />
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

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch('/api/messages')
//         if (!response.ok) throw new Error('Failed to fetch messages')
//         const data = await response.json()
//         setMessages(data)
//       } catch (error) {
//         setError('Failed to load messages')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchMessages()
//   }, [])

  const handleView = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      handleMarkAsRead(message)
    }
  }

  const handleClose = () => {
    setSelectedMessage(null)
  }

  const handleDelete = async (message: Message) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const response = await fetch(`/api/messages/${message.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete message')

      setMessages(messages.filter((m) => m.id !== message.id))
    } catch (error) {
      setError('Failed to delete message')
    }
  }

  const handleMarkAsRead = async (message: Message) => {
    try {
      const response = await fetch(`/api/messages/${message.id}/read`, {
        method: 'PUT',
      })

      if (!response.ok) throw new Error('Failed to mark message as read')

      setMessages(
        messages.map((m) =>
          m.id === message.id ? { ...m, read: true } : m
        )
      )
    } catch (error) {
      setError('Failed to mark message as read')
    }
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
          Contact Messages
        </Typography>
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
            rows={messages.map((message) => ({
              ...message,
              onView: handleView,
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

      <Dialog
        open={!!selectedMessage}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedMessage && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" component="div">
                  Message from {selectedMessage.name}
                </Typography>
                <Chip
                  icon={<MarkEmailReadIcon />}
                  label={selectedMessage.read ? 'Read' : 'Unread'}
                  color={selectedMessage.read ? 'default' : 'primary'}
                  size="small"
                />
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    From
                  </Typography>
                  <Typography variant="body1">
                    {selectedMessage.name} ({selectedMessage.email})
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Received
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Message
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      bgcolor: 'action.hover',
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    {selectedMessage.message}
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button
                onClick={() => handleDelete(selectedMessage)}
                color="error"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
} 