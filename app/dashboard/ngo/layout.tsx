import { NgoLayoutClient } from './ngo-layout-client';

export default function NgoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NgoLayoutClient>{children}</NgoLayoutClient>;
}
