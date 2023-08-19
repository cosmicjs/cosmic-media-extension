"use client"

import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function SaveErrorMessage(): JSX.Element {
  return (
    <DialogHeader>
      <DialogTitle className="mb-4">Log in to Cosmic</DialogTitle>
      <DialogDescription>
        <div className="mb-6">
          You will need to open this extension from your Cosmic dashboard to
          save media. Log in and go to your Project / Bucket / Extensions.
        </div>
        <div className="text-right">
          <a
            href="https://app.cosmicjs.com/login"
            rel="noreferrer"
            target="_blank"
          >
            <Button>Log in to Cosmic</Button>
          </a>
        </div>
      </DialogDescription>
    </DialogHeader>
  )
}
