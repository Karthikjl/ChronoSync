"use client"

import React, { useState, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { detectTimestamp } from '@/ai/flows/detect-timestamp'
import { useToast } from "@/hooks/use-toast"
import { Clock, Cpu, Sparkles } from 'lucide-react'

export function EpochConverter() {
    const [epochValue, setEpochValue] = useState<string>('')
    const [isLoadingAi, setIsLoadingAi] = useState(false)
    const { toast } = useToast()
    const inputRef = useRef<HTMLInputElement>(null)

    const handlePaste = async (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData('text')
        if (!pastedText || !isNaN(Number(pastedText))) {
            return
        }

        setIsLoadingAi(true)
        try {
            const result = await detectTimestamp({ text: pastedText })
            if (result.timestamp && (result.confidence ?? 0) >= 0.8) {
                setEpochValue(String(result.timestamp))
                toast({
                    title: "Timestamp Detected!",
                    description: "We've automatically extracted a timestamp for you.",
                })
            }
        } catch (error) {
            console.error("AI detection failed", error)
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Could not process pasted text.",
            })
        } finally {
            setIsLoadingAi(false)
        }
    }

    const { convertedUtc, convertedLocal } = useMemo(() => {
        if (!epochValue || isNaN(Number(epochValue))) {
            return { convertedUtc: '---', convertedLocal: '---' }
        }

        const numValue = Number(epochValue)
        const date = new Date(numValue * (String(numValue).length === 10 ? 1000 : 1))

        if (isNaN(date.getTime())) {
             return { convertedUtc: 'Invalid Date', convertedLocal: 'Invalid Date' }
        }

        return {
            convertedUtc: date.toUTCString(),
            convertedLocal: date.toLocaleString(),
        }
    }, [epochValue])

    const handleSetCurrentTime = () => {
        const currentEpoch = Math.floor(Date.now() / 1000)
        setEpochValue(String(currentEpoch))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-6 h-6" />
                    Epoch Converter
                </CardTitle>
                <CardDescription>Convert a Unix epoch timestamp to a human-readable date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="epoch-input">Unix Timestamp</Label>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <Input
                                ref={inputRef}
                                id="epoch-input"
                                placeholder="e.g. 1672531200"
                                value={epochValue}
                                onChange={(e) => setEpochValue(e.target.value)}
                                onPaste={handlePaste}
                            />
                            {isLoadingAi && (
                                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
                            )}
                        </div>
                        <Button variant="outline" onClick={handleSetCurrentTime}>
                            <Clock className="mr-2 h-4 w-4" /> Now
                        </Button>
                    </div>
                     <p className="text-sm text-muted-foreground">Paste any text containing a timestamp to detect it automatically.</p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">UTC Time</p>
                        <p className="text-lg font-semibold font-mono">{convertedUtc}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Your Local Time</p>
                        <p className="text-lg font-semibold font-mono">{convertedLocal}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
