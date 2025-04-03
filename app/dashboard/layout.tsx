import Link from "next/link"
import { Button } from "@/components/ui/button"

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8.56a2 2 0 0 0-3.5-1.3L2.69 19.75a2 2 0 0 0 1.74 3h15.14a2 2 0 0 0 1.74-3L15.5 7.26a2 2 0 0 0-3.5 1.3" />
      <path d="M12 16v.01" />
    </svg>
  )
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex-1" />
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <AlertIcon className="h-6 w-6" />
          <span className="text-xl">DisasterResponse</span>
        </Link>
        <div className="flex-1 flex justify-end">
          <nav className="flex gap-2">
            <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:text-foreground hover:bg-muted" size="sm" asChild>
              <Link href="/dashboard">
                <DashboardIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
} 