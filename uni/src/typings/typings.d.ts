import "vue-router";

declare module 'vue-router' {
  interface RouteMeta {
    
  }
}

type PartialNull<T> = { [P in keyof T]?: T[P] | null | undefined; }
