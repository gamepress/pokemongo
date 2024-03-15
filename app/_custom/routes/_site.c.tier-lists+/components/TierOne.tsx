import { GridCell } from "./GridCell";
import type { TierListData } from "./TierListData";

export function TierOne({ data }: { data: any }) {
   return (
      <div className="grid grid-cols-3 gap-3 ">
         {data.tier1.docs.map((row: TierListData) => (
            <GridCell
               key={row.id}
               href={`/c/pokemon/${row.slug}`}
               icon={row?.icon?.url}
               name={row.name}
               type={row.type}
            />
         ))}
      </div>
   );
}
