import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/constants";

const FAQsPage = () => {
  

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find answers to common questions about shopping with Cartzi. Can't
          find what you're looking for?
          <a href="/contact" className="text-accent hover:underline ml-1">
            Contact our customer service team
          </a>
          .
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-foreground hover:text-accent">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-muted-foreground mb-4">
            If you couldn't find the answer you're looking for, our customer
            service team is here to help!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Contact Us</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Get in touch with our support team
              </p>
              <a
                href="/contact"
                className="text-accent hover:underline text-sm font-medium"
              >
                Send us a message →
              </a>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Chat with us in real-time
              </p>
              <p className="text-muted-foreground text-sm">
                Available Mon-Fri, 9AM-6PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQsPage;
