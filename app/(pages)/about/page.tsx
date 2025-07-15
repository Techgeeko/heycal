import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AboutUsPage from "./_component/page"

export const metadata: Metadata = {
  title: 'About us'
}

export default function AboutUs() {
  return (
    <>
      <Header />
      <AboutUsPage />
      <Footer />
    </>
  )
}