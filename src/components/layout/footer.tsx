import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { Container } from "@/components/layout/container"

// DESIGN §1 hard rule: secondary gray (#9B9489) is for >18px text only, never small
// text — so all footer copy uses full-contrast graphite (text-foreground), not secondary.
// Contacts are a placeholder stub; real data is a pending owner input.
// Nav links dropped (owner decision): the header is sticky/always visible now, so
// repeating the same links here just reads as a second nav bar at the bottom.
async function Footer() {
  const tf = await getTranslations("Footer")

  return (
    <footer className="border-t border-border-default">
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <Link
            href="/"
            className="font-display text-xl font-normal text-foreground"
          >
            Luxury Store
          </Link>

          <div className="flex flex-col gap-1 text-sm text-foreground">
            <span>{tf("cities")}</span>
            <span>{tf("phone")}</span>
            <span>{tf("email")}</span>
          </div>
        </div>

        <p className="border-t border-border-subtle pt-6 text-xs text-foreground">
          {tf("rights")}
        </p>
      </Container>
    </footer>
  )
}

export { Footer }
