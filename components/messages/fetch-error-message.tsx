"use client"

import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function FetchErrorMessage({
  service,
}: {
  service: string
}): JSX.Element {
  return (
    <Alert>
      <AlertTitle className="mb-6 flex">
        <AlertCircle className="h-4 w-4 mr-2" />
        Failed to fetch from {service}
      </AlertTitle>
      <AlertDescription>
        <div className="mb-6">
          Fetching media from {service} failed. This may be due to a rate limit
          issue with the default API key. Go to the Cosmic Media read me to
          learn how to add your own service keys.
        </div>
        <div className="text-right">
          <a
            href="https://github.com/cosmicjs/cosmic-media-extension#service-keys"
            rel="noreferrer"
            target="_blank"
          >
            <Button>Get {service} service key</Button>
          </a>
        </div>
      </AlertDescription>
    </Alert>
  )
}
