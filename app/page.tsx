import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Clock, BookOpen, MessageCircle, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/Gemini_Generated_Image_ivna3qivna3qivna.png" alt="Saathi Logo" className="h-12 w-12 rounded-lg object-cover" />
              <span className="text-xl font-bold text-foreground">Saathi</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/login" legacyBehavior>
                <Button asChild variant="outline" size="sm">
                  <a>Sign In</a>
                </Button>
              </Link>
              <Link href="/register" legacyBehavior>
                <Button asChild size="sm">
                  <a>Get Started</a>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="text-sm">
              Confidential • Accessible • Stigma-Free
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
              Your Mental Health
              <span className="text-primary block">Matters</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              A comprehensive digital platform providing accessible, professional mental health support for college
              students. Get the help you deserve, when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" legacyBehavior>
                <Button asChild size="lg" className="text-lg px-8">
                  <a>Start Your Journey</a>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">60%</div>
              <p className="text-muted-foreground">of students experience overwhelming anxiety</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">40%</div>
              <p className="text-muted-foreground">report feeling so depressed it's difficult to function</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <p className="text-muted-foreground">support available when you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Support Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access a full range of mental health resources designed specifically for college students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Crisis Support</CardTitle>
                <CardDescription>
                  Immediate help when you need it most. 24/7 crisis intervention and emergency support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Get Immediate Help
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Counseling Sessions</CardTitle>
                <CardDescription>
                  One-on-one sessions with licensed mental health professionals who understand student life.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Book Session
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Self-Help Resources</CardTitle>
                <CardDescription>
                  Guided exercises, mindfulness tools, and educational content for mental wellness.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Explore Resources
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Assessment Tools</CardTitle>
                <CardDescription>
                  Confidential mental health screenings to help identify areas where you might need support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Take Assessment
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Peer Support</CardTitle>
                <CardDescription>
                  Connect with other students who understand your experiences in a safe, moderated environment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Wellness Tracking</CardTitle>
                <CardDescription>
                  Monitor your mental health journey with mood tracking and progress insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Start Tracking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Breaking Down Barriers to Mental Health Care</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">The Challenge</h3>
                <p className="text-muted-foreground">
                  Mental health issues among college students have reached crisis levels, with anxiety, depression, and
                  academic stress affecting the majority of students. Yet many barriers prevent students from getting
                  the help they need.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Our Solution</h3>
                <p className="text-muted-foreground">
                  MindCare provides a comprehensive, accessible, and stigma-free platform that brings professional
                  mental health support directly to students, removing traditional barriers to care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Take the First Step?</h2>
          <p className="text-xl text-muted-foreground">
            Your mental health journey starts with a single step. We're here to support you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" legacyBehavior>
              <Button asChild size="lg" className="text-lg px-8">
                <a>Create Account</a>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Talk to Someone Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/Gemini_Generated_Image_ivna3qivna3qivna.png" alt="Saathi Logo" className="h-10 w-10 rounded-lg object-cover" />
              <span className="text-lg font-bold">Saathi</span>
              </div>
              <p className="text-muted-foreground">
                Providing accessible mental health support for college students everywhere.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Crisis Support
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Book Counseling
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Self-Help Tools
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Community
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Mental Health Info
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Campus Resources
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Emergency Contacts
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Emergency Contact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>Crisis Hotline: 988</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>Text: HOME to 741741</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>support@mindcare.edu</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MindCare. All rights reserved. • Confidential & HIPAA Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
