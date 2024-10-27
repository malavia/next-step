// src/lib/utils.js ou src/lib/utils.ts

// La fonction `cn` pour combiner des classes conditionnellement
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
  }
  