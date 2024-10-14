import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Box, 
  TextField, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper, 
  AppBar, 
  Toolbar, 
  Avatar,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Send as SendIcon, MoreVert as MoreVertIcon, Search as SearchIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { sendMessage, receiveMessage } from './chatSlice'
import { RootState } from './store'

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    height: '100vh',
    width: '100%',
    margin: '0 auto',
  },
}))

const MessageBubble = styled(Paper)<{ sender: 'user' | 'bot' }>(({ theme, sender }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: sender === 'user' ? '8px 0 8px 8px' : '0 8px 8px 8px',
  backgroundColor: sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper,
  color: sender === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  maxWidth: '70%',
  boxShadow: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    backgroundColor: theme.palette.background.paper,
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}))

const ChatListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}))

export default function Chat() {
  const [input, setInput] = useState('')
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => state.chat.messages)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSend = () => {
    if (input.trim()) {
      dispatch(sendMessage({ text: input }))
      setInput('')
      simulateResponse()
    }
  }

  const simulateResponse = () => {
    setTimeout(() => {
      dispatch(receiveMessage({ text: 'This is a simulated response. How can I help you today?' }))
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const chatList = (
    <Box sx={{ width: { sm: '320px', lg: '30%' }, height: '100%', borderRight: 1, borderColor: 'divider' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>U</Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chats
          </Typography>
          <IconButton color="inherit">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List>
        {['AI Assistant', 'John Doe', 'Jane Smith'].map((name, index) => (
          <ChatListItem key={index} onClick={handleDrawerToggle}>
            <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>{name[0]}</Avatar>
            <ListItemText 
              primary={name} 
              secondary="Last message..." 
              primaryTypographyProps={{ color: 'text.primary' }}
              secondaryTypographyProps={{ color: 'text.secondary' }}
            />
          </ChatListItem>
        ))}
      </List>
    </Box>
  )

  const chatWindow = (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          {!isLargeScreen && (
            <IconButton edge="start" color="inherit" aria-label="back" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Avatar sx={{ mr: 2, bgcolor: theme.palette.secondary.main }}>AI</Avatar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Assistant
          </Typography>
          <IconButton color="inherit" aria-label="search">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="more">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: theme.palette.grey[200] }}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              <MessageBubble sender={message.sender}>
                <ListItemText
                  primary={message.text}
                  secondary={
                    <Typography variant="caption" display="block" textAlign="right" sx={{ mt: 0.5, color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  }
                />
              </MessageBubble>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ p: 2, backgroundColor: theme.palette.background.paper }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StyledTextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message"
            sx={{ mr: 1 }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend} 
            disabled={!input.trim()}
            sx={{ 
              backgroundColor: 'primary.main', 
              '&:hover': { backgroundColor: 'primary.dark' },
              '&.Mui-disabled': { backgroundColor: 'action.disabledBackground' }
            }}
          >
            <SendIcon sx={{ color: 'primary.contrastText' }} />
          </IconButton>
        </Box>
      </Box>
    </>
  )

  return (
    <StyledPaper elevation={0}>
      {isLargeScreen ? (
        <Box sx={{ display: 'flex', height: '100%' }}>
          {chatList}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {chatWindow}
          </Box>
        </Box>
      ) : (
        <>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { xs: '100%', sm: '320px' } },
            }}
          >
            {chatList}
          </Drawer>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {chatWindow}
          </Box>
        </>
      )}
    </StyledPaper>
  )
}