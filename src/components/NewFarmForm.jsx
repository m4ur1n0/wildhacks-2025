"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { createFarm } from "@/lib/db";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { geocodeWithLocationIQ } from "@/lib/geocode";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Farm name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  pricePerShare: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  numShares: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number.isInteger(Number(val)), {
    message: "Total shares must be a positive integer",
  }),
  deliveryStyle: z.enum(["pickup", "dropoff"], {
    required_error: "Please select a delivery method",
  }),
  bio: z.string().max(1000, {
    message: "Bio must not exceed 1000 characters.",
  }).optional(),
});

const NewFarmForm = () => {
  const [loading, setLoading] = useState(false);
  const {user, refreshLocalFarm} = useAuth();
  const router = useRouter();
  // form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      email: "",
      pricePerShare: "",
      numShares: "",
      bio: "",
      deliveryStyle: "pickup",
    },
  });

  // submit handler
  async function onSubmit(values) {
    setLoading(true);
    // get lat and long of farm
    const coords = await geocodeWithLocationIQ(values.address);
    const submissionData = {
      ...values,
      pricePerShare: Number(values.pricePerShare),
      numShares: Number(values.numShares),
      numSharesLeft : Number(values.numShares),
      location : coords,
      profilePhoto : user.photoURL
    };
    console.log(submissionData);
    
    await createFarm(user.uid, values); // the googel account's uid becomes the farm's id
    // setLoading(false);
    await refreshLocalFarm();

    router.push(`/farm#${user.uid}`); // redirect to the new farm page!

  }

  return (
    <div className="w-full flex flex-col justify-center">
      { loading ?
        // <LoadingSpinner />
        <p>Loading...</p>
        :
        <div className="p-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Farm Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Farm Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              {/* Address Field */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter a valid physical address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              {/* Price Per Share Field */}
              <FormField
                control={form.control}
                name="pricePerShare"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Share ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              {/* Total Shares Field */}
              <FormField
                control={form.control}
                name="numShares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Shares</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              {/* Delivery Style Field */}
              <FormField
                control={form.control}
                name="deliveryStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a delivery method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pickup">Pick Up</SelectItem>
                        <SelectItem value="dropoff">Drop Off Location</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              {/* Bio Field */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little about yourself..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Max 1000 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
        }
    </div>
  );
  
};

export default NewFarmForm;
