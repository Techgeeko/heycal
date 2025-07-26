import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import TermsPage from "./_component/page"

export const metadata: Metadata = {
  title: 'Terms of Service'
}

export default function Terms() {
  return (
    <>
      <Header />
      <TermsPage />
      <Footer />
    </>
  )
}