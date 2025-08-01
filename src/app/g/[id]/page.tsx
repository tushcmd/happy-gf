import { Card, CardContent } from "@/components/ui/card"
import { Heart, Sparkles } from "lucide-react"

interface PageProps {
    params: Promise<{ id: string }>
}

async function getGreeting(id: string) {
    try {
        // Use Vercel's internal URL for server-side calls
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || "http://localhost:3000";

        const response = await fetch(
            `${baseUrl}/api/get-greeting/${id}`,
            {
                cache: "no-store",
                // Add headers for internal calls
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )

        if (!response.ok) {
            console.error(`API call failed: ${response.status} ${response.statusText}`);
            return null
        }

        const data = await response.json()
        return data.success ? { name: data.name, customMessage: data.customMessage } : null
    } catch (error) {
        console.error("Error fetching greeting:", error)
        return null
    }
}

export default async function GreetingPage({ params }: PageProps) {
    const { id } = await params
    const greeting = await getGreeting(id)

    if (!greeting) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4">
                <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-xl max-w-md w-full">
                    <CardContent className="p-8 text-center space-y-4">
                        <div className="text-6xl">😢</div>
                        <h1 className="text-2xl font-bold text-pink-800">Oops! Link Not Found</h1>
                        <p className="text-pink-600">This special link seems to have expired or doesn&apos;t exist.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Floating Hearts Animation */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <Heart
                        key={i}
                        className={`absolute text-pink-300 fill-pink-300 animate-pulse`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            fontSize: `${Math.random() * 20 + 10}px`,
                        }}
                    />
                ))}
            </div>

            <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-2xl max-w-2xl w-full relative z-10">
                <CardContent className="p-8 text-center space-y-8">
                    {/* Main Greeting */}
                    <div className="space-y-4">
                        <div className="flex justify-center space-x-2 text-6xl animate-bounce">
                            <span>💖</span>
                            <span>🌸</span>
                            <span>💖</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight">
                            Happy Girlfriend&apos;s Day,
                            <br />
                            <span className="text-pink-800">{greeting.name}!</span>
                        </h1>
                    </div>

                    {/* Custom Message */}
                    {greeting.customMessage && (
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200 shadow-inner">
                            <div className="flex justify-center mb-3">
                                <span className="text-2xl">💌</span>
                            </div>
                            <p className="text-lg md:text-xl text-pink-800 font-medium italic leading-relaxed">
                                &quot;{greeting.customMessage}&quot;
                            </p>
                        </div>
                    )}

                    {/* Default Message */}
                    <div className="space-y-4 text-pink-700">
                        <div className="flex justify-center">
                            <Sparkles className="text-pink-500 w-8 h-8" />
                        </div>

                        <p className="text-xl md:text-2xl font-medium">You are loved, cherished, and absolutely amazing! 🌟</p>

                        <p className="text-lg text-pink-600 max-w-md mx-auto">
                            Someone special wanted to brighten your day and remind you how wonderful you are. You bring joy, laughter,
                            and love wherever you go! 💕
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center space-x-4 text-3xl">
                        <span className="animate-pulse">🌹</span>
                        <span className="animate-bounce">💝</span>
                        <span className="animate-pulse">🌹</span>
                    </div>

                    {/* Footer Message */}
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                        <p className="text-pink-800 font-medium">Hope this made you smile! 😊</p>
                        <p className="text-sm text-pink-600 mt-1">You deserve all the happiness in the world! ✨</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
