import { Link } from "@tanstack/react-router";
import { Clock3, Flame, MapPin, Star } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { vendorById, type Item } from "@/lib/data";
import { currentPrice, discountPct, fmtDuration, inr, timeLeft, windowProgress } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function DietDot({ tag }: { tag: string }) {
  const color =
    tag === "Non-Veg"
      ? "bg-destructive"
      : tag === "Bakery" || tag === "Beverage"
        ? "bg-urgency"
        : "bg-primary";
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-transparent bg-background/70 text-[11px] font-medium backdrop-blur-md"
    >
      <span className={`size-1.5 rounded-full ${color}`} />
      {tag}
    </Badge>
  );
}


// export function ItemCard({ item, stock }: { item: Item; stock?: number }) {
//   const now = useNow();
//   const vendor = vendorById(item.vendorId);
//   const price = now ? currentPrice(item, now) : item.basePrice;
//   const pct = now ? discountPct(item, now) : 0;
//   const left = stock ?? item.quantity;
//   const soldOut = left <= 0;
//   const expired = now ? timeLeft(item, now) <= 0 : false;

//   return (
//     <Link
//       to="/item/$id"
//       params={{ id: item.id }}
//       className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
//     >
//       <div className="relative aspect-[4/3] overflow-hidden">
//         <img
//           src={item.image}
//           alt={item.name}
//           loading="lazy"
//           width={1024}
//           height={768}
//           className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />
//         <div className="absolute left-3 top-3 flex gap-1.5">
//           {item.tags.slice(0, 2).map((t) => (
//             <DietDot key={t} tag={t} />
//           ))}
//         </div>
//         {pct > 0 && !soldOut && (
//           <div className="absolute right-3 top-3 rounded-full bg-urgency px-2.5 py-1 text-xs font-bold text-urgency-foreground shadow-lg">
//             −{pct}%
//           </div>
//         )}
//         {soldOut && (
//           <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
//             <span className="rounded-full border border-destructive/50 bg-destructive/20 px-4 py-1.5 text-sm font-bold text-destructive-foreground">
//               SOLD OUT
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="flex flex-1 flex-col gap-3 p-4 pt-3">
//         <div>
//           <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight">
//             {item.name}
//           </h3>
//           {vendor && (
//             <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
//               <MapPin className="size-3 shrink-0" />
//               <span className="truncate">{vendor.name}</span>
//               <span className="ml-auto flex shrink-0 items-center gap-0.5 text-urgency">
//                 <Star className="size-3 fill-urgency" />
//                 {vendor.rating}
//               </span>
//             </p>
//           )}
//         </div>

//         <div className="mt-auto space-y-2.5">
//           <div className="flex items-end justify-between gap-2">
//             <div className="flex items-baseline gap-2">
//               <span className="font-display text-2xl font-bold tracking-tight text-primary">
//                 {inr(price)}
//               </span>
//               <span className="text-sm text-muted-foreground line-through">
//                 {inr(item.basePrice)}
//               </span>
//             </div>
//             {!soldOut && (
//               <span className="flex items-center gap-1 rounded-full bg-urgency/10 px-2 py-0.5 text-[11px] font-medium text-urgency">
//                 <Flame className="size-3" />
//                 {left} left
//               </span>
//             )}
//           </div>

//           <div className="space-y-1">
//             <Progress value={now ? windowProgress(item, now) * 100 : 0} className="h-1.5" />
//             <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
//               <Clock3 className="size-3" />
//               {expired ? (
//                 "Clearance ended"
//               ) : (
//                 <>
//                   Ends in{" "}
//                   <span className="font-semibold tabular-nums text-foreground">
//                     {now ? fmtDuration(timeLeft(item, now)) : "—"}
//                   </span>
//                   {item.preset === "aggressive" && (
//                     <span className="ml-1 rounded bg-urgency/15 px-1.5 py-0.5 text-[10px] font-bold text-urgency">
//                       FAST DROP
//                     </span>
//                   )}
//                 </>
//               )}
//             </p>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }


export function ItemCard({ item, stock }: { item: Item; stock?: number }) {
  const now = useNow();
  const vendor = vendorById(item.vendorId);
  const price = now ? currentPrice(item, now) : item.basePrice;
  const pct = now ? discountPct(item, now) : 0;
  const left = stock ?? item.quantity;
  const soldOut = left <= 0;
  const expired = now ? timeLeft(item, now) <= 0 : false;

  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#DDE8D8] bg-[#FFFEF8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#86A982] hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EEF4EA]">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex gap-1.5">
          {item.tags.slice(0, 2).map((t) => (
            <DietDot key={t} tag={t} />
          ))}
        </div>

        {pct > 0 && !soldOut && (
          <div className="absolute right-3 top-3 rounded-full bg-[#F4C95D] px-2.5 py-1 text-xs font-bold text-[#173B25] shadow-md">
            −{pct}%
          </div>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-[#173B25] px-4 py-1.5 text-sm font-bold text-white shadow-lg">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-display text-[15px] font-bold leading-snug tracking-tight text-[#173B25]">
            {item.name}
          </h3>

          {vendor && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <MapPin className="size-3 text-[#4F7942]" />

              <span className="truncate text-[#66736A]">
                {vendor.name}
              </span>

              <span className="ml-auto flex shrink-0 items-center gap-1 font-medium text-[#C88A16]">
                <Star className="size-3 fill-[#F4C95D] text-[#F4C95D]" />
                {vendor.rating}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-extrabold tracking-tight text-[#087A3B]">
                {inr(price)}
              </span>

              <span className="text-xs text-[#8A938C] line-through">
                {inr(item.basePrice)}
              </span>
            </div>

            {!soldOut && (
              <span className="flex items-center gap-1 rounded-full bg-[#FFF4D8] px-2 py-1 text-[10px] font-semibold text-[#9A6A0A]">
                <Flame className="size-3" />
                {left} left
              </span>
            )}
          </div>

          <div className="mt-3">
            <Progress
              value={now ? windowProgress(item, now) * 100 : 0}
              className="h-1.5 bg-[#DCEBDD]"
            />

            <div className="mt-2 flex items-center justify-between">
              <p className="flex items-center gap-1 text-[10px] text-[#78847B]">
                <Clock3 className="size-3" />

                {expired ? (
                  "Clearance ended"
                ) : (
                  <>
                    Ends in{" "}
                    <span className="font-semibold tabular-nums text-[#34463A]">
                      {now ? fmtDuration(timeLeft(item, now)) : "—"}
                    </span>
                  </>
                )}
              </p>

              {item.preset === "aggressive" && !expired && (
                <span className="rounded-full bg-[#FFF1CC] px-2 py-0.5 text-[9px] font-bold text-[#9A6A0A]">
                  FAST DROP
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}