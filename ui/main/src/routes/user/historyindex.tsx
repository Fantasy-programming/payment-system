import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HistoryIndex() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg"></CardTitle>
          <CardDescription></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6 h-[500px]">
        <div className="flex flex-col items-center h-1/2   justify-center font-semibold text-sm text-muted-foreground leading-tight">
          <img
            src="/Mikronet.png"
            className="h-24 w-24 grayscale hover:grayscale-0  transition-all "
            alt="Mikronet"
          />
          <span>Press a transaction to show more info</span>
        </div>
      </CardContent>
    </Card>
  );
}
