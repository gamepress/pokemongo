import { Fragment, useEffect, useMemo, useState } from "react";

import {
   Combobox,
   Transition,
   ComboboxOption,
   ComboboxInput,
   ComboboxOptions,
} from "@headlessui/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useNavigate } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import type { Search, Site } from "payload/generated-types";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { useSearchToggleState } from "~/root";
import { getSiteSlug } from "~/routes/_site+/_utils/getSiteSlug.server";
import { isAdding } from "~/utils/form";
import { useDebouncedValue } from "~/utils/use-debounce";
import { useSiteLoaderData } from "~/utils/useSiteLoaderData";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const { siteSlug } = await getSiteSlug(request, payload, user);

   const { q, type } = zx.parseQuery(request, {
      q: z.string(),
      type: z.string(),
   });

   if (type == "core") {
      try {
         const { docs: searchResults } = await payload.find({
            collection: "search",
            where: {
               "site.slug": {
                  equals: siteSlug,
               },
               name: {
                  contains: q,
               },
            },
            depth: 1,
            sort: "-priority",
            overrideAccess: false,
            user,
         });

         return json(
            { searchResults },
            { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } },
         );
      } catch (e) {
         throw new Response("Internal Server Error", { status: 500 });
      }
   }
   if (type == "custom") {
      try {
         const customSearchUrl = `http://localhost:4000/api/search?where[name][contains]=${q}&depth=1&sort=-priority`;

         const [{ docs: coreSearchResults }, { docs: customSearchResults }] =
            await Promise.all([
               await payload.find({
                  collection: "search",
                  where: {
                     "site.slug": {
                        equals: siteSlug,
                     },
                     name: {
                        contains: q,
                     },
                  },
                  depth: 1,
                  sort: "-priority",
                  overrideAccess: false,
                  user,
               }),
               await (await fetch(customSearchUrl)).json(),
            ]);

         const combineResults = [...coreSearchResults, ...customSearchResults];
         const searchResults = combineResults.sort(
            (a, b) => b.priority - a.priority,
         );
         return json(
            { searchResults },
            { headers: { "Cache-Control": "public, s-maxage=60, max-age=60" } },
         );
      } catch (e) {
         throw new Response("Internal Server Error", { status: 500 });
      }
   }
   return null;
}

const searchLinkUrlGenerator = (item: any, siteSlug?: string) => {
   const type = item?.doc?.relationTo;
   switch (type) {
      case "customPages": {
         const slug = item.slug;
         return `/${slug}`;
      }
      case "collections": {
         const slug = item.slug;
         return `/c/${slug}`;
      }
      case "entries": {
         const id = item.id;
         const collection = item.collectionEntity;
         return `/c/${collection}/${id}`;
      }
      case "posts": {
         const id = item.id;
         const slug = item.slug;
         return `/p/${id}/${slug}`;
      }
      //Custom site
      default:
         const id = item.doc.value;
         const collection = item.doc.relationTo;
         return `/c/${collection}/${id}`;
   }
};

const SearchType = ({ type }: { type: any }) => {
   const searchType = type.doc?.relationTo;
   switch (searchType) {
      case "customPages": {
         return <Icon name="layout" className="text-1 mr-2" size={14} />;
      }
      case "collections": {
         return <Icon name="database" className="text-1 mr-2" size={14} />;
      }
      case "entries": {
         return <Icon name="component" className="text-1 mr-2" size={14} />;
      }
      case "posts": {
         return <Icon name="file-text" className="text-1 mr-2" size={14} />;
      }
      //Custom site
      default:
         return <Icon name="component" className="text-1 mr-2" size={14} />;
   }
};

const LabelType = ({ type }: { type: any }) => {
   const labelType = type.doc?.relationTo;
   switch (labelType) {
      case "customPages": {
         return null;
      }
      case "collections": {
         return "List";
      }
      case "entries": {
         return "Entry";
      }
      case "posts": {
         return "Post";
      }
      //Custom site
      default:
         return labelType;
   }
};

export function SearchComboBox({ siteType }: { siteType: Site["type"] }) {
   const [, setSearchToggle] = useSearchToggleState();

   //use local loader to pull searchResults
   const fetcher = useFetcher();
   const [query, setQuery] = useState("");
   const debouncedValue = useDebouncedValue(query, 1000);
   //todo - seems brittle, doublecheck
   const {
      site: { id: siteId },
   } = useSiteLoaderData();

   //leave searchListItems as an empty array until fetcher is loaded
   const searchListItems = useMemo(
      //@ts-ignore
      () => fetcher.data?.searchResults ?? [],
      //@ts-ignore
      [fetcher.data?.searchResults],
   );
   const navigate = useNavigate();

   const loaderRoute = `/action/search`;

   useEffect(() => {
      if (debouncedValue) {
         return fetcher.submit(
            { q: query ?? "", intent: "search", type: siteType },
            { method: "GET", action: loaderRoute },
         );
      }
   }, [debouncedValue]);

   const handleChange = (e: any) => {
      navigate(searchLinkUrlGenerator(e, siteId));
      return setSearchToggle(false);
   };
   const isSearching = isAdding(fetcher, "search");

   return (
      <div className="h-full w-full">
         <button
            type="button"
            className="size-6 top-5 z-50 absolute right-0 mr-2.5 text-1 dark:text-dark400"
            onClick={() => {
               setSearchToggle(false);
            }}
         >
            {isSearching ? (
               <Icon name="loader-2" className="mx-auto size-5 animate-spin" />
            ) : (
               <Icon
                  name="x"
                  title="Close Search"
                  size={20}
                  className="text-zinc-400"
               />
            )}
         </button>
         <Combobox onChange={handleChange}>
            <div className="relative h-full w-full focus:outline-none">
               <ComboboxInput
                  autoFocus
                  className="h-full w-full border-0 max-laptop:px-4 p-0 bg-transparent outline-none !ring-transparent"
                  displayValue={(item: Search) => item?.name ?? ""}
                  name="search"
                  placeholder="Search..."
                  onChange={(e) => setQuery(e.target.value)}
               />
            </div>
            <Transition
               as={Fragment}
               enter="duration-200 ease-out"
               enterFrom="scale-95 opacity-0"
               enterTo="scale-100 opacity-100"
               leave="duration-300 ease-out"
               leaveFrom="scale-100 opacity-100"
               leaveTo="scale-95 opacity-0"
               afterLeave={() => setQuery("")}
            >
               <ComboboxOptions
                  modal={true}
                  className="bg-white dark:bg-dark350 outline-color border shadow-1 border-zinc-100 dark:border-zinc-700 divide-color-sub  left-0 z-20 max-h-80 w-full divide-y
                  overflow-auto shadow-xl outline-1 max-laptop:border-y laptop:mt-2 no-scrollbar laptop:rounded-2xl laptop:outline max-desktop:-left-4"
               >
                  {searchListItems.length === 0
                     ? query && (
                          <div className="text-1 p-3 text-sm">
                             No results...
                          </div>
                       )
                     : searchListItems?.map((item: Search) => (
                          <ComboboxOption
                             className={({ active }) =>
                                `relative cursor-default select-none ${
                                   active
                                      ? "bg-zinc-100 dark:bg-dark400"
                                      : "text-1"
                                }`
                             }
                             key={item?.id}
                             value={item}
                          >
                             <>
                                <Link
                                   prefetch="intent"
                                   to={searchLinkUrlGenerator(item, siteId)}
                                   className="flex items-center justify-between gap-2.5 truncate p-2 text-sm font-bold"
                                >
                                   <div className="flex items-center gap-2.5 truncate">
                                      <div
                                         className="shadow-1 border-color bg-3 flex h-8 w-8 items-center 
                                       overflow-hidden rounded-full border shadow-sm"
                                      >
                                         {item?.icon?.url ? (
                                            <Image
                                               url={item.icon.url}
                                               options="aspect_ratio=1:1&height=60&width=60"
                                               alt="Search Result Icon"
                                            />
                                         ) : (
                                            <Icon
                                               name="component"
                                               className="text-1 mx-auto"
                                               size={18}
                                            />
                                         )}
                                      </div>
                                      <div>
                                         <div>{item?.name}</div>
                                         <div className="text-1 text-xs font-normal capitalize">
                                            <LabelType type={item} />
                                         </div>
                                      </div>
                                   </div>
                                   <SearchType type={item} />
                                </Link>
                             </>
                          </ComboboxOption>
                       ))}
               </ComboboxOptions>
            </Transition>
         </Combobox>
      </div>
   );
}

export default SearchComboBox;
