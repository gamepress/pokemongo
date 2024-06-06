import type { CollectionConfig } from "payload/types";

import type { User } from "payload/generated-types";

import {
   isOwnComment,
   isCommentDeletedField,
   deleteComment,
   canMutateCommentsFieldAsSiteAdmin,
} from "./access";
import {
   updateCommentCount,
   updateCommentCountAfterDelete,
} from "./updateCommentCount";
import { isLoggedIn, isStaff } from "../users/users.access";

export const Comments: CollectionConfig = {
   slug: "comments",
   access: {
      create: isLoggedIn,
      read: () => true,
      update: isOwnComment,
      delete: deleteComment || isStaff,
   },
   hooks: {
      afterChange: [updateCommentCount],
      afterDelete: [updateCommentCountAfterDelete],
   },
   fields: [
      {
         name: "comment",
         type: "json",
         access: {
            read: isCommentDeletedField,
         },
      },
      {
         name: "isDeleted",
         type: "checkbox",
      },
      {
         name: "isPinned",
         type: "checkbox",
         access: {
            update: canMutateCommentsFieldAsSiteAdmin("comments"),
         },
      },
      {
         name: "site",
         type: "relationship",
         relationTo: "sites",
         maxDepth: 0,
         required: true,
         access: {
            update: () => false,
         },
      },
      {
         name: "postParent",
         type: "relationship",
         relationTo: "posts",
         maxDepth: 1,
         hasMany: false,
         access: {
            update: () => false,
         },
      },
      {
         name: "sectionParentCollection",
         type: "relationship",
         relationTo: "collections",
         maxDepth: 1,
         access: {
            update: () => false,
         },
      },
      {
         name: "sectionParentId",
         type: "text",
         access: {
            update: () => false,
         },
      },
      {
         name: "isTopLevel",
         type: "checkbox",
         defaultValue: false,
         access: {
            update: () => false,
         },
      },
      {
         name: "upVotesStatic",
         type: "number",
         access: {
            update: () => false,
         },
      },
      {
         name: "replies",
         type: "relationship",
         relationTo: "comments",
         maxDepth: 1,
         hasMany: true,
         access: {
            update: () => false,
         },
      },
      {
         name: "upVotes",
         type: "relationship",
         relationTo: "users",
         maxDepth: 0,
         hasMany: true,
         access: {
            update: () => false,
         },
      },
      {
         name: "author",
         type: "relationship",
         relationTo: "users",
         maxDepth: 2,
         required: true,
         defaultValue: ({ user }: { user: User }) => user?.id,
         access: {
            read: isCommentDeletedField,
            update: () => false,
         },
      },
   ],
};
