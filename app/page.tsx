import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              SuperbulletAI
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              AI-Powered Roblox Development Platform
            </p>
            <p className="mx-auto max-w-[600px] text-sm text-muted-foreground">
              Build Roblox games 10x faster with our custom fine-tuned AI model,
              production-ready templates, and modified Knit framework.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/login">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline">
                Sign Up Free
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-5xl mt-12 p-8 bg-card border rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">🤖 Custom AI Model</h3>
                <p className="text-sm text-muted-foreground">
                  BulletMindV1 trained specifically on Roblox Lua, outperforms GPT-4 on Roblox tasks
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📦 Template Library</h3>
                <p className="text-sm text-muted-foreground">
                  Production-ready systems from developers with 100M+ visits
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🏗️ Knit Framework</h3>
                <p className="text-sm text-muted-foreground">
                  Modified Knit with Get/Set/Others architecture for clean code
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">💻 Custom IDE</h3>
                <p className="text-sm text-muted-foreground">
                  VSCode-based editor with Roblox Studio integration
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎨 UI Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Generate UI and connected scripts together
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🎁 Free Tokens</h3>
                <p className="text-sm text-muted-foreground">
                  1M free tokens/month - feels unlimited for most users
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
