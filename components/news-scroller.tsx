"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, MessageSquare, ThumbsUp } from "lucide-react"

export function NewsScroller() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching news data
    const fetchNews = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setNews([
          {
            id: 1,
            source: "Reddit",
            user: "emergency_responder",
            title: "Flooding in downtown area, roads blocked on Main St and 5th Ave",
            time: "10 minutes ago",
            type: "Flood",
            upvotes: 42,
            comments: 15,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 2,
            source: "Twitter",
            user: "weather_alert",
            title: "Hurricane warning issued for coastal regions. Evacuation recommended for zones A and B.",
            time: "25 minutes ago",
            type: "Hurricane",
            upvotes: 128,
            comments: 37,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 3,
            source: "Local News",
            user: "city_news",
            title: "Emergency shelters opening at Community Center and North High School",
            time: "45 minutes ago",
            type: "Emergency",
            upvotes: 89,
            comments: 23,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 4,
            source: "Reddit",
            user: "first_responder",
            title: "Need volunteers with 4x4 vehicles to help with supply distribution in Highland Park area",
            time: "1 hour ago",
            type: "Request",
            upvotes: 156,
            comments: 42,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          {
            id: 5,
            source: "Twitter",
            user: "relief_org",
            title: "Distribution center set up at Central Mall parking lot. Supplies available from 8am-8pm.",
            time: "1.5 hours ago",
            type: "Supplies",
            upvotes: 75,
            comments: 12,
            avatar: "/placeholder.svg?height=40&width=40",
          },
        ])
        setLoading(false)
      }, 1000)
    }

    fetchNews()
  }, [])

  const getTypeBadgeColor = (type) => {
    const colors = {
      Flood: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      Hurricane: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      Emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      Request: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      Supplies: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    }
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
  }

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 pr-4">
        {news.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-lg border p-3">
            <Avatar>
              <AvatarImage src={item.avatar} alt={item.user} />
              <AvatarFallback>{item.user.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.source}</span>
                <span className="text-xs text-muted-foreground">@{item.user}</span>
              </div>
              <p className="text-sm">{item.title}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className={getTypeBadgeColor(item.type)}>
                  {item.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{item.upvotes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{item.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

