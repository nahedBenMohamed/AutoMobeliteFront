"use client";

import React, { Suspense } from 'react';
import Home from '@/app/admin/componennt/dashboard/home';
import Nav from '@/app/admin/componennt/dashboard/nav';
function page() {
    return (
      <main>
        <Suspense>
          {/* @ts-expect-error Server Component */}
          <Nav />
        </Suspense>
          <Home />
      </main>


    );
}

export default page;