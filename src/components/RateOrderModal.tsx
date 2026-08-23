import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import type { Order } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const FRESHNESS_TAGS = ["Fresh", "Hot", "Crisp", "Hygienic", "Good value", "Generous portion", "Cold", "Stale"];

export function RateOrderModal({ order, children }: { order: Order; children: React.ReactNode }) {
  const { rateOrder } = useApp();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState("");

  const submit = () => {
    if (rating === 0) {
      toast.error("Pick a star rating first");
      return;
    }
    rateOrder(order.id, rating, text.trim() || "No written review.", tags);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Rate & Review</DialogTitle>
          <DialogDescription>
            {order.itemName} · Order {order.code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div>
            <p className="mb-2 text-sm font-medium">Overall rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  aria-label={`${s} star${s > 1 ? "s" : ""}`}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "size-8 transition-colors",
                      (hover || rating) >= s
                        ? "fill-urgency text-urgency"
                        : "text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Food freshness</p>
            <div className="flex flex-wrap gap-2">
              {FRESHNESS_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() =>
                    setTags((prev) =>
                      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    tags.includes(t)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Written review</p>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={300}
              placeholder="How was the food? Was pickup smooth?"
              className="min-h-24 bg-background"
            />
          </div>

          <Button onClick={submit} className="w-full glow-primary">
            Submit review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
