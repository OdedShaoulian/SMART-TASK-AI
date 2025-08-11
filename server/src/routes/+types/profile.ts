import type { LoaderFunctionArgs } from 'react-router'
export namespace Route {
  export type LoaderArgs = LoaderFunctionArgs
  export type ComponentProps = {
    loaderData: any
  }
}