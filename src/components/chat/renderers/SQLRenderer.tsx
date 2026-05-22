"use client";

import { SQLBlock } from "../../chat/SQLBlock";

export function SQLRenderer({
  sql,
}: {
  sql: string;
}) {
  return <SQLBlock sql={sql} />;
}