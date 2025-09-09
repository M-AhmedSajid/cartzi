import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const ContactPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Have a question or need assistance? We'd love to hear from you. Send
          us a message and we'll respond as soon as possible.
        </p>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                required
                className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                required
                className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              required
              className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              placeholder="What is this about?"
              required
              className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              rows={6}
              required
              className="border-accent focus-visible:ring-2 focus-visible:ring-accent/90 focus-visible:border-accent"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>

        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Other Ways to Reach Us
          </h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong>Email:</strong> support@cartzi.com
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00
              PM EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
