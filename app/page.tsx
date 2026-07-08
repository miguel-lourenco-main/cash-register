import CashRegisterClient from "@/components/cash-register-client"

// Enable static export
export const dynamic = 'force-static'

/** Root route — delegates to the client-side product loader and register UI. */
export default function Home() {
  return <CashRegisterClient />
}
