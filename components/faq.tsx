'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
  return (
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 mb-10">
          Got doubts? You're not alone. Here are the answers people ask before they fall in love with HeyCal.
        </p>

        <Accordion type="single" collapsible className="w-full text-left">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is HeyCal really AI-powered?</AccordionTrigger>
            <AccordionContent>
              Yes — HeyCal uses natural language understanding to interpret what you type and schedule events accordingly. No complicated forms or syntax.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Do I need to connect my Google Calendar?</AccordionTrigger>
            <AccordionContent>
              Nope. You can use HeyCal as a standalone planner, or choose to sync it with your calendar accounts when you're ready.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Is my data safe?</AccordionTrigger>
            <AccordionContent>
              Absolutely. We don’t sell your data. Everything you type is private and encrypted. You’re always in control.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Is it free?</AccordionTrigger>
            <AccordionContent>
              HeyCal is free to use for individuals. We plan to introduce premium features for teams and power users, but the core chat experience will always remain free.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Can I use it on my phone?</AccordionTrigger>
            <AccordionContent>
              Yes. HeyCal is optimized for mobile and works great in your browser. Native apps are on the way!
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}