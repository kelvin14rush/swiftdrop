// Ambient declarations so TypeScript accepts CSS side-effect / module imports.
// Metro & Expo bundle these at build time; this just satisfies `tsc --noEmit`.
declare module '*.css';
