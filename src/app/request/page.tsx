
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Send, UserSearch, Phone, Loader2, BellRing } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import type { Donor } from "@/lib/types";
import { useDonors } from "@/context/donor-context";

const requestFormSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters."),
  hospital: z.string().min(3, "Hospital name is required."),
  city: z.string().min(2, "City is required to find nearby donors."),
  state: z.string().min(2, "State is required to find nearby donors."),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  units: z.coerce.number().min(1, "At least one unit must be requested."),
  urgency: z.enum(["Routine", "Urgent", "Emergency"]),
});

export default function RequestPage() {
  const { toast } = useToast();
  const { donors, requestBlood, fulfillRequestByDonor } = useDonors();
  const [suggestedDonors, setSuggestedDonors] = useState<Donor[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<z.infer<typeof requestFormSchema>>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      units: 1,
      patientName: "",
      hospital: "",
      city: "",
      state: "",
    },
  });

  const watchedBloodType = form.watch("bloodType");
  const watchedCity = form.watch("city");
  const watchedState = form.watch("state");

  useEffect(() => {
    if (watchedBloodType && watchedCity && watchedState) {
      setIsSearching(true);
      setSuggestedDonors([]);

      const timer = setTimeout(() => {
        const filteredDonors = donors.filter(
          (donor) =>
            donor.bloodType === watchedBloodType &&
            donor.city.toLowerCase() === watchedCity.toLowerCase().trim() &&
            donor.state.toLowerCase() === watchedState.toLowerCase().trim()
        );
        setSuggestedDonors(filteredDonors);
        setIsSearching(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [watchedBloodType, watchedCity, watchedState, donors]);

  function onSubmit(data: z.infer<typeof requestFormSchema>) {
    const requestSuccessful = requestBlood(data.bloodType, data.units);

    if (requestSuccessful) {
      form.reset({
        ...data,
        patientName: "",
        hospital: "",
        units: 1,
      });
    }
  }

  function handleAcceptRequest(donorToAccept: Donor) {
    fulfillRequestByDonor(donorToAccept);
    setSuggestedDonors(prev => prev.filter(d => d.id !== donorToAccept.id));
  }

  return (
    <div className="flex flex-col gap-8">
      <Header title="Request Blood" />
      <main className="grid flex-1 gap-8 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Submit a Blood Request</CardTitle>
                <CardDescription>
                  For use by hospitals and clinics. This will reserve units from the central inventory. We'll also automatically search for nearby donors for direct contact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="patientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hospital"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hospital/Clinic</FormLabel>
                            <FormControl>
                              <Input placeholder="City General Hospital" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Springfield" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State / Province</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. IL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="bloodType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Type Needed</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="units"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Units (Bags)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {["Routine", "Urgent", "Emergency"].map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      <Send className="mr-2" />
                      Submit Request
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserSearch />
                  Nearby Donor Suggestions
                </CardTitle>
                <CardDescription>
                  Donors matching the requested blood type and location will appear here automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Searching...</p>
                  </div>
                )}
                {!isSearching && suggestedDonors.length > 0 && (
                  <ul className="space-y-4">
                    {suggestedDonors.map((donor) => (
                      <li
                        key={donor.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                      >
                        <div>
                          <p className="font-semibold">{donor.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            Blood Type: {donor.bloodType}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleAcceptRequest(donor)}>
                            <BellRing className="mr-2" />
                            Accept Request
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                {!isSearching &&
                  suggestedDonors.length === 0 &&
                  watchedBloodType &&
                  watchedCity &&
                  watchedState && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No donors found matching your criteria.
                    </p>
                  )}
                {!isSearching && (!watchedBloodType || !watchedCity || !watchedState) && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Please fill in the city, state, and blood type fields to see suggestions.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
