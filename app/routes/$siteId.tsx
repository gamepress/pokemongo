import {
   Link,
   NavLink,
   Outlet,
   useFetcher,
   useLoaderData,
   useLocation,
} from "@remix-run/react";
import { DarkModeToggle } from "~/components/DarkModeToggle";
import { SiteSwitcher } from "~/components/SiteSwitcher";
import {
   ChevronDown,
   Loader2,
   LogOut,
   MoreVertical,
   Search,
   X,
} from "lucide-react";
import type {
   ActionFunction,
   LinksFunction,
   LoaderArgs,
   V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { zx } from "zodix";
import { z } from "zod";
import { assertIsPost, isAdding } from "~/utils";
import { FollowingSite, LoggedOut, NotFollowingSite } from "~/modules/auth";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import type { envType } from "env/types";
import { Image } from "~/components/Image";
import {
   ChatBubbleLeftIcon,
   CircleStackIcon,
   HomeIcon,
   PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
   HomeIcon as HomeIconBold,
   PencilSquareIcon as PencilSquareIconBold,
   CircleStackIcon as CircleStackIconBold,
   ChatBubbleLeftIcon as ChatBubbleLeftIconBold,
} from "@heroicons/react/24/solid";
import customStylesheetUrl from "../_custom/styles.css";

// See https://github.com/payloadcms/payload/discussions/1319 regarding relational typescript support

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderArgs) {
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });
   const site = await payload.findByID({
      collection: "sites",
      id: siteId,
      user,
   });
   if (!site) {
      return redirect("/404");
   }
   const host = new URL(request.url).hostname;
   const isSubdomain = host.split(".").length > 2;
   const env = process.env.PAYLOAD_PUBLIC_SERVER_ENVIRONMENT as envType;
   const domain = env == "dev-server" ? "manatee.wiki" : "mana.wiki";

   if (env != "local" && site.type === "custom" && site.subdomain) {
      //If incoming request does not contain a subdomain, redirect to the sub-domain site
      if (!isSubdomain) {
         return redirect(`https://${site.subdomain}.${domain}/${siteId}`, 301);
      }
      //If incoming request contains a subdomain, check if it matches the site's subdomain
      if (isSubdomain) {
         const subDomain = host.split(".")[0];
         if (subDomain == site.subdomain) {
            return json({ site });
         }
      }
   }
   //Handle redirects for sub-domains on core sites
   if (env != "local" && site.type === "core" && isSubdomain) {
      return redirect(`https://${domain}/${siteId}`, 301);
   }
   return json({ site });
}

export const meta: V2_MetaFunction = ({ data }) => {
   return [
      {
         title: data.site.name,
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

export const links: LinksFunction = () => [
   { rel: "preload", href: customStylesheetUrl, as: "style" },
   { rel: "stylesheet", href: customStylesheetUrl },
];

export const handle = {
   // i18n key for this route. This will be used to load the correct translation
   i18n: "site",
};

export default function SiteIndex() {
   const { site } = useLoaderData<typeof loader>();
   const fetcher = useFetcher();
   const adding = isAdding(fetcher, "followSite");
   const { t } = useTranslation(["site", "auth"]);
   const location = useLocation();
   const defaultStyle = `desktop:bg-1 max-laptop:bg-2 
   flex items-center justify-center gap-3 rounded-full font-bold max-desktop:mx-auto
   max-desktop:h-12 max-desktop:w-12
   max-laptop:-mt-6 laptop:rounded-xl desktop:px-3.5 desktop:py-2.5 desktop:justify-start`;

   return (
      <>
         <div
            className="laptop:grid laptop:min-h-screen 
                laptop:auto-cols-[86px_86px_1fr_334px] laptop:grid-flow-col
                desktop:auto-cols-[86px_210px_1fr_334px]"
         >
            <section
               className="laptop:bg-1 relative z-40  border-r border-zinc-200 shadow-zinc-500 dark:border-zinc-800
                    dark:shadow-black/60 max-laptop:fixed max-laptop:top-0  max-laptop:w-full
                     bg-2 laptop:shadow-lg laptop:shadow-zinc-100 max-laptop:py-3"
            >
               <div className="laptop:fixed laptop:top-0 laptop:left-0 laptop:h-full laptop:w-[86px] laptop:overflow-y-auto">
                  <SiteSwitcher />
               </div>
            </section>
            <section>
               <div
                  className="bg-1 border-color border-1 fixed bottom-0
                        mx-auto w-full laptop:border-r px-4 
                        max-laptop:z-40 max-laptop:flex max-laptop:h-12 max-laptop:border-t
                        laptop:top-0 laptop:h-full laptop:w-[86px]
                        laptop:space-y-1 laptop:overflow-y-auto laptop:py-5 desktop:w-[210px] desktop:px-5"
               >
                  <NavLink
                     end
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-blue-200/50 bg-gradient-to-b 
                           from-white to-blue-50/50 
                           text-zinc-600 shadow shadow-zinc-100
                           active:shadow-none dark:border-blue-900/50 dark:from-blue-900/30
                           dark:to-blue-900/20 dark:!text-white 
                            dark:shadow-black/30`
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.id}`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <HomeIconBold className="h-5 w-5 text-blue-500" />
                           ) : (
                              <HomeIcon className="h-5 w-5 text-blue-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Home
                           </span>
                        </>
                     )}
                  </NavLink>
                  <NavLink
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-emerald-200/50 bg-gradient-to-b 
                              from-white to-emerald-50/50
                              text-zinc-600 shadow shadow-zinc-100
                              active:shadow-none dark:border-emerald-900/50 dark:from-emerald-900/30
                              dark:to-emerald-900/20 dark:!text-white 
                               dark:shadow-black/30 `
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.id}/posts`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <PencilSquareIconBold className="h-5 w-5 text-emerald-500" />
                           ) : (
                              <PencilSquareIcon className="h-5 w-5 text-emerald-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Posts
                           </span>
                        </>
                     )}
                  </NavLink>
                  <NavLink
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-yellow-200/50 bg-gradient-to-b 
                           from-white to-yellow-50/50
                            text-zinc-600 shadow shadow-zinc-100
                           active:shadow-none dark:border-yellow-900/50 dark:from-yellow-900/30
                           dark:to-yellow-900/20 dark:!text-white 
                            dark:shadow-black/30`
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.id}/collections`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <CircleStackIconBold className="h-5 w-5 text-yellow-500" />
                           ) : (
                              <CircleStackIcon className="h-5 w-5 text-yellow-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Collections
                           </span>
                        </>
                     )}
                  </NavLink>
                  <NavLink
                     className={({ isActive }) =>
                        `${
                           isActive
                              ? `border border-violet-200/50 bg-gradient-to-b 
                        from-white to-violet-50/50
                        text-zinc-600 shadow shadow-zinc-100
                        active:shadow-none dark:border-violet-900/50 dark:from-violet-900/30
                        dark:to-violet-900/20 dark:!text-white 
                         dark:shadow-black/30`
                              : "text-1 border-color border laptop:!border-transparent"
                        } ${defaultStyle}`
                     }
                     to={`/${site.id}/questions`}
                  >
                     {({ isActive }) => (
                        <>
                           {isActive ? (
                              <ChatBubbleLeftIconBold className="h-5 w-5 text-violet-500" />
                           ) : (
                              <ChatBubbleLeftIcon className="h-5 w-5 text-violet-500" />
                           )}
                           <span className="max-desktop:absolute max-desktop:bottom-1.5 max-desktop:text-xs laptop:hidden desktop:block">
                              Discussions
                           </span>
                        </>
                     )}
                  </NavLink>
               </div>
            </section>
            <section className="max-laptop:border-color bg-2 max-laptop:min-h-screen max-laptop:pt-16 max-laptop:border-b">
               <section
                  className="sticky max-laptop:top-[72px] z-20 max-laptop:border-t 
               max-desktop:px-3 border-color laptop:top-0"
               >
                  <div
                     className="mx-auto justify-between w-full h-16 border max-w-[740px] 
                   shadow-zinc-200/50 flex items-center laptop:border-b border-color 
                     bg-3 shadow dark:shadow-black/40
                     rounded-xl rounded-t-none pl-3 pr-4 border-t-0"
                  >
                     <Link
                        to={`/${site.id}`}
                        className="font-bold truncate p-1 pr-4 flex items-center gap-3 rounded-full hover:bg-4"
                     >
                        <div className="h-8 w-8 overflow-hidden flex-none rounded-full bg-zinc-200">
                           <Image
                              //@ts-expect-error
                              url={site.icon?.url}
                              options="fit=crop,width=60,height=60,gravity=auto"
                              alt="Site Logo"
                           />
                        </div>
                        <div className="truncate">{site.name}</div>
                     </Link>
                     <div className="flex items-center gap-3 pl-2">
                        <FollowingSite>
                           <Menu as="div" className="relative">
                              {({ open }) => (
                                 <>
                                    <Menu.Button
                                       className="bg-2 flex h-9 w-9 items-center justify-center 
                                       rounded-full text-1 transition
                                       duration-300 hover:bg-gray-100 active:translate-y-0.5
                                     dark:hover:bg-zinc-700"
                                    >
                                       {open ? (
                                          <X
                                             size={20}
                                             className={`${
                                                open && "text-red-500"
                                             } transition duration-150 ease-in-out`}
                                          />
                                       ) : (
                                          <>
                                             <ChevronDown
                                                size={24}
                                                className="transition duration-150 ease-in-out"
                                             />
                                          </>
                                       )}
                                    </Menu.Button>
                                    <Transition
                                       as={Fragment}
                                       enter="transition ease-out duration-100"
                                       enterFrom="transform opacity-0 scale-95"
                                       enterTo="transform opacity-100 scale-100"
                                       leave="transition ease-in duration-75"
                                       leaveFrom="transform opacity-100 scale-100"
                                       leaveTo="transform opacity-0 scale-95"
                                    >
                                       <Menu.Items
                                          className="absolute right-0 mt-1.5 w-full min-w-[200px] max-w-md
                                        origin-top-right transform transition-all z-30"
                                       >
                                          <div
                                             className="border-color rounded-lg border bg-white p-1.5
                                            shadow dark:bg-zinc-800 dark:shadow-black"
                                          >
                                             <Menu.Item>
                                                <fetcher.Form method="post">
                                                   <button
                                                      name="intent"
                                                      value="unfollow"
                                                      className="text-1 flex w-full items-center gap-3 rounded-lg
                                                      py-2 px-2.5 font-bold hover:bg-zinc-100 hover:dark:bg-zinc-700/50"
                                                   >
                                                      <LogOut
                                                         className="text-red-400"
                                                         size="18"
                                                      />
                                                      {t(
                                                         "follow.actionUnfollow"
                                                      )}
                                                   </button>
                                                </fetcher.Form>
                                             </Menu.Item>
                                          </div>
                                       </Menu.Items>
                                    </Transition>
                                 </>
                              )}
                           </Menu>
                        </FollowingSite>

                        <LoggedOut>
                           <div className="flex items-center">
                              <Link
                                 to={`/login?redirectTo=/${site.id}`}
                                 className="flex h-9 px-3.5 items-center justify-center rounded-full
                               bg-zinc-700 text-sm font-bold text-white dark:text-black dark:bg-white"
                              >
                                 Follow
                              </Link>
                           </div>
                        </LoggedOut>
                        <NotFollowingSite>
                           <div className="flex items-center">
                              <fetcher.Form className="w-full" method="post">
                                 <button
                                    name="intent"
                                    value="followSite"
                                    className="flex h-9 px-3.5 items-center justify-center rounded-full
                                  bg-black text-sm font-bold text-white dark:text-black dark:bg-white"
                                 >
                                    {adding ? (
                                       <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                                    ) : (
                                       t("follow.actionFollow")
                                    )}
                                 </button>
                              </fetcher.Form>
                           </div>
                        </NotFollowingSite>
                        <div
                           className="bg-2 flex h-9 w-9 items-center shadow-sm border border-1
                           justify-center rounded-full dark:bg-zinc-700 shadow-zinc-300
                           dark:shadow-black/30"
                        >
                           <Search size={20} />
                        </div>
                     </div>
                  </div>
               </section>
               <Outlet />
            </section>
            <section
               className="bg-1 border-color relative max-laptop:mx-auto 
               max-laptop:max-w-[728px] dark:shadow-black/40
               max-laptop:pb-20 tablet:border-x laptop:border-r-0 
               laptop:border-l laptop:shadow-sm shadow-zinc-100/60"
            >
               <div className="bg-1 flex flex-col laptop:fixed laptop:h-full laptop:w-[334px] laptop:overflow-y-auto">
                  {site.banner && (
                     <div
                        className="border-color flex h-44 items-center justify-center 
                     overflow-hidden border-b-2 dark:bg-zinc-800"
                     >
                        <Image
                           //@ts-expect-error
                           url={site.banner?.url}
                           options="fit=cover,height=300,gravity=auto"
                           className="w-full object-cover"
                           alt="Site Banner"
                        />
                     </div>
                  )}
                  <LoggedOut>
                     <div className="max-laptop:hidden grid grid-cols-2 gap-4 p-4 border-color border-b">
                        <Link
                           to="/join"
                           className="relative inline-flex items-center justify-center p-4 px-5 py-2 overflow-hidden font-medium 
                           text-indigo-600 transition duration-300 ease-out rounded-full group"
                        >
                           <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-500 via-blue-500 to-purple-600"></span>
                           <span
                              className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left 
                           transform rotate-45 translate-x-24 bg-teal-500 rounded-full opacity-30 group-hover:rotate-90 ease"
                           ></span>
                           <span className="relative text-white font-bold text-sm">
                              {t("login.signUp", { ns: "auth" })}
                           </span>
                        </Link>
                        <Link
                           className="flex h-10 items-center border justify-center border-zinc-300
                          rounded-full bg-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 text-center 
                          text-sm font-bold"
                           to={`/login?redirectTo=${location.pathname}`}
                        >
                           {t("login.action", { ns: "auth" })}
                        </Link>
                     </div>
                  </LoggedOut>
                  <div className="flex-grow bg-1"></div>
                  <div className="flex items-center bg-1 justify-center py-4">
                     <div className="h-[250px] w-[300px]" />
                  </div>
                  <div
                     className="items-center justify-between pr-3 h-14 pl-5 border-1 
                     border-y max-laptop:bg-2 flex laptop:border-b-0 laptop:border-color"
                  >
                     <Link className="font-logo text-2xl pb-1" to="/">
                        mana
                     </Link>
                     <div className="flex-none">
                        <DarkModeToggle />
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
}

export const action: ActionFunction = async ({
   context: { payload, user },
   request,
   params,
}) => {
   assertIsPost(request);
   const { siteId } = zx.parseParams(params, {
      siteId: z.string().length(10),
   });
   const { intent } = await zx.parseForm(request, {
      intent: z.string(),
   });

   // Follow Site
   if (intent === "followSite") {
      //We need to get the current sites of the user, then prepare the new sites array
      const userId = user?.id;
      const userCurrentSites = user?.sites || [];
      //@ts-ignore
      const sites = userCurrentSites.map(({ id }: { id }) => id);
      //Finally we update the user with the new site id
      return await payload.update({
         collection: "users",
         id: userId ?? "",
         data: { sites: [...sites, siteId] },
         overrideAccess: false,
         user,
      });
   }

   // Unfollow Site
   if (intent === "unfollow") {
      const userId = user?.id;

      const site = await payload.findByID({
         collection: "sites",
         id: siteId,
         user,
      });

      // Prevent site creator from leaving own site
      //@ts-ignore
      if (site.owner?.id === userId) {
         return json(
            {
               errors: "Cannot unfollow your own site",
            },
            { status: 400 }
         );
      }
      const userCurrentSites = user?.sites || [];
      //@ts-ignore
      const sites = userCurrentSites.map(({ id }: { id }) => id);

      //Remove the current site from the user's sites array
      const index = sites.indexOf(siteId);
      if (index > -1) {
         // only splice array when item is found
         sites.splice(index, 1); // 2nd parameter means remove one item only
      }
      return await payload.update({
         collection: "users",
         id: userId ?? "",
         data: { sites },
         overrideAccess: false,
         user,
      });
   }
};
