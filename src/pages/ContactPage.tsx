import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+254 700 000 000', '+254 711 000 000'],
    action: 'tel:+254700000000',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['support@coursematch.co.ke', 'info@coursematch.co.ke'],
    action: 'mailto:support@coursematch.co.ke',
  },
  {
    icon: MapPin,
    title: 'Office',
    details: ['ACK Garden House, 1st Floor', 'Nairobi, Kenya'],
    action: null,
  },
  {
    icon: Clock,
    title: 'Hours',
    details: ['Mon - Fri: 8AM - 6PM', 'Sat: 9AM - 1PM'],
    action: null,
  },
];

const inquiryTypes = [
  'General Inquiry',
  'Course Information',
  'Technical Support',
  'Feedback & Suggestions',
  'Partnership',
  'Other',
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: 'Message Sent!',
      description: 'We\'ll get back to you within 24 hours.',
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      inquiryType: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | CourseMatch - Find Your Perfect Course</title>
        <meta
          name="description"
          content="Get in touch with the CourseMatch team. We're here to help with your course discovery questions."
        />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="gradient-coral py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
                Have questions about CourseMatch? We're here to help. Reach out to our friendly team.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-20 bg-muted">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Contact Info Cards */}
                  <div className="lg:col-span-1 space-y-4">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      return (
                        <div
                          key={index}
                          className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                              {info.details.map((detail, i) => (
                                <p key={i} className="text-sm text-muted-foreground">
                                  {info.action && i === 0 ? (
                                    <a
                                      href={info.action}
                                      className="hover:text-secondary transition-colors"
                                    >
                                      {detail}
                                    </a>
                                  ) : (
                                    detail
                                  )}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* WhatsApp Button */}
                    <a
                      href="https://wa.me/254700000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        variant="teal"
                        size="lg"
                        className="w-full"
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </div>

                  {/* Contact Form */}
                  <div className="lg:col-span-2">
                    <div className="bg-card rounded-2xl p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-foreground mb-2">Send us a message</h2>
                      <p className="text-muted-foreground mb-6">
                        Fill out the form below and we'll get back to you within 24 hours.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={(e) => updateFormData('name', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={(e) => updateFormData('email', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="0712 345 678"
                              value={formData.phone}
                              onChange={(e) => updateFormData('phone', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType">Inquiry Type</Label>
                            <Select
                              value={formData.inquiryType}
                              onValueChange={(value) => updateFormData('inquiryType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                              <SelectContent>
                                {inquiryTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={(e) => updateFormData('message', e.target.value)}
                            rows={5}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="teal"
                          size="lg"
                          className="w-full md:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            'Sending...'
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Map Section (Placeholder) */}
          <section className="h-80 bg-muted relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground">Visit Our Office</h3>
                <p className="text-muted-foreground">ACK Garden House, 1st Floor, Nairobi</p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
