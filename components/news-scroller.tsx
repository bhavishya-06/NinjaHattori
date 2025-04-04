"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

// Define the structure of an article fetched from the API
interface Article {
  title: string;
  url?: string;
  // Add other fields like description or published_at if needed later
}

// No longer accepting props: export function NewsScroller({ disasters }: NewsScrollerProps) {
export function NewsScroller() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          let errorMsg = `HTTP error! status: ${response.status}`;
          try {
            const errorBody = await response.json();
            errorMsg = errorBody.message || errorMsg;
          } catch (e) { /* Ignore */ }
          throw new Error(errorMsg);
        }
        const data: Article[] = await response.json();
        setArticles(data);
      } catch (err: any) {
        console.error("NewsScroller Error fetching articles:", err);
        setError(err.message || "Failed to load articles.");
        setArticles([]); // Clear articles on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []); // Fetch once on mount

  // Render Loading State (adjust height if needed)
  if (isLoading) {
    return (
      // Set height on the container to match ScrollArea later
      <div className="space-y-3 w-full h-[300px] overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full h-[70px]">
            <CardContent className="p-3 flex items-center justify-center h-full">
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
         ))}
       </div>
     );
   }
 
   // Render Error State
   if (error) {
     return (
       <div className="flex items-center justify-center h-[100px] text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/30 p-4">
         {error}
       </div>
     );
   }
 
   // Render No Articles State
   if (!articles || articles.length === 0) {
     return (
       <div className="flex items-center justify-center h-[100px] text-sm text-muted-foreground bg-gray-50/50 rounded-lg border border-gray-100">
         No recent updates found.
       </div>
     );
   }
 
   // Render Articles Vertically with ScrollArea
   return (
     // Add ScrollArea with a fixed height
     <ScrollArea className="h-[300px] w-full rounded-md border p-4">
       <div className="space-y-3 w-full">
         {articles.map((article, index) => (
           <Link 
             href={article.url || '#'} 
             key={index} 
             target="_blank" 
             rel="noopener noreferrer" 
             className={`block ${!article.url ? 'pointer-events-none' : ''}`}
           >
             <Card className="w-full min-h-[70px] hover:shadow-md transition-shadow overflow-hidden">
               <CardContent className="p-3 flex flex-col items-center justify-center h-full text-center">
                 <p 
                   className="text-sm font-medium leading-snug line-clamp-2"
                   title={article.title}
                 >
                   {article.title}
                 </p>
               </CardContent>
             </Card>
           </Link>
         ))}
       </div>
       {/* No horizontal ScrollBar needed */}
     </ScrollArea>
   );
 }

