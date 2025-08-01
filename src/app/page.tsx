"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Copy, Check } from "lucide-react"

export default function HomePage() {
  const [name, setName] = useState("")
  const [link, setLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), customMessage: customMessage.trim() }),
      })

      const data = await response.json()
      if (data.success) {
        setLink(`${window.location.origin}/g/${data.id}`)
      }
    } catch (error) {
      console.error("Error generating link:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-2 text-4xl">
            <Heart className="text-pink-500 fill-pink-500" />
            <Heart className="text-rose-500 fill-rose-500" />
            <Heart className="text-pink-500 fill-pink-500" />
          </div>
          <h1 className="text-4xl font-bold text-pink-800 leading-tight">
            Make Her Smile This
            <br />
            <span className="text-rose-600">Girlfriend&apos;s Day 💕</span>
          </h1>
          <p className="text-pink-700 text-lg">Create a personalized surprise link just for her!</p>
        </div>

        {/* Form */}
        <Card className="bg-white/80 backdrop-blur-sm border-pink-200 shadow-xl">
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-pink-800">
                  Her Beautiful Name ✨
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter her name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-pink-300 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-pink-800">
                  Custom Message (Optional) 💌
                </label>
                <textarea
                  id="message"
                  placeholder="Add a sweet personal message... (optional)"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[80px] resize-none border-pink-300 focus:border-pink-500 focus:ring-pink-500 rounded-md px-3 py-2 w-full border"
                  maxLength={200}
                />
                <p className="text-xs text-pink-600">{customMessage.length}/200 characters</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Magic...</span>
                  </div>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Generate Her Special Link
                  </>
                )}
              </Button>
            </form>

            {/* Generated Link */}
            {link && (
              <div className="space-y-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="text-center">
                  <p className="text-pink-800 font-medium mb-2">🎉 Her special link is ready!</p>
                  <p className="text-sm text-pink-600 mb-4">Send this to her and watch her smile! 💖</p>
                </div>

                <div className="bg-white p-3 rounded border border-pink-200">
                  <code className="text-xs text-pink-800 break-all block">{link}</code>
                </div>

                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied! 🎉
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-pink-600 text-sm">
          <p>Made with 💕 for all the amazing girlfriends out there!</p>
        </div>
      </div>
    </div>
  )
}
