// Type declarations for individual lucide-react icon imports
// This allows tree-shaking by importing icons individually from ESM modules

declare module 'lucide-react/dist/esm/icons/*' {
  import { LucideIcon } from 'lucide-react';
  const icon: LucideIcon;
  export default icon;
}
