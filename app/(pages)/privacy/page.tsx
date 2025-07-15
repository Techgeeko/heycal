import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PrivacyPolicyPage from "./_component/page"

export const metadata: Metadata = {
  title: 'Privacy Policy'
}

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <PrivacyPolicyPage />
      <Footer />
    </>
  )
}