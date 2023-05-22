"use client";

import React from "react";
import TableUsers from '@/app/admin/componennt/listUsers/UserList';
import { Card } from '@tremor/react';
function page() {
  const mainStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
  };
  return (
    <main style={mainStyles}>
      <Card className="mt-8">
        <TableUsers />
      </Card>
    </main>
  );
}

export default page;