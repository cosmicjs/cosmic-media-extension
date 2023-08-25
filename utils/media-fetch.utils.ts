let currentAbortController: AbortController | null = null

//this is still work in progress and will be replacing native fetch.

export async function mediaFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  // Abort the previous request, if it exists
  if (currentAbortController) {
    currentAbortController.abort()
  }

  // Create a new abort controller and store it in the variable
  currentAbortController = new AbortController()

  // Add the signal from the controller to the fetch options
  const fetchOptions: RequestInit = {
    ...options,
    signal: currentAbortController.signal,
  }

  try {
    const response = await fetch(url, fetchOptions)
    currentAbortController = null // Clear the current controller since the request is complete
    return response
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request was aborted:", error.message)
    } else {
      console.error("Fetch error:", error)
    }
    currentAbortController = null // Clear the current controller in case of errors
    throw error
  }
}

//another option is to try use axios & try it's cancellation
