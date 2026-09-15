'use client'
import queryClient from "@/lib/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { TooltipProvider } from '@workspace/ui/components/tooltip'

const App = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={null}>
                <TooltipProvider>
                    <Toaster
                        richColors
                        closeButton
                        position="top-left"
                    />
                    {children}
                </TooltipProvider>
            </Suspense>
        </QueryClientProvider>
    )
}

export default App