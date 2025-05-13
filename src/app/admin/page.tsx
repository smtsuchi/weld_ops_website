'use client'

import { useState, useEffect } from 'react'
import { getStats } from './actions'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Stack,
  Link,
  CircularProgress,
} from '@mui/material'
import WorkIcon from '@mui/icons-material/Work'
import ImageIcon from '@mui/icons-material/Image'
import EmailIcon from '@mui/icons-material/Email'
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread'

interface Stats {
  servicesCount: number
  galleryCount: number
  messagesCount: number
  unreadMessagesCount: number
}

const statCards = [
  {
    title: 'Total Services',
    value: 'servicesCount',
    icon: <WorkIcon />,
    link: '/admin/services',
    linkText: 'View all services',
  },
  {
    title: 'Gallery Images',
    value: 'galleryCount',
    icon: <ImageIcon />,
    link: '/admin/gallery',
    linkText: 'View gallery',
  },
  {
    title: 'Total Messages',
    value: 'messagesCount',
    icon: <EmailIcon />,
    link: '/admin/messages',
    linkText: 'View messages',
  },
  {
    title: 'Unread Messages',
    value: 'unreadMessagesCount',
    icon: <MarkEmailUnreadIcon />,
    link: '/admin/messages',
    linkText: 'View unread messages',
  },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        setError('Failed to load dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
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

  if (error || !stats) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error || 'Failed to load dashboard'}</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <Typography
          component="h1"
          variant="h4"
          color="text.primary"
          sx={{ fontWeight: 'bold' }}
        >
          Dashboard
        </Typography>

        <Grid container spacing={3}>
          {statCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        '& svg': {
                          fontSize: 24,
                        },
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        color="text.primary"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {stats[card.value as keyof Stats]}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions sx={{ bgcolor: 'action.hover', px: 2, py: 1 }}>
                  <Link
                    href={card.link}
                    color="primary"
                    underline="hover"
                    sx={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    {card.linkText}
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
} 