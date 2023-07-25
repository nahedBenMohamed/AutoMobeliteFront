"use strict"

export { default } from "next-auth/middleware";

export const config =
    { matcher: [
    "/edit-profile",
    "/manage-reservations",
    "/reservations/edit/"
    ]
    };
