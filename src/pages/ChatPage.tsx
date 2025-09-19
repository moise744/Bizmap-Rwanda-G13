import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Bot, User, ArrowLeft, History, X, MapPin, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState('rw')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add welcome message when component mounts
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: language === 'rw' 
        ? 'Muraho! Ndi umufasha wawe w\'ubwenge bwihuliye muri BizMap Rwanda. Mbwira ibyo ushaka kugura cyangwa serivise ushaka, nzagufasha kubona abantu bakora neza hafi yawe!'
        : 'Hello! I\'m your AI assistant for BizMap Rwanda. Tell me what you\'re looking for and I\'ll help you find the best businesses near you!',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [language])

  const quickSuggestions = {
    rw: [
      "Nshaka restaurant nziza mu Kigali",
      "Hari famasi ifungura ubu?",
      "Ndashaka hoteli nziza",
      "Amakuru y\'imodoka yo gukodesha",
      "Mbere gushakisha aho kuraguza"
    ],
    en: [
      "Find good restaurants in Kigali",
      "What pharmacies are open now?",
      "Show me hotels with good ratings",
      "Car rental services nearby",
      "Best shopping places in town"
    ]
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        rw: [
          'Ndashaka kugufasha gushakisha restaurant nziza! Reka njye ngufashe kubona restaurant zifite ibiciro byiza no kuraguza neza mu Kigali.',
          'Hari famasi nyinshi zifungura 24/7 mu Kigali. Reka njye nkwereke aho ushobora kujya.',
          'Mbona uri gushakisha serivise nziza. Reka njye nkwereke ibikoresho byose byo mu Rwanda.',
          'Byari byiza cyane! Reka njye ngufashe kubona ibyo ushaka neza.'
        ],
        en: [
          'I\'d be happy to help you find great restaurants! Let me show you some highly-rated options in Kigali with good prices and service.',
          'There are several 24/7 pharmacies in Kigali. Let me show you the nearest ones.',
          'I see you\'re looking for quality services. Let me help you discover the best options in Rwanda.',
          'That sounds great! Let me help you find exactly what you\'re looking for.'
        ]
      }

      const responseTexts = responses[language as keyof typeof responses] || responses.en
      const randomResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)]

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
  }

  const clearChat = () => {
    setMessages([])
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: language === 'rw' 
        ? 'Muraho! Ndi umufasha wawe w\'ubwenge bwihuliye muri BizMap Rwanda. Mbwira ibyo ushaka!'
        : 'Hello! I\'m your AI assistant for BizMap Rwanda. What can I help you find today?',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === 'user'
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-[#0D80F2] text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-[#0D80F2] text-white rounded-br-sm' 
              : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <div className={`mt-2 text-xs ${
              isUser ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
          <Bot size={16} />
        </div>
        <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-50 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="p-1"
            >
              <ArrowLeft size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="p-2 text-red-600 hover:text-red-700"
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Bot className="w-6 h-6 text-[#0D80F2]" />
            <div>
              <h3 className="font-semibold text-gray-900">AI Mode</h3>
              <p className="text-xs text-gray-500">Intelligent Business Assistant</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Language / Ururimi</label>
            <div className="flex gap-2">
              <Button
                variant={language === 'rw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('rw')}
                className="flex-1"
              >
                🇷🇼 Kiny
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="flex-1"
              >
                🇺🇸 EN
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="font-medium mb-3">Quick Questions:</h4>
          <div className="space-y-2">
            {quickSuggestions[language as keyof typeof quickSuggestions].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full p-3 text-left bg-white hover:bg-gray-100 rounded-lg text-sm transition-colors border"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-[#0D80F2]" />
                <div>
                  <h3 className="font-semibold text-gray-900">BizMap AI Assistant</h3>
                  <p className="text-xs text-gray-500">
                    {language === 'rw' ? 'Umufasha w\'ubwenge bwihuliye' : 'Your intelligent business finder'}
                  </p>
                </div>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ● Online
            </Badge>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Bot className="w-16 h-16 text-[#0D80F2] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'rw' ? 'Murakaza neza kuri BizMap AI!' : 'Welcome to BizMap AI!'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                {language === 'rw' 
                  ? 'Ndi umufasha wawe w\'ubwenge bwihuliye wo kubona amasosiyete mu Rwanda. Mbwira ibyo ushaka mu Kinyarwanda, Icyongereza, cyangwa Igifaransa!'
                  : 'I\'m your intelligent assistant for discovering businesses in Rwanda. Ask me anything in Kinyarwanda, English, or French!'
                }
              </p>
            </div>
          ) : (
            <div>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={language === 'rw' ? 'Mbwira ibyo ushaka...' : 'Ask me anything...'}
                  className="pr-12 py-3 rounded-full border-2 focus:border-[#0D80F2]"
                  disabled={isTyping}
                />
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    isListening 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  disabled={isTyping}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">
                  {language === 'rw' ? 'Kinyarwanda' : 'English'}
                </Badge>
                <p className="text-xs text-gray-500">
                  {message.length}/500
                </p>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="bg-[#0D80F2] hover:bg-blue-700 text-white p-3 rounded-full"
              size="sm"
            >
              {isTyping ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Map Sidebar */}
      <div className="w-80 bg-gray-50 border-l p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          View on Map
        </h3>
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Map integration</p>
            <p className="text-xs text-gray-400">coming soon</p>
          </div>
        </div>
        
        {/* Business Results would appear here */}
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Suggested Businesses</h4>
          <div className="space-y-2">
            <Card className="p-3">
              <CardContent className="p-0">
                <h5 className="font-medium text-sm">Heaven Restaurant</h5>
                <p className="text-xs text-gray-600">★ 4.8 • Kigali</p>
              </CardContent>
            </Card>
            <Card className="p-3">
              <CardContent className="p-0">
                <h5 className="font-medium text-sm">Serena Hotel</h5>
                <p className="text-xs text-gray-600">★ 4.9 • Kigali</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage;