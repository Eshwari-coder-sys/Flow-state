
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <HeartPulse className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">FlowState</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
          <Link href="#features" className="hover:text-primary transition-colors" prefetch={false}>
            Features
          </Link>
          <Link href="#testimonials" className="hover:text-primary transition-colors" prefetch={false}>
            Testimonials
          </Link>
          <Link href="#contact" className="hover:text-primary transition-colors" prefetch={false}>
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
              Revolutionizing Blood Management
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              FlowState provides a seamless, AI-powered platform to manage blood inventory, donations, and requests efficiently, ensuring life-saving resources are always available.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
          <div className="mt-16 md:mt-24 rounded-2xl border shadow-xl overflow-hidden">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="Dashboard preview"
              width={1200}
              height={600}
              data-ai-hint="app dashboard health"
              className="w-full"
            />
          </div>
        </section>

        <section id="features" className="bg-secondary py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Powerful Features, Simplified</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to optimize your blood bank operations, all in one place.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <ShieldCheck className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Real-Time Inventory</h3>
                <p className="mt-2 text-muted-foreground">Track every unit of blood with detailed information on type, status, and expiry dates.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <BarChart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">AI-Powered Forecasting</h3>
                <p className="mt-2 text-muted-foreground">Predict future demand with our smart AI to prevent shortages and reduce waste.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">Streamlined Donations</h3>
                <p className="mt-2 text-muted-foreground">Manage donor appointments and requests seamlessly through our intuitive interface.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">A Community of Lifesavers</h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Join a network of donors and healthcare professionals dedicated to making a difference. Our platform connects those in need with those who can help, creating a stronger, healthier community.
                        </p>
                        <div className="mt-8">
                            <Button asChild>
                                <Link href="/donate">Become a Donor</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="https://placehold.co/600x400.png"
                            alt="A group of smiling blood donors"
                            width={600}
                            height={400}
                            data-ai-hint="blood donation"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section id="testimonials" className="py-20 md:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Trusted by Leading Health Organizations</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Here's what professionals are saying about FlowState.
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="italic">"FlowState has been a game-changer for our inventory management. The AI forecasting is incredibly accurate and has helped us reduce waste by over 30%."</p>
                            <div className="mt-4 flex items-center gap-4">
                                <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Dr. Emily Carter" width={48} height={48} className="rounded-full" />
                                <div>
                                    <p className="font-semibold">Dr. Emily Carter</p>
                                    <p className="text-sm text-muted-foreground">Head of Transfusion Services</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="pt-6">
                            <p className="italic">"The user interface is so intuitive. Our staff was able to get up and running in a single afternoon. It simplified our entire workflow from donation to transfusion."</p>
                             <div className="mt-4 flex items-center gap-4">
                                <Image src="https://i.pravatar.cc/150?u=b042581f4e29026704e" alt="Mark Chen" width={48} height={48} className="rounded-full" />
                                <div>
                                    <p className="font-semibold">Mark Chen</p>
                                    <p className="text-sm text-muted-foreground">Blood Bank Manager</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardContent className="pt-6">
                           <p className="italic">"A vital tool for any modern healthcare facility. The ability to see real-time data and generate reports has improved our efficiency and patient care."</p>
                             <div className="mt-4 flex items-center gap-4">
                                <Image src="https://i.pravatar.cc/150?u=c042581f4e29026704f" alt="Dr. Anya Sharma" width={48} height={48} className="rounded-full" />
                                <div>
                                    <p className="font-semibold">Dr. Anya Sharma</p>
                                    <p className="text-sm text-muted-foreground">Hospital Administrator</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

      </main>

      <footer id="contact" className="bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FlowState. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
