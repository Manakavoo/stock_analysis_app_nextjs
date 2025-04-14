"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, X, Minimize2, Maximize2, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
}

interface ChatbotProps {
  stockSymbol: string
  timeframe: string
}

export default function Chatbot({ stockSymbol, timeframe }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const suggestedQuestions = [
    "Explain RSI indicator",
    "What does MACD tell us?",
    "trend bullish or bearish?",
    "What's the volume analysis?",
  ]

  useEffect(() => {
    if (isOpen && !messages.length) {
      // Add welcome message when chat is first opened
      setMessages([
        {
          id: "welcome",
          content: `Hello! I'm your stock analysis assistant. How can I help you analyze ${stockSymbol} data?`,
          sender: "bot",
        },
      ])
    }
  }, [isOpen, messages.length, stockSymbol])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Update the handleSendMessage function to handle API connection issues
  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user" as const,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors", // Add CORS mode
        body: JSON.stringify({
          message: message,
          context: {
            index: stockSymbol,
            timeframe: timeframe,
          },
          conversation_id: conversationId,
          message_history: messages.map((msg) => ({
            content: msg.content,
            role: msg.sender === "user" ? "user" : "assistant",
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      setConversationId(data.conversation_id)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.response,
          sender: "bot",
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)

      // Generate a more helpful response when the API is unavailable
      let errorMessage = "I'm sorry, I couldn't process your request. "

      if (error instanceof Error && error.message.includes("Failed to fetch")) {
        errorMessage +=
          "It seems I can't connect to the server right now. Please check if the backend is running at http://127.0.0.1:8000/"
      } else {
        errorMessage += "Please try again later."
      }

      toast({
        title: "Connection Error",
        description: "Could not connect to the chat backend.",
        variant: "destructive",
      })

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: errorMessage,
          sender: "bot",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Update the clearConversation function to handle API connection issues
  const clearConversation = async () => {
    if (conversationId) {
      try {
        await fetch(`http://127.0.0.1:8000/chat/${conversationId}`, {
          method: "DELETE",
          mode: "cors", // Add CORS mode
        })
      } catch (error) {
        console.error("Error clearing conversation:", error)
        // Continue even if this fails - we'll reset the local state anyway
      }
    }

    setMessages([])
    setConversationId(null)

    // Add welcome message again
    setMessages([
      {
        id: "welcome-new",
        content: `Hello! I'm your stock analysis assistant. How can I help you analyze ${stockSymbol} data?`,
        sender: "bot",
      },
    ])

    toast({
      title: "Conversation cleared",
      description: "Started a new conversation",
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setMessage(question)
    setTimeout(() => {
      handleSendMessage()
    }, 100)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg">
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed transition-all duration-300 shadow-lg ${
        isMinimized ? "bottom-4 right-4 w-auto h-auto" : "fixed bottom-4 right-4 w-80 sm:w-96 h-[700px] max-h-[80vh] bg-blue-300 dark:bg-gray-700 text-black dark:text-white shadow-lg rounded-xl"//"bottom-4 right-4 w-80 sm:w-96 h-[700px] max-h-[80vh]  bg-gray-900 text-white"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
        <h3 className="font-semibold">AI Stock Assistant</h3>
        <div className="flex space-x-1">
          {isMinimized ? (
            <Button variant="ghost" size="icon" onClick={() => setIsMinimized(false)}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-[380px] p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`mb-4 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          <CardFooter className="flex flex-col p-3 gap-3 border-t">
            {messages.length <= 2 && (
              <div className="grid grid-cols-2 gap-2 w-full">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs justify-start h-auto py-1.5 px-2"
                    onClick={() => handleSuggestedQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex w-full space-x-2">
              <Input
                placeholder="Ask about the stock data..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={clearConversation} title="Clear conversation">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
