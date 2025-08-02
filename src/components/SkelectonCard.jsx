import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

const SkelectonCard = () => {
  return (
    <Card className="w-full">
      <CardContent className="relative aspect-[3/4] flex-5 rounded-t-lg overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </CardContent>
      
      <CardHeader>
        <div>
          <Skeleton className="h-6 w-3/4 my-2" />
          
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div>
          <div className="flex items-baseline">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <div className="flex gap-1.5 justify-between items-center mt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-10" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SkelectonCard;
