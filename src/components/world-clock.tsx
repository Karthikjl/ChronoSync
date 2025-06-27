"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { Skeleton } from '@/components/ui/skeleton'
import { Globe } from 'lucide-react'

interface WorldTime {
    datetime: string;
    timezone: string;
    utc_offset: string;
}

export function WorldClock() {
    const [timezones, setTimezones] = useState<string[]>([])
    const [selectedTimezone, setSelectedTimezone] = useState<string>('Etc/UTC')
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [loading, setLoading] = useState(true)
    const [timeLoading, setTimeLoading] = useState(true)

    useEffect(() => {
        async function fetchTimezones() {
            try {
                const response = await fetch('https://worldtimeapi.org/api/timezone')
                if (!response.ok) throw new Error('Network response was not ok')
                const data = await response.json()
                setTimezones(data)
            } catch (error) {
                console.error("Failed to fetch timezones:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTimezones()
    }, [])

    useEffect(() => {
        if (!selectedTimezone) return

        async function fetchTime() {
            setTimeLoading(true)
            try {
                const response = await fetch(`https://worldtimeapi.org/api/timezone/${selectedTimezone}`)
                if (!response.ok) throw new Error('Network response was not ok')
                const data: WorldTime = await response.json()
                setCurrentTime(new Date(data.datetime))
            } catch (error) {
                console.error(`Failed to fetch time for ${selectedTimezone}:`, error)
                setCurrentTime(null)
            } finally {
                setTimeLoading(false)
            }
        }
        fetchTime()
    }, [selectedTimezone])

    useEffect(() => {
        if (!currentTime || timeLoading) return

        const timer = setInterval(() => {
            setCurrentTime(prevTime => prevTime ? new Date(prevTime.getTime() + 1000) : null)
        }, 1000)

        return () => clearInterval(timer)
    }, [currentTime, timeLoading])

    const timezoneOptions = useMemo(() => {
        return timezones.map(tz => ({ value: tz, label: tz.replace(/\//g, ' / ').replace(/_/g, ' ') }))
    }, [timezones])
    
    const formattedTime = useMemo(() => {
        if (!currentTime) return "--:--:--"
        return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }, [currentTime])

    const formattedDate = useMemo(() => {
        if (!currentTime) return "Loading..."
        return currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }, [currentTime])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Globe className="w-6 h-6" />
                    World Clock
                </CardTitle>
                <CardDescription>Select a timezone to see the current time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <Skeleton className="h-10 w-full" />
                ) : (
                    <Combobox
                        options={timezoneOptions}
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                        placeholder="Select timezone..."
                        searchPlaceholder="Search timezone..."
                        noResultsText="Timezone not found."
                    />
                )}
                <div className="text-center p-6 bg-secondary rounded-lg">
                    {timeLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-48 mx-auto" />
                            <Skeleton className="h-6 w-64 mx-auto" />
                        </div>
                    ) : (
                        <div>
                            <p className="text-5xl font-bold tracking-tighter text-primary transition-all duration-500">{formattedTime}</p>
                            <p className="text-muted-foreground">{formattedDate}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
