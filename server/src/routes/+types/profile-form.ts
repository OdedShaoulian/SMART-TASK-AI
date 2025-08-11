export namespace Route {
  export type ActionArgs = {
    request: Request
    params: Record<string, string | undefined>
    context?: any
  }

  export type ComponentProps = {
    actionData: {
      name?: string
      user: string
    }
  }
}
