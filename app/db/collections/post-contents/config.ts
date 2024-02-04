import type { CollectionConfig } from "payload/types";

import {
   canCreatePostContent,
   canReadPostContent,
   canUpdateOrDeletePostContent,
} from "./access";
import { replaceVersionAuthor } from "../../hooks/replaceVersionAuthor";
import type { User } from "../../payload-types";
import { isStaffFieldLevel } from "../users/access";

export const PostContents: CollectionConfig = {
   slug: "postContents",
   access: {
      create: canCreatePostContent,
      read: canReadPostContent,
      update: canUpdateOrDeletePostContent,
      delete: canUpdateOrDeletePostContent,
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "content",
         type: "json",
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         hasMany: false,
         maxDepth: 1,
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         maxDepth: 3,
         required: false,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            update: isStaffFieldLevel,
         },
         admin: {
            hidden: true,
         },
      },
   ],
   hooks: {
      beforeChange: [replaceVersionAuthor],
   },
   versions: {
      drafts: {
         autosave: true,
      },
      maxPerDoc: 20,
   },
};
